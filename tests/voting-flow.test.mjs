import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=ts.transpile(readFileSync(new URL('../lib/designmash/voting-flow.ts',import.meta.url),'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
const {VotingFlow}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
const pair=(n,category='names')=>({challenge:'challenge-'+n,configured:true,category,pair:[{id:`${category}-${n*2}`},{id:`${category}-${n*2+1}`} ]});
const ok=data=>new Response(JSON.stringify(data),{status:200});
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};

test('browser fetch is called without the flow object as its receiver',async()=>{
 let state,calls=0;
 // Browser fetch rejects an arbitrary object as `this`; Node fetch and arrow
 // function mocks do not, so earlier tests missed this browser-only failure.
 function browserFetch(url){
  if(this!==undefined&&this!==globalThis)throw new TypeError('Illegal invocation');
  calls++;return Promise.resolve(ok(url==='/api/vote'?{ok:true}:pair(calls)));
 }
 const flow=new VotingFlow('names',s=>state=s,browserFetch);flow.start();await flush();
 try {assert.equal(state.busy,false);assert.ok(state.match);await flow.vote(state.match.pair[0].id);assert.equal(state.busy,false);assert.equal(calls,3);}
 finally {flow.dispose();}
});

test('initial fetch, 20 rapid rounds, one submission per click, and repeated skips',async()=>{
 let state,round=0;const calls=[];
 const flow=new VotingFlow('names',s=>state=s,async(url,options)=>{calls.push({url,options});return ok(url.startsWith('/api/vote')?{ok:true}:pair(round++));});
 flow.start();assert.equal(state.match,null);assert.equal(state.busy,true);await flush();
 for(let i=0;i<20;i++){
  const old=state.match;const action=flow.vote(old.pair[0].id);
  assert.equal(state.busy,true);void flow.vote(old.pair[1].id);flow.skip();
  await action;assert.equal(state.busy,false);assert.ok(state.match.pair.every(e=>!old.pair.some(p=>p.id===e.id)));
 }
 assert.equal(calls.filter(c=>c.url==='/api/vote').length,20);
 for(let i=0;i<12;i++){const old=state.match;flow.skip();flow.skip();assert.equal(state.match,null);await flush();assert.notEqual(state.match.challenge,old.challenge);}
 assert.equal(calls.filter(c=>c.url==='/api/vote').length,20);flow.dispose();
});
test('waits for vote response and fresh pair before unlocking either choice',async()=>{
 let state,n=0;const vote=deferred(),next=deferred();
 const flow=new VotingFlow('logos',s=>state=s,async url=>url==='/api/vote'?vote.promise:++n===1?ok(pair(0,'logos')):next.promise);
 flow.start();await flush();const old=state.match;const pending=flow.vote(old.pair[0].id);
 await flush();assert.equal(state.match,old);assert.equal(state.busy,true);assert.equal(n,1);
 vote.resolve(ok({ok:true}));await flush();assert.equal(state.match,null);assert.equal(state.busy,true);
 next.resolve(ok(pair(1,'logos')));await pending;assert.equal(state.busy,false);flow.dispose();
});
test('expired, stale, replayed, and invalid responses silently advance',async()=>{
 for(const status of [400,404,409,410,429,503]){
  let state,n=0;const flow=new VotingFlow('names',s=>state=s,async url=>url==='/api/vote'?new Response(JSON.stringify({error:'This matchup expired. Please skip to a new pair.'}),{status}):ok(pair(n++)));
  flow.start();await flush();await flow.vote(state.match.pair[0].id);assert.equal(state.match.challenge,'challenge-1');assert.equal(state.busy,false);assert.equal('error' in state,false);flow.dispose();
 }
});
test('failed fresh-pair requests retry automatically with dead pair removed',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let state,n=0;
 const flow=new VotingFlow('names',s=>state=s,async url=>{
  if(url==='/api/vote')return ok({ok:true});
  n++;if(n===2)throw new Error('offline');if(n===3)return new Response('{}',{status:503});return ok(pair(n));
 });
 flow.start();await flush();await flow.vote(state.match.pair[0].id);
 assert.equal(state.match,null);assert.equal(state.busy,true);
 t.mock.timers.tick(400);await flush();assert.equal(state.match,null);
 t.mock.timers.tick(800);await flush();assert.equal(state.busy,false);assert.equal(n,4);flow.dispose();
});
test('category changes discard late fetch/vote responses and cancel retries',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let state;const slow=deferred();let oldCalls=0;
 const old=new VotingFlow('logos',s=>state=s,async()=>{oldCalls++;return slow.promise;});old.start();old.dispose();
 const current=new VotingFlow('ceo',s=>state=s,async()=>ok(pair(0,'ceo')));current.start();await flush();
 slow.resolve(ok(pair(1,'logos')));await flush();assert.equal(state.match.category,'ceo');assert.equal(state.busy,false);
 current.dispose();let calls=0;const failed=new VotingFlow('names',()=>{},async()=>{calls++;throw new Error('offline');});failed.start();await flush();failed.dispose();t.mock.timers.tick(10000);await flush();assert.equal(calls,1);assert.equal(oldCalls,1);
 let lateState;const response=deferred();const voting=new VotingFlow('names',s=>lateState=s,async url=>url==='/api/vote'?response.promise:ok(pair(0)));voting.start();await flush();const pending=voting.vote(lateState.match.pair[0].id);voting.dispose();response.resolve(ok({ok:true}));await pending;assert.equal(lateState.busy,true);
});
test('refresh immediately fetches a valid challenge and idle time never expires it',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let state,calls=0;const flow=new VotingFlow('names',s=>state=s,async()=>{calls++;return ok(pair(calls));});
 flow.start();await flush();const old=state.match;t.mock.timers.tick(3*60*60*1000);await flush();assert.equal(state.match,old);assert.equal(calls,1);assert.equal(state.busy,false);await flow.vote(old.pair[0].id);assert.equal(calls,3);flow.dispose();
 const refreshed=new VotingFlow('names',s=>state=s,async()=>ok(pair(100)));refreshed.start();assert.equal(state.match,null);await flush();assert.equal(state.match.challenge,'challenge-100');refreshed.dispose();
});
test('timed-out requests and overlapping competitors are retried while locked',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});let state,n=0;
 const flow=new VotingFlow('names',s=>state=s,async(url,options)=>{
  if(url==='/api/vote')return ok({ok:true});n++;
  if(n===1)return new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('timeout'))));
  return ok(pair(n===3?2:n));
 });flow.start();t.mock.timers.tick(10000);await flush();assert.equal(state.match,null);t.mock.timers.tick(400);await flush();assert.equal(state.match.challenge,'challenge-2');
 await flow.vote(state.match.pair[0].id);assert.equal(state.match,null);t.mock.timers.tick(400);await flush();assert.equal(state.match.challenge,'challenge-4');assert.equal(state.busy,false);flow.dispose();
});
