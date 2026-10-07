import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { localStore, Database } from './store';
import { ApiError } from './errors';
export { ApiError } from './errors';
import type { Entry } from './data';
import { seedEntries, isCategory } from './data';
export function config() {
  const e = env as unknown as Record<string,string>;
  const url=e.SUPABASE_URL || process.env.SUPABASE_URL;
  const service=e.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon=e.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  return { url, service, anon, ready: Boolean(e.DB || (url && service && anon)), authMode: e.DB ? 'chatgpt' : 'supabase' };
}
export async function sb<T = any>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  if ((env as any).DB && path.startsWith('/rest/v1/')) return localStore<T>((env as any).DB as Database,path,init);
  const c=config();
  if(!c.ready) throw new ApiError('This feature is waiting for the database connection.',503);
  const response=await fetch(`${c.url}${path}`, { ...init, cache:'no-store', headers: { apikey:c.anon!, Authorization:`Bearer ${token || c.service}`, 'Content-Type':'application/json', ...init.headers } });
  const body=await response.text();
  let parsed:any; try { parsed=body?JSON.parse(body):null; } catch { parsed=null; }
  if(!response.ok) {
    console.error('Supabase request failed', path.split('?')[0], response.status, parsed?.code);
    const msg=parsed?.message || parsed?.msg || parsed?.error_description || '';
    if(/RATE_LIMIT/.test(msg)) throw new ApiError('Please wait a moment before trying again.',429);
    if(/DUPLICATE_VOTE/.test(msg)) throw new ApiError('That matchup has already been counted.',409);
    if(/INVALID_MATCHUP/.test(msg)) throw new ApiError('Invalid matchup.',409);
    throw new ApiError(response.status===401?'Sign in to continue.':'The request could not be saved. Please try again.',response.status>=500?503:400);
  }
  return parsed as T;
}
export function assertOrigin(request: Request) {
  const origin=request.headers.get('origin');
  if(origin && origin !== new URL(request.url).origin) throw new ApiError('Request not allowed.',403);
  if(request.headers.get('sec-fetch-site') === 'cross-site') throw new ApiError('Request not allowed.',403);
}
export async function jsonInput(request: Request) { assertOrigin(request); if(Number(request.headers.get('content-length')||0)>25000) throw new ApiError('Request too large.',413); try{return await request.json();}catch{throw new ApiError('Please check your form.');} }
export function textField(value: unknown, max: number, required=false): string {
  const s=typeof value==='string'?value.trim():'';
  if(s.length>max || (required&&!s)) throw new ApiError('Please complete the required fields and keep them within the length limits.');
  return s;
}
export function urlField(value: unknown, required=false) {
  const s=textField(value,2048,required); if(!s) return '';
  let u:URL; try{u=new URL(s);}catch{throw new ApiError('Please use a complete http or https URL.');}
  if(!['http:','https:'].includes(u.protocol)) throw new ApiError('Please use an http or https URL.');
  return u.href;
}
export async function session(request?:Request) {
  const jar=await cookies(); const saved=jar.get('dm_session')?.value;
  if(saved && /^[0-9a-f-]{36}$/.test(saved)) return saved;
  const id=crypto.randomUUID();
  jar.set('dm_session',id,{httpOnly:true,sameSite:'lax',secure:request?new URL(request.url).protocol==='https:':process.env.NODE_ENV==='production',maxAge:60*60*24*365,path:'/'});
  return id;
}
export function fail(error:unknown) { const e=error instanceof ApiError?error:new ApiError('Something went wrong. Please try again.',503); if(!(error instanceof ApiError))console.error(error); return NextResponse.json({error:e.message},{status:e.status,headers:{'Cache-Control':'no-store'}}); }
export async function entries(category?:string) {
  if(category && !isCategory(category)) throw new ApiError('Unknown category.');
  if(!config().ready) return seedEntries.filter(e=>!category||e.category_id===category);
  return sb<Entry[]>(`/rest/v1/entries?active=eq.true&submission_status=eq.approved&select=*&order=slug.asc${category?`&category_id=eq.${category}`:''}`);
}
export async function adminUser() {
  if(config().authMode==='chatgpt'){
    const h=await headers();const email=h.get('oai-authenticated-user-email');const id=h.get('oai-authenticated-user-id');
    const allowed=(env as any).DESIGNMASH_ADMIN_EMAIL || process.env.DESIGNMASH_ADMIN_EMAIL;
    if(!email||!id)throw new ApiError('Sign in to continue.',401);
    if(!allowed || email.toLowerCase()!==allowed.toLowerCase())throw new ApiError('This account is not an administrator.',403);
    return {id,email};
  }
  const jar=await cookies();const token=jar.get('dm_admin')?.value;
  if(!token) throw new ApiError('Sign in to continue.',401);
  let user:{id:string;email:string};
  try{user=await sb('/auth/v1/user',{},token);}catch{throw new ApiError('Your sign-in expired. Please sign in again.',401);}
  const admins=await sb<any[]>(`/rest/v1/admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`);
  if(!admins.length) throw new ApiError('This account is not an administrator.',403);
  return user;
}
export async function upload(file:File | null, folder:string) {
  if(!file || !file.size) return null;
  if(file.size>5*1024*1024) throw new ApiError('Images must be smaller than 5 MB.');
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new ApiError('Upload a PNG, JPEG, or WebP image.');
  const bytes=new Uint8Array(await file.arrayBuffer());
  const png=bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71;
  const jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255;
  const webp=String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP';
  if((file.type==='image/png'&&!png)||(file.type==='image/jpeg'&&!jpg)||(file.type==='image/webp'&&!webp)) throw new ApiError('That file is not a supported image.');
  const path=`${folder}/${crypto.randomUUID()}.${file.type==='image/jpeg'?'jpg':file.type==='image/webp'?'webp':'png'}`;
  const bucket=(env as any).BUCKET;
  if(bucket){await bucket.put(path,bytes,{httpMetadata:{contentType:file.type,cacheControl:'public, max-age=3600'}});return {path,url:`/api/images/${path}`};}
  const c=config(); if(!c.ready)throw new ApiError('Uploads are waiting for the database connection.',503);
  await sb(`/storage/v1/object/designmash/${path}`,{method:'POST',headers:{'Content-Type':file.type},body:bytes});
  return { path, url:`${c.url}/storage/v1/object/public/designmash/${path}` };
}
export async function deleteUpload(path:string) { try{if((env as any).BUCKET){await (env as any).BUCKET.delete(path);return;}await sb('/storage/v1/object/designmash',{method:'DELETE',body:JSON.stringify({prefixes:[path]})});}catch{console.error('Image cleanup failed');} }
