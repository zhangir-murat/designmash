import {registerHooks} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));
class Stmt{constructor(sql,values=[]){this.sql=sql;this.values=values;}bind(...v){return new Stmt(this.sql,v);}async first(){return sqlite.prepare(this.sql).get(...this.values)||null;}async all(){return{results:sqlite.prepare(this.sql).all(...this.values)}}async run(){return{meta:{changes:Number(sqlite.prepare(this.sql).run(...this.values).changes)}}}}
const db={prepare:s=>new Stmt(s),batch:async a=>{sqlite.exec('BEGIN');try{const out=[];for(const s of a)out.push(await s.run());sqlite.exec('COMMIT');return out;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
const files=new Map();const bucket={put:async(p,b,m)=>files.set(p,{body:b,httpMetadata:m.httpMetadata}),get:async p=>files.get(p),delete:async p=>files.delete(p)};
globalThis.__DESIGNMASH_TEST_ENV={DB:db,BUCKET:bucket,DESIGNMASH_ADMIN_EMAIL:'owner@example.com',ASSETS:{fetch:async()=>new Response('',{status:404})}};
registerHooks({resolve(s,c,next){if(s==='cloudflare:workers')return{url:'data:text/javascript,export const env=globalThis.__DESIGNMASH_TEST_ENV;',shortCircuit:true};return next(s,c);}});
const {default:worker}=await import('../dist/server/index.js');
export const workerFetch=(url,opts)=>worker.fetch(new Request(url,opts),globalThis.__DESIGNMASH_TEST_ENV,{waitUntil(){},passThroughOnException(){}});
export const testDatabase=sqlite;
