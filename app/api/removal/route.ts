import { NextResponse } from 'next/server';
import { ApiError, fail, jsonInput, sb, session, textField, urlField } from '@/lib/designmash/server';
export async function POST(request:Request){try{
  const b=await jsonInput(request);const email=textField(b.email,254,true);
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new ApiError('Please enter a valid email.');
  await sb('/rest/v1/rpc/request_removal',{method:'POST',body:JSON.stringify({p_data:{item_url:urlField(b.item_url,true),reason:textField(b.reason,1000,true),email,additional_information:textField(b.additional_information,4000),session_id:await session(request)}})});
  return NextResponse.json({ok:true});
}catch(e){return fail(e);}}
