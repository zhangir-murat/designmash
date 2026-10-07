import { env } from 'cloudflare:workers';
import { adminUser, ApiError, fail, sb } from '@/lib/designmash/server';
export async function GET(_:Request,{params}:{params:Promise<{path:string[]}>}){try{
 const path=(await params).path.join('/');
 if(!/^(pending|entries)\/[a-z0-9-]+\.(png|jpg|webp)$/.test(path))throw new ApiError('Image not found.',404);
 const publicEntries=await sb<any[]>(`/rest/v1/entries?image_url=eq.${encodeURIComponent('/api/images/'+path)}&active=eq.true&submission_status=eq.approved&select=id`);
 if(!publicEntries.length)await adminUser();
 const file=await (env as any).BUCKET.get(path);if(!file)throw new ApiError('Image not found.',404);
 return new Response(file.body,{headers:{'Content-Type':file.httpMetadata?.contentType||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':publicEntries.length?'public, max-age=3600':'private, no-store'}});
}catch(e){return fail(e);}}
