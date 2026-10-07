import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync,writeFileSync,readdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const tmp=mkdtempSync(join(tmpdir(),'designmash-tests-'));
for(const name of ['data','errors','store']){
 let js=ts.transpile(readFileSync(new URL(`../lib/designmash/${name}.ts`,import.meta.url),'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
 js=js.replaceAll("from './data'","from './data.mjs'").replaceAll("from './errors'","from './errors.mjs'");writeFileSync(join(tmp,name+'.mjs'),js);
}
const {localStore}=await import(pathToFileURL(join(tmp,'store.mjs')).href);
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('PRAGMA foreign_keys=ON');
const migrationDir=new URL('../drizzle/',import.meta.url);
for(const file of readdirSync(migrationDir).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL(file,migrationDir),'utf8'));
class Stmt{
 constructor(sql,values=[]){this.sql=sql;this.values=values;}
 bind(...values){return new Stmt(this.sql,values);}
 async first(){return sqlite.prepare(this.sql).get(...this.values)||null;}
 async all(){return {results:sqlite.prepare(this.sql).all(...this.values)};}
 async run(){const r=sqlite.prepare(this.sql).run(...this.values);return {meta:{changes:Number(r.changes)}};}
}
const db={prepare:s=>new Stmt(s),batch:async statements=>{sqlite.exec('BEGIN');try{const results=[];for(const stmt of statements)results.push(await stmt.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
const rpc=(name,body)=>localStore(db,'/rest/v1/rpc/'+name,{method:'POST',body:JSON.stringify(body)});
const session=crypto.randomUUID(),challenge=crypto.randomUUID();
test('durable store seeds exactly 216 entries, across all six pools',async()=>{const rows=await localStore(db,'/rest/v1/entries?active=eq.true&select=*');assert.equal(rows.length,216);assert.ok(rows.every(e=>e.active===true));});
test('atomic server vote persists both Elo changes and rejects replay',async()=>{
 await rpc('issue_matchup',{p_id:challenge,p_session:session,p_category:'names',p_left:'names-perplexity',p_right:'names-cursor'});
 const r=await rpc('cast_vote',{p_matchup:challenge,p_session:session,p_winner:'names-perplexity'});assert.equal(r.winner_rating,1516);assert.equal(r.loser_rating,1484);
 await assert.rejects(()=>rpc('cast_vote',{p_matchup:challenge,p_session:session,p_winner:'names-cursor'}),/already been counted/);
 const rows=await localStore(db,'/rest/v1/entries?category_id=eq.names');assert.equal(rows.find(e=>e.id==='names-perplexity').wins,1);assert.equal(rows.find(e=>e.id==='names-cursor').losses,1);assert.equal(rows.reduce((n,e)=>n+e.elo_rating,0),150000);
});
test('challenges reject cross-category pairs, forged sessions and outside winners',async()=>{
 await assert.rejects(()=>rpc('issue_matchup',{p_id:crypto.randomUUID(),p_session:session,p_category:'names',p_left:'names-cursor',p_right:'logos-nike'}));
 await assert.rejects(()=>rpc('cast_vote',{p_matchup:challenge,p_session:crypto.randomUUID(),p_winner:'names-perplexity'}));
 const c=crypto.randomUUID(),s=crypto.randomUUID();await rpc('issue_matchup',{p_id:c,p_session:s,p_category:'logos',p_left:'logos-nike',p_right:'logos-adidas'});await assert.rejects(()=>rpc('cast_vote',{p_matchup:c,p_session:s,p_winner:'logos-apple'}),/Invalid competitor/);
});
test('rankings and item history reflect counted votes',async()=>{
 for(const period of ['today','week','month','all']){const rows=await rpc('get_rankings',{p_category:'names',p_period:period});assert.equal(rows[0].name,'Perplexity');assert.equal(rows[0].wins,1);assert.equal(rows[0].losses,0);assert.equal(rows[0].total_votes,1);}
 const hist=await rpc('item_opponents',{p_entry:'names-perplexity'});assert.equal(hist[0].name,'Cursor');assert.equal(hist[0].wins,1);
});
test('submissions stay pending until atomically approved',async()=>{
 const id=await rpc('submit_entry',{p_data:{category:'names',name:'A Test Name',session_id:session}});const pending=await localStore(db,'/rest/v1/submissions?status=eq.pending');assert.equal(pending.length,1);
 assert.equal((await localStore(db,'/rest/v1/entries?category_id=eq.names')).length,100);
 await rpc('approve_submission',{p_id:id});assert.equal((await localStore(db,'/rest/v1/entries?category_id=eq.names')).length,101);
 await assert.rejects(()=>rpc('approve_submission',{p_id:id}),/already been reviewed/);
});
test('removal requests persist and can be reviewed',async()=>{
 const id=await rpc('request_removal',{p_data:{item_url:'https://example.com/item/test',reason:'Test reason',email:'test@example.com',session_id:session}});
 await localStore(db,`/rest/v1/removal_requests?id=eq.${id}`,{method:'PATCH',body:JSON.stringify({status:'reviewed'})});const rows=await localStore(db,`/rest/v1/removal_requests?id=eq.${id}`);assert.equal(rows[0].status,'reviewed');
});
test('entry activation, editing and rating reset persist',async()=>{
 await localStore(db,'/rest/v1/entries?id=eq.logos-nike',{method:'PATCH',body:JSON.stringify({active:false,name:'Nike Updated',elo_rating:1500})});const all=await localStore(db,'/rest/v1/entries?id=eq.logos-nike');assert.equal(all[0].active,false);assert.equal(all[0].name,'Nike Updated');assert.equal((await localStore(db,'/rest/v1/entries?id=eq.logos-nike&active=eq.true')).length,0);
});
test('unused challenges remain votable after hours; replay still cannot change Elo',async()=>{
 const c=crypto.randomUUID(),s=crypto.randomUUID();await rpc('issue_matchup',{p_id:c,p_session:s,p_category:'chat-page',p_left:'chat-page-chatgpt',p_right:'chat-page-claude'});
 sqlite.prepare("UPDATE matchups SET created_at=datetime('now','-3 hours') WHERE id=?").run(c);
 const result=await rpc('cast_vote',{p_matchup:c,p_session:s,p_winner:'chat-page-chatgpt'});assert.equal(result.ok,true);
 const before=sqlite.prepare('SELECT count(*) AS n FROM votes WHERE matchup_id=?').get(c);assert.equal(before.n,1);
 await assert.rejects(()=>rpc('cast_vote',{p_matchup:c,p_session:s,p_winner:'chat-page-claude'}),/already been counted/);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM votes WHERE matchup_id=?').get(c).n,1);
});
