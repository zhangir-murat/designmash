import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isCategory } from '@/lib/designmash/data';
import { adminUser, ApiError, assertOrigin, config, deleteUpload, fail, jsonInput, sb, textField, upload, urlField } from '@/lib/designmash/server';
export async function GET(_:Request,{params}:{params:Promise<{action:string}>}){try{
 const {action}=await params;
 if(action==='status'){let user=null;try{user=await adminUser();}catch(e){if(!(e instanceof ApiError)||e.status!==401)throw e;}return NextResponse.json({configured:config().ready,authMode:config().authMode,user},{headers:{'Cache-Control':'no-store'}});}
 await adminUser();
 const paths:Record<string,string>={entries:'/rest/v1/entries?submission_status=eq.approved&select=*&order=created_at.desc',submissions:'/rest/v1/submissions?status=eq.pending&select=*&order=created_at.asc',removals:'/rest/v1/removal_requests?select=*&order=created_at.desc'};
 if(!paths[action])throw new ApiError('Unknown action.',404);
 return NextResponse.json(await sb(paths[action]),{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){let asset:{path:string;url:string}|null=null;try{
 const {action}=await params; assertOrigin(request);
 if(config().authMode==='chatgpt' && action==='login')throw new ApiError('Use Sign in with ChatGPT.',401);
 if(action==='login'){
  const b=await jsonInput(request);const result=await sb<any>('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:textField(b.email,254,true),password:textField(b.password,512,true)})},config().anon);
  const admins=await sb<any[]>(`/rest/v1/admins?user_id=eq.${encodeURIComponent(result.user.id)}&select=user_id`);
  if(!admins.length)throw new ApiError('This account is not an administrator.',403);
  const jar=await cookies();jar.set('dm_admin',result.access_token,{httpOnly:true,secure:new URL(request.url).protocol==='https:',sameSite:'strict',path:'/',maxAge:Math.min(result.expires_in||3600,3600)});
  return NextResponse.json({ok:true});
 }
 if(action==='logout'){const jar=await cookies();const token=jar.get('dm_admin')?.value;jar.delete('dm_admin');if(token){try{await sb('/auth/v1/logout',{method:'POST'},token);}catch{}}return NextResponse.json({ok:true});}
 await adminUser();
 if(action==='upload'){
  if(Number(request.headers.get('content-length')||0)>6*1024*1024)throw new ApiError('Images must be smaller than 5 MB.',413);
  const form=await request.formData();const id=textField(form.get('id'),160,true);const f=form.get('image');asset=await upload(f instanceof File?f:null,'entries');if(!asset)throw new ApiError('Choose an image.');
  await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({image_url:asset.url})});
  return NextResponse.json({ok:true});
 }
 const b=await jsonInput(request);const id=textField(b.id,160,action!=='create');
 if(action==='approve'){await sb('/rest/v1/rpc/approve_submission',{method:'POST',body:JSON.stringify({p_id:id})});}
 else if(action==='reject'){await sb(`/rest/v1/submissions?id=eq.${encodeURIComponent(id)}&status=eq.pending`,{method:'PATCH',body:JSON.stringify({status:'rejected'})});}
 else if(action==='review'){await sb(`/rest/v1/removal_requests?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({status:'reviewed'})});}
 else if(action==='active'){if(typeof b.active!=='boolean')throw new ApiError('Invalid status.');await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({active:b.active})});}
 else if(action==='reset'){await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({elo_rating:1500})});}
 else if(action==='delete'){
  // Preserve historical references when removing an entry that has been voted on.
  const found=await sb<any[]>(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}&select=total_votes`);
  if(!found.length)throw new ApiError('Entry not found.',404);
  if(found[0].total_votes>0){await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({active:false,submission_status:'rejected'})});return NextResponse.json({ok:true});}
  await sb(`/rest/v1/matchups?or=(left_id.eq.${encodeURIComponent(id)},right_id.eq.${encodeURIComponent(id)})`,{method:'DELETE'});
  await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'});
 }
 else if(action==='edit'||action==='create'){
  const category=textField(b.category_id,30,true);if(!isCategory(category))throw new ApiError('Choose a category.');
  const row={name:textField(b.name,100,true),company:textField(b.company,100),website_url:urlField(b.website_url),source_url:urlField(b.source_url),image_url:b.image_url?(typeof b.image_url==='string'&&(/^\/logos\/[a-z]+\.svg$/.test(b.image_url)||/^\/api\/images\/(pending|entries)\/[a-z0-9-]+\.(png|jpg|webp)$/.test(b.image_url))?b.image_url:urlField(b.image_url)):null};
  if(action==='create'){const slug=`${category}-${row.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${crypto.randomUUID().slice(0,8)}`;await sb('/rest/v1/entries',{method:'POST',body:JSON.stringify({...row,category_id:category,id:slug,slug})});}
  else{await sb(`/rest/v1/entries?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(row)});}
 }
 else throw new ApiError('Unknown action.',404);
 return NextResponse.json({ok:true});
}catch(e){if(asset)await deleteUpload(asset.path);return fail(e);}}
