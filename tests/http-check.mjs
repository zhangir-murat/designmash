import assert from 'node:assert/strict';
import {workerFetch,testDatabase} from './worker-check.mjs';
const base='http://app.test';let cookie='';
const auth={'oai-authenticated-user-id':'local-owner','oai-authenticated-user-email':'owner@example.com'};
async function req(path,opts={}){const r=await workerFetch(base+path,{...opts,headers:{...(cookie?{Cookie:cookie}:{}),...opts.headers}});const c=r.headers.get('set-cookie');if(c)cookie=c.split(';')[0];return r;}
for(const path of ['/','/logos','/names','/landing-page','/checkout-page','/chat-page','/ceo','/random','/rankings','/add','/about','/removal','/admin','/item/logos-nike']){
 const r=await req(path);assert.equal(r.status,200,path);const html=await r.text();assert.ok(html.includes('DESIGNMASH'),path);
}
for(const c of ['logos','names','landing-page','checkout-page','chat-page','ceo','random']){const r=await req(`/api/matchup?category=${c}`);const d=await r.json();assert.equal(r.status,200,JSON.stringify(d));assert.equal(d.configured,true);assert.equal(d.pair.length,2);assert.equal(d.pair[0].category_id,d.pair[1].category_id);assert.notEqual(d.pair[0].id,d.pair[1].id);assert.ok(d.challenge);}
const r=await req('/api/matchup?category=names'),m=await r.json();
testDatabase.prepare("UPDATE matchups SET created_at=datetime('now','-3 hours') WHERE id=?").run(m.challenge);
const v=await req('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge:m.challenge,winner:m.pair[0].id})});const vote=await v.json();assert.equal(v.status,200,JSON.stringify(vote));assert.equal(vote.winner_rating,1516);assert.equal(vote.loser_rating,1484);
const fresh=await (await req('/api/matchup?category=names&previous='+m.challenge)).json();assert.ok(fresh.pair.every(e=>!m.pair.some(old=>old.id===e.id)));
const replay=await req('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge:m.challenge,winner:m.pair[1].id})});assert.equal(replay.status,409);
const rank=await (await req('/api/rankings?category=names&period=all')).json();assert.equal(rank.entries[0].id,m.pair[0].id);assert.equal(rank.entries[0].wins,1);
const item=await (await req(`/api/item/${m.pair[0].slug}`)).json();assert.equal(item.item.total_votes,1);assert.equal(item.recent.length,1);
// A fresh browser session: 20 consecutive votes through the actual Worker,
// followed by repeated skips, category changes, and an initial-load refresh.
cookie='';let previous=null;let current=await (await req('/api/matchup?category=names')).json();
for(let i=0;i<20;i++){
 const response=await req('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge:current.challenge,winner:current.pair[i%2].id})});
 assert.equal(response.status,200,await response.text());previous=current;
 current=await (await req('/api/matchup?category=names&previous='+previous.challenge)).json();
 assert.ok(current.pair.every(e=>!previous.pair.some(old=>old.id===e.id)));
}
assert.equal(testDatabase.prepare('SELECT count(*) AS n FROM votes WHERE session_id=(SELECT session_id FROM matchups WHERE id=?)').get(current.challenge).n,20);
for(let i=0;i<12;i++){previous=current;current=await (await req('/api/matchup?category=names&previous='+previous.challenge)).json();assert.ok(current.pair.every(e=>!previous.pair.some(old=>old.id===e.id)));}
for(const category of ['logos','ceo','names']){current=await (await req('/api/matchup?category='+category)).json();assert.equal(current.category,category);assert.ok(current.challenge);}
const refreshed=await (await req('/api/matchup?category=names')).json();assert.notEqual(refreshed.challenge,current.challenge);assert.ok(refreshed.pair.every(e=>!current.pair.some(old=>old.id===e.id)));
const anon=await req('/api/admin/entries');assert.equal(anon.status,401);
const denied=await req('/api/admin/entries',{headers:{'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@example.com'}});assert.equal(denied.status,403);
const admin=await req('/api/admin/status',{headers:auth});const who=await admin.json();assert.equal(admin.status,200,JSON.stringify(who));assert.equal(who.user.email,auth['oai-authenticated-user-email']);
const form=new FormData();form.set('category','names');form.set('name','HTTP Test Name');
const add=await req('/api/submissions',{method:'POST',body:form});assert.equal(add.status,200,await add.text());
const submissions=await (await req('/api/admin/submissions',{headers:auth})).json();const pending=submissions.find(s=>s.name==='HTTP Test Name');assert.ok(pending);
const approve=await req('/api/admin/approve',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({id:pending.id})});assert.equal(approve.status,200,await approve.text());
const removal=await req('/api/removal',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({item_url:base+'/item/logos-nike',reason:'HTTP test',email:'test@example.com',additional_information:'Test request'})});assert.equal(removal.status,200,await removal.text());
const requests=await (await req('/api/admin/removals',{headers:auth})).json();assert.ok(requests.some(r=>r.reason==='HTTP test'));
const imageForm=new FormData();imageForm.set('category','logos');imageForm.set('name','Image Upload Test');
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1N8AAAAASUVORK5CYII=','base64');imageForm.set('image',new File([png],'pixel.png',{type:'image/png'}));
const imageAdd=await req('/api/submissions',{method:'POST',body:imageForm});assert.equal(imageAdd.status,200,await imageAdd.text());
const imagePending=(await (await req('/api/admin/submissions',{headers:auth})).json()).find(s=>s.name==='Image Upload Test');assert.ok(imagePending.image_url);
const privateImage=await req(imagePending.image_url);assert.equal(privateImage.status,401);
const adminImage=await req(imagePending.image_url,{headers:auth});assert.equal(adminImage.status,200);assert.equal(adminImage.headers.get('content-type'),'image/png');
await req('/api/admin/approve',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({id:imagePending.id})});
const publicImage=await req(imagePending.image_url);assert.equal(publicImage.status,200);assert.equal(publicImage.headers.get('content-type'),'image/png');
const removedEntry=await req('/api/admin/delete',{method:'POST',headers:{...auth,'Content-Type':'application/json'},body:JSON.stringify({id:m.pair[0].id})});assert.equal(removedEntry.status,200);
assert.equal((await req('/api/item/'+m.pair[0].slug)).status,404);
const cross=await req('/api/vote',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://evil.example'},body:'{}'});assert.equal(cross.status,403);
const bad=await req('/no-such-category');assert.equal(bad.status,404);
console.log('PASS: three-hour-old challenge, 20 consecutive Elo votes, both competitors replaced every round, 12 skips, category switching, refresh, all routes, replay protection, persistent rankings/history, moderation, owner authorization, image access, and cross-origin rejection.');
