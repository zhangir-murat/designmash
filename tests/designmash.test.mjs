import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import ts from 'typescript';
const dataSource=readFileSync(new URL('../lib/designmash/data.ts',import.meta.url),'utf8');
const data=await import('data:text/javascript;base64,'+Buffer.from(ts.transpile(dataSource,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022})).toString('base64'));
const matchSource=readFileSync(new URL('../lib/designmash/matchmaking.ts',import.meta.url),'utf8');
const mm=await import('data:text/javascript;base64,'+Buffer.from(ts.transpile(matchSource,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022})).toString('base64'));
test('exactly six concrete pools plus random, with 76 logos, 100 names, 43 checkout pages, and 10 entries in each remaining pool',()=>{
 assert.equal(data.categories.length,6);assert.equal(data.seedEntries.length,249);assert.equal(new Set(data.seedEntries.map(e=>e.id)).size,249);
 for(const c of data.categories){const pool=data.seedEntries.filter(e=>e.category_id===c.slug);assert.equal(pool.length,c.slug==='logos'?76:c.slug==='names'?100:c.slug==='checkout-page'?43:10);assert.ok(pool.every(e=>e.elo_rating===1500&&e.total_votes===0));}
});
test('all logo assets resolve locally',()=>{for(const e of data.seedEntries.filter(e=>e.category_id==='logos'))assert.ok(existsSync(new URL('../public'+e.image_url,import.meta.url)),e.name);});
test('checkout voting has enough locally bundled captures for two new competitors per round',()=>{
 const ready=data.seedEntries.filter(e=>e.category_id==='checkout-page'&&e.image_url);
 assert.ok(ready.length>=4);
 for(const e of ready){assert.ok(e.image_url.startsWith('/checkout/'));assert.ok(existsSync(new URL('../public'+e.image_url,import.meta.url)),e.name);}
 assert.equal(data.seedEntries.find(e=>e.id==='checkout-page-ulta-checkout').image_url,'/checkout/ulta.webp');
 assert.equal(data.seedEntries.find(e=>e.id==='checkout-page-lego-checkout').image_url,null);
});
test('matchmaking never repeats a pair until all 45 are exhausted',()=>{
 const pool=data.seedEntries.filter(e=>e.category_id==='chat-page');const recent=[];
 for(let i=0;i<45;i++){const [a,b]=mm.choosePair(pool,recent);assert.notEqual(a.id,b.id);assert.equal(a.category_id,b.category_id);const key=mm.pairKey(a.id,b.id);assert.ok(!recent.includes(key));recent.push(key);}
 assert.ok(mm.choosePair(pool,recent));
});
test('mixed input cannot create cross-category matchups',()=>{for(let i=0;i<300;i++){const [a,b]=mm.choosePair(data.seedEntries,[]);assert.equal(a.category_id,b.category_id);}});
test('fewer-battle entries have a measurable selection advantage',()=>{
 const pool=data.seedEntries.filter(e=>e.category_id==='names').slice(0,10).map((e,i)=>({...e,total_votes:i?1000:0}));let n=0;
 for(let i=0;i<4000;i++)if(mm.choosePair(pool,[]).some(e=>e.id===pool[0].id))n++;
 assert.ok(n>950,`${n} under-exposed appearances`);
});
test('undersized pools return no pair',()=>{assert.equal(mm.choosePair([],[]),null);assert.equal(mm.choosePair([data.seedEntries[0]],[]),null);});
test('checkout matchups exclude missing captures and on-demand screenshot URLs',()=>{
 const source=data.seedEntries.filter(e=>e.category_id==='checkout-page').slice(0,6);
 const pool=source.map((e,i)=>({...e,image_url:i===0?null:i===1?'https://s0.wp.com/mshots/v1/pending?w=1280':`/checkout/${e.slug}.webp`}));
 let previous=[];
 for(let i=0;i<20;i++){
  const pair=mm.choosePair(pool,[],Math.random,previous);assert.ok(pair);
  assert.ok(pair.every(e=>e.image_url?.startsWith('/checkout/')));
  assert.ok(pair.every(e=>!previous.includes(e.id)));previous=pair.map(e=>e.id);
 }
 assert.equal(mm.choosePair(pool.slice(0,2),[]),null);
});

test('both competitors are replaced between successive rounds',()=>{
 const pool=data.seedEntries.filter(e=>e.category_id==='logos');let previous=[];const recent=[];
 for(let i=0;i<500;i++){const pair=mm.choosePair(pool,recent,Math.random,previous);assert.ok(pair);assert.ok(pair.every(e=>!previous.includes(e.id)));previous=pair.map(e=>e.id);recent.push(mm.pairKey(...previous));if(recent.length>45)recent.shift();}
});
test('too few fresh competitors cannot silently carry a winner forward',()=>{
 const pool=data.seedEntries.filter(e=>e.category_id==='logos').slice(0,3);assert.equal(mm.choosePair(pool,[],Math.random,pool.slice(0,2).map(e=>e.id)),null);
});
