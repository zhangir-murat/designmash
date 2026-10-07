import assert from 'node:assert/strict';
import test from 'node:test';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const tmp=mkdtempSync(join(tmpdir(),'designmash-upgrade-'));
for(const name of ['data','errors','store']){
 let js=ts.transpile(readFileSync(new URL(`../lib/designmash/${name}.ts`,import.meta.url),'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
 js=js.replaceAll("from './data'","from './data.mjs'").replaceAll("from './errors'","from './errors.mjs'");writeFileSync(join(tmp,name+'.mjs'),js);
}
const {seedEntries,categories}=await import(pathToFileURL(join(tmp,'data.mjs')).href);
const oldSchema=readFileSync(new URL('../drizzle/0000_bent_scourge.sql',import.meta.url),'utf8');
const upgrade=readFileSync(new URL('../drizzle/0001_seed_updates.sql',import.meta.url),'utf8');
function adapter(sqlite){
 class Stmt{constructor(sql,values=[]){this.sql=sql;this.values=values;}bind(...values){return new Stmt(this.sql,values);}async first(){return sqlite.prepare(this.sql).get(...this.values)||null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.values)};}async run(){return {meta:{changes:Number(sqlite.prepare(this.sql).run(...this.values).changes)}};}}
 return {prepare:s=>new Stmt(s),batch:async statements=>{sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());sqlite.exec('COMMIT');return result;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
}
const freshStore=async()=>import(pathToFileURL(join(tmp,'store.mjs')).href+'?isolate='+crypto.randomUUID());
test('existing database receives 189 new entries without resetting or restoring moderated seeds',async()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');sqlite.exec(oldSchema);
 for(const c of categories)sqlite.prepare('INSERT INTO categories(id,slug,name) VALUES(?,?,?)').run(c.slug,c.slug,c.name);
 for(const c of categories)for(const e of seedEntries.filter(e=>e.category_id===c.slug).slice(0,10))sqlite.prepare('INSERT INTO entries(id,category_id,name,slug,image_url) VALUES(?,?,?,?,?)').run(e.id,e.category_id,e.name,e.slug,e.image_url);
 sqlite.exec("UPDATE entries SET elo_rating=1701,wins=5,losses=2,total_votes=7,name='Nike edited' WHERE id='logos-nike';UPDATE entries SET active=0,submission_status='rejected' WHERE id='names-cursor';DELETE FROM entries WHERE id='logos-adidas';");
 sqlite.exec(upgrade);const db=adapter(sqlite);
 await (await freshStore()).initialize(db);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM entries').get().n,248);
 const nike=sqlite.prepare("SELECT * FROM entries WHERE id='logos-nike'").get();assert.equal(nike.elo_rating,1701);assert.equal(nike.total_votes,7);assert.equal(nike.name,'Nike edited');
 const cursor=sqlite.prepare("SELECT * FROM entries WHERE id='names-cursor'").get();assert.equal(cursor.active,0);assert.equal(cursor.submission_status,'rejected');
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM entries WHERE id='logos-adidas'").get().n,0);
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM seed_updates").get().n,2);
 sqlite.exec("DELETE FROM entries WHERE id='logos-google'");
 await (await freshStore()).initialize(db);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM entries').get().n,247);
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM entries WHERE id='logos-google'").get().n,0);sqlite.close();
});
test('an already updated live database receives only the 33 checkout additions once',async()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(oldSchema);sqlite.exec(upgrade);
 for(const c of categories)sqlite.prepare('INSERT INTO categories(id,slug,name) VALUES(?,?,?)').run(c.slug,c.slug,c.name);
 const additions=seedEntries.filter(e=>e.category_id==='checkout-page').slice(10);
 for(const e of seedEntries.filter(e=>!additions.includes(e)))sqlite.prepare('INSERT INTO entries(id,category_id,name,slug,image_url) VALUES(?,?,?,?,?)').run(e.id,e.category_id,e.name,e.slug,e.image_url);
 sqlite.exec("INSERT INTO seed_updates(id) VALUES('logos-names-2026-10-06');DELETE FROM entries WHERE id='logos-adidas';UPDATE entries SET elo_rating=1703,wins=9,total_votes=9 WHERE id='checkout-page-shopify-checkout';UPDATE entries SET active=0 WHERE id='names-cursor';");
 const db=adapter(sqlite);await (await freshStore()).initialize(db);
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM entries WHERE category_id='checkout-page'").get().n,43);
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM entries WHERE id='logos-adidas'").get().n,0);
 assert.equal(sqlite.prepare("SELECT active FROM entries WHERE id='names-cursor'").get().active,0);
 assert.equal(sqlite.prepare("SELECT elo_rating FROM entries WHERE id='checkout-page-shopify-checkout'").get().elo_rating,1703);
 for(const e of additions){const row=sqlite.prepare('SELECT * FROM entries WHERE id=?').get(e.id);assert.equal(row.image_url,e.image_url);assert.equal(row.source_url,e.website_url);assert.equal(row.elo_rating,1500);}
 sqlite.exec("DELETE FROM entries WHERE id='checkout-page-microsoft-store-checkout'");
 await (await freshStore()).initialize(db);
 assert.equal(sqlite.prepare("SELECT count(*) AS n FROM entries WHERE category_id='checkout-page'").get().n,42);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM seed_updates').get().n,2);sqlite.close();
});
test('SQL seeds and frontend pools agree on IDs, names, image paths, and category counts',()=>{
 const sqlite=new DatabaseSync(':memory:');sqlite.exec(oldSchema);
 sqlite.exec(readFileSync(new URL('../supabase/seed.sql',import.meta.url),'utf8').replaceAll('public.',''));
 const rows=sqlite.prepare('SELECT * FROM entries').all();assert.equal(rows.length,249);
 for(const e of seedEntries){const row=rows.find(r=>r.id===e.id);assert.ok(row,e.id);assert.equal(row.name,e.name);assert.equal(row.image_url,e.image_url);assert.equal(row.category_id,e.category_id);}
 sqlite.exec("UPDATE entries SET elo_rating=1717 WHERE id='logos-google'");
 sqlite.exec(readFileSync(new URL('../supabase/seed.sql',import.meta.url),'utf8').replaceAll('public.',''));
 assert.equal(sqlite.prepare("SELECT elo_rating FROM entries WHERE id='logos-google'").get().elo_rating,1717);sqlite.close();
});
