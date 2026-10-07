import { categories, seedEntries } from './data';
import { ApiError } from './errors';
export type Statement = {bind(...values:any[]):Statement; first<T=any>():Promise<T|null>; all<T=any>():Promise<{results:T[]}>; run():Promise<{meta:{changes:number}}>};
export type Database = {prepare(sql:string):Statement;batch(statements:Statement[]):Promise<{results?:any[];meta:{changes:number}}[]>};
let seeded:Promise<void>|null=null;
export async function initialize(db:Database){
 if(!seeded){seeded=(async()=>{
  const statements:Statement[]=[];
  for(const c of categories)statements.push(db.prepare('INSERT OR IGNORE INTO categories(id,slug,name) VALUES(?,?,?)').bind(c.slug,c.slug,c.name));
  for(const e of seedEntries){
   statements.push(db.prepare('INSERT OR IGNORE INTO entries(id,category_id,name,company,slug,image_url,source_url,website_url) VALUES(?,?,?,?,?,?,?,?)').bind(e.id,e.category_id,e.name,e.company,e.slug,e.image_url,e.source_url,e.website_url));
   statements.push(db.prepare(`UPDATE entries SET
    image_url=CASE WHEN image_url IS NULL OR image_url='' THEN ? ELSE image_url END,
    source_url=CASE WHEN source_url='' THEN ? ELSE source_url END,
    website_url=CASE WHEN website_url='' THEN ? ELSE website_url END
    WHERE id=?`).bind(e.image_url,e.source_url,e.website_url,e.id));
  }
  for(let i=0;i<statements.length;i+=80)await db.batch(statements.slice(i,i+80));
 })().catch(e=>{seeded=null;throw e;});}await seeded;
}
const safeTablesnew Set(['entries','matchups','votes','submissions','removal_requests']);
const fields:Record<string,Set<string>>={
 entries:new Set(['id','category_id','name','company','slug','image_url','source_url','website_url','elo_rating','wins','losses','total_votes','active','submission_status','created_at']),
 matchups:new Set(['id','session_id','category_id','left_id','right_id','used','created_at']),
 votes:new Set(['id','category_id','winner_id','loser_id','session_id','matchup_id','winner_before','loser_before','winner_after','loser_after','created_at']),
 submissions:new Set(['id','category','name','company','website_url','source_url','image_url','email','status','session_id','created_at']),
 removal_requests:new Set(['id','entry_id','item_url','reason','email','additional_information','status','session_id','created_at'])
};
function filter(table:string,p:URLSearchParams){const conditions:string[]=[],values:any[]=[];
 for(const [key,value] of p){if(fields[table].has(key)){const m=value.match(/^eq\.(.*)$/);if(!m)throw new ApiError('Invalid filter.');conditions.push(`${key}=?`);values.push(m[1]==='true'?1:m[1]==='false'?0:m[1]);}}
 if(p.has('or')){const raw=p.get('or')!;if(!raw.startsWith('(')||!raw.endsWith(')'))throw new ApiError('Invalid filter.');const pieces=raw.slice(1,-1).split(',').map(part=>{const m=part.match(/^([a-z_]+)\.eq\.(.+)$/);if(!m||!fields[table].has(m[1]))throw new ApiError('Invalid filter.');values.push(m[2]);return `${m[1]}=?`;});conditions.push(`(${pieces.join(' OR ')})`);}
 return {where:conditions.length?' WHERE '+conditions.join(' AND '):'',values};
}
const norm=(r:any)=>r&&r.category_id&&r.elo_rating!==undefined?{...r,active:!!r.active}:r;
export async function localStore<T=any>(db:Database,path:string,init:RequestInit={}):Promise<T>{
 await initialize(db);const u=new URL(path,'http://store.local');const method=init.method||'GET';
 const body=init.body?JSON.parse(String(init.body)):{};
 if(u.pathname.startsWith('/rest/v1/rpc/'))return rpc(db,u.pathname.split('/').pop()!,body) as Promise<T>;
 const table=u.pathname.split('/').pop()!;if(!safeTables.has(table))throw new ApiError('Unknown operation.');
 const p=u.searchParams;const f=filter(table,p);
 if(method==='GET'){
  const selected=(p.get('select')||'*').split(',');if(selected.some(x=>x!=='*'&&!fields[table].has(x)))throw new ApiError('Invalid fields.');
  const orders=(p.get('order')||'').split(',').filter(Boolean).map(x=>{const [field,dir]=x.split('.');if(!fields[table].has(field)||!['asc','desc'].includes(dir))throw new ApiError('Invalid sort.');return `${field} ${dir}`;});
  const limit=Math.min(1000,Math.max(1,Number(p.get('limit')||1000)));
  // SQLite's timestamp default has second precision. Resolve ties by insertion
  // order so refresh/category requests exclude the actual latest issued pair.
  if(table==='matchups'&&orders.includes('created_at desc'))orders.push('rowid DESC');
  const result=await db.prepare(`SELECT ${selected.join(',')} FROM ${table}${f.where}${orders.length?' ORDER BY '+orders.join(','):''} LIMIT ?`).bind(...f.values,limit).all();
  return result.results.map(norm) as T;
 }
 if(method==='POST'){
  const keys=Object.keys(body).filter(k=>fields[table].has(k));if(!keys.length)throw new ApiError('Invalid entry.');
  await db.prepare(`INSERT INTO ${table}(${keys.join(',')}) VALUES(${keys.map(()=>'?').join(',')})`).bind(...keys.map(k=>typeof body[k]==='boolean'?Number(body[k]):body[k])).run();return null as T;
 }
 if(method==='PATCH'){
  const keys=Object.keys(body).filter(k=>fields[table].has(k));if(!keys.length||!f.where)throw new ApiError('Invalid update.');
  await db.prepare(`UPDATE ${table} SET ${keys.map(k=>`${k}=?`).join(',')}${f.where}`).bind(...keys.map(k=>typeof body[k]==='boolean'?Number(body[k]):body[k]),...f.values).run();return null as T;
 }
 if(method==='DELETE'){if(!f.where)throw new ApiError('Invalid deletion.');await db.prepare(`DELETE FROM ${table}${f.where}`).bind(...f.values).run();return null as T;}
 throw new ApiError('Unknown operation.');
}
async function rpc(db:Database,name:string,b:any):Promise<any>{
 if(name==='issue_matchup'){
  const result=await db.batch([
   db.prepare('INSERT OR IGNORE INTO sessions(id) VALUES(?)').bind(b.p_session),
   db.prepare(`INSERT INTO matchups(id,session_id,category_id,left_id,right_id)
    SELECT ?,?,?,?,? WHERE ?<>? AND
    (SELECT count(*) FROM entries WHERE id IN (?,?) AND category_id=? AND active=1 AND submission_status='approved')=2
    AND (SELECT count(*) FROM matchups WHERE session_id=? AND julianday(created_at)>julianday('now','-1 minute'))<60`).bind(b.p_id,b.p_session,b.p_category,b.p_left,b.p_right,b.p_left,b.p_right,b.p_left,b.p_right,b.p_category,b.p_session)
  ]);if(!result[1].meta.changes)throw new ApiError('Please wait a moment or choose another matchup.',429);return null;
 }
 if(name==='cast_vote')return vote(db,b);
 if(name==='get_rankings'){
  const period=b.p_period;const where=period==='today'?"julianday(v.created_at)>=julianday(date('now'))":period==='week'?"julianday(v.created_at)>=julianday('now','-7 days')":period==='month'?"julianday(v.created_at)>=julianday('now','-30 days')":'1=1';
  const result=await db.prepare(`SELECT e.*,coalesce(sum(v.winner_id=e.id),0) AS wins,coalesce(sum(v.loser_id=e.id),0) AS losses,count(v.id) AS total_votes
   FROM entries e LEFT JOIN votes v ON (v.winner_id=e.id OR v.loser_id=e.id) AND ${where}
   WHERE e.category_id=? AND e.active=1 AND e.submission_status='approved' GROUP BY e.id ORDER BY e.elo_rating DESC,e.name ASC`).bind(b.p_category).all();return result.results.map(norm);
 }
 if(name==='item_opponents'){
  const result=await db.prepare(`SELECT e.id AS opponent_id,e.name,e.slug,sum(v.winner_id=?) AS wins,sum(v.loser_id=?) AS losses
   FROM votes v JOIN entries e ON e.id=CASE WHEN v.winner_id=? THEN v.loser_id ELSE v.winner_id END
   WHERE (v.winner_id=? OR v.loser_id=?) AND e.active=1 AND e.submission_status='approved' GROUP BY e.id`).bind(b.p_entry,b.p_entry,b.p_entry,b.p_entry,b.p_entry).all();return result.results;
 }
 if(name==='submit_entry'||name==='request_removal'){
  const data=b.p_data, id=crypto.randomUUID(),table=name==='submit_entry'?'submissions':'removal_requests';
  const keys=name==='submit_entry'?['category','name','company','website_url','source_url','image_url','email','session_id']:['item_url','reason','email','additional_information','session_id'];
  const values=keys.map(k=>data[k]??(k==='image_url'?null:''));
  const r=await db.prepare(`INSERT INTO ${table}(id,${keys.join(',')}) SELECT ${[id,...values].map(()=>'?').join(',')} WHERE (SELECT count(*) FROM ${table} WHERE session_id=? AND julianday(created_at)>julianday('now','-1 hour'))<10`).bind(id,...values,data.session_id).run();
  if(!r.meta.changes)throw new ApiError('Please wait before sending another request.',429);return id;
 }
 if(name==='approve_submission'){
  const row=await db.prepare("SELECT * FROM submissions WHERE id=? AND status='pending'").bind(b.p_id).first<any>();if(!row)throw new ApiError('Submission has already been reviewed.');
  const slug=`${row.category}-${row.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${row.id.slice(0,8)}`;
  const r=await db.batch([
   db.prepare(`INSERT OR IGNORE INTO entries(id,category_id,name,company,slug,image_url,source_url,website_url)
    SELECT ?,category,name,company,?,image_url,source_url,website_url FROM submissions WHERE id=? AND status='pending'`).bind(slug,slug,b.p_id),
   db.prepare("UPDATE submissions SET status='approved' WHERE id=? AND status='pending' AND EXISTS(SELECT 1 FROM entries WHERE id=?)").bind(b.p_id,slug)
  ]);if(!r[1].meta.changes)throw new ApiError('Submission has already been reviewed.');return slug;
 }
 throw new ApiError('Unknown operation.');
}
async function vote(db:Database,b:any){
 for(let attempt=0;attempt<4;attempt++){
  const m=await db.prepare('SELECT * FROM matchups WHERE id=? AND session_id=?').bind(b.p_matchup,b.p_session).first<any>();
  if(!m)throw new ApiError('Invalid matchup.',409);
  if(m.used)throw new ApiError('That matchup has already been counted.',409);
  if(b.p_winner!==m.left_id&&b.p_winner!==m.right_id)throw new ApiError('Invalid competitor.');
  const loser=b.p_winner===m.left_id?m.right_id:m.left_id;
  const e=(await db.prepare('SELECT * FROM entries WHERE id IN (?,?)').bind(b.p_winner,loser).all<any>()).results;
  const w=e.find(x=>x.id===b.p_winner),l=e.find(x=>x.id===loser);
  if(!w||!l||!w.active||!l.active||w.category_id!==m.category_id||l.category_id!==m.category_id)throw new ApiError('This matchup is no longer available.',409);
  const delta=32*(1-1/(1+10**((l.elo_rating-w.elo_rating)/400))),id=crypto.randomUUID(),now=new Date().toISOString();
  const result=await db.batch([
   db.prepare(`INSERT INTO votes(id,category_id,winner_id,loser_id,session_id,matchup_id,winner_before,loser_before,winner_after,loser_after,created_at)
    SELECT ?,?,?,?,?,?,?,?,?,?,? FROM matchups m JOIN entries w ON w.id=? JOIN entries l ON l.id=? JOIN sessions s ON s.id=m.session_id
    WHERE m.id=? AND m.session_id=? AND m.used=0
    AND w.elo_rating=? AND l.elo_rating=? AND w.active=1 AND l.active=1 AND w.submission_status='approved' AND l.submission_status='approved'
    AND (SELECT count(*) FROM votes WHERE session_id=? AND julianday(created_at)>julianday('now','-1 minute'))<60
    AND NOT EXISTS(SELECT 1 FROM votes WHERE session_id=? AND julianday(created_at)>julianday('now','-5 minutes') AND ((winner_id=? AND loser_id=?) OR(winner_id=? AND loser_id=?)))`)
    .bind(id,m.category_id,w.id,l.id,b.p_session,m.id,w.elo_rating,l.elo_rating,w.elo_rating+delta,l.elo_rating-delta,now,w.id,l.id,m.id,b.p_session,w.elo_rating,l.elo_rating,b.p_session,b.p_session,w.id,l.id,l.id,w.id),
   db.prepare('UPDATE entries SET elo_rating=(SELECT winner_after FROM votes WHERE id=?),wins=wins+1,total_votes=total_votes+1 WHERE id=? AND EXISTS(SELECT 1 FROM votes WHERE id=?)').bind(id,w.id,id),
   db.prepare('UPDATE entries SET elo_rating=(SELECT loser_after FROM votes WHERE id=?),losses=losses+1,total_votes=total_votes+1 WHERE id=? AND EXISTS(SELECT 1 FROM votes WHERE id=?)').bind(id,l.id,id),
   db.prepare('UPDATE matchups SET used=1 WHERE id=? AND EXISTS(SELECT 1 FROM votes WHERE id=?)').bind(m.id,id),
   db.prepare('UPDATE sessions SET last_vote_at=? WHERE id=? AND EXISTS(SELECT 1 FROM votes WHERE id=?)').bind(now,b.p_session,id)
  ]);
  if(result[0].meta.changes)return {ok:true,winner_rating:w.elo_rating+delta,loser_rating:l.elo_rating-delta};
  const current=await db.prepare('SELECT used FROM matchups WHERE id=?').bind(m.id).first<any>();if(current?.used)throw new ApiError('That matchup has already been counted.',409);
  const repeated=await db.prepare("SELECT id FROM votes WHERE session_id=? AND julianday(created_at)>julianday('now','-5 minutes') AND ((winner_id=? AND loser_id=?) OR(winner_id=? AND loser_id=?)) LIMIT 1").bind(b.p_session,w.id,l.id,l.id,w.id).first();if(repeated)throw new ApiError('You have already voted on this pair recently.',409);
 }
 throw new ApiError('Please try your vote again.',429);
}
