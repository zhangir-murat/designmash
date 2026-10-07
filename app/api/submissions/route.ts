import { NextResponse } from 'next/server';
import { isCategory } from '@/lib/designmash/data';
import { ApiError, assertOrigin, fail, sb, session, textField, urlField, upload, deleteUpload } from '@/lib/designmash/server';
export async function POST(request:Request){let asset:{path:string;url:string}|null=null;try{
  assertOrigin(request);if(Number(request.headers.get('content-length')||0)>6*1024*1024)throw new ApiError('Images must be smaller than 5 MB.',413);
  const form=await request.formData();const category=textField(form.get('category'),30,true);
  if(!isCategory(category))throw new ApiError('Choose a category.');
  const record={category,name:textField(form.get('name'),100,true),company:textField(form.get('company'),100),website_url:urlField(form.get('website_url')),source_url:urlField(form.get('source_url')),email:textField(form.get('email'),254),session_id:await session(request)};
  const f=form.get('image');asset=await upload(f instanceof File?f:null,'pending');
  await sb('/rest/v1/rpc/submit_entry',{method:'POST',body:JSON.stringify({p_data:{...record,image_url:asset?.url||null}})});
  return NextResponse.json({ok:true});
}catch(e){if(asset)await deleteUpload(asset.path);return fail(e);}}
