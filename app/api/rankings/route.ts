import { NextResponse } from 'next/server';
import { ApiError, config, entries, fail, sb } from '@/lib/designmash/server';
import { isCategory } from '@/lib/designmash/data';
export async function GET(request:Request){try{
  const p=new URL(request.url).searchParams;const category=p.get('category')||'logos';const period=p.get('period')||'all';
  if(!isCategory(category)||!['today','week','month','all'].includes(period))throw new ApiError('Unknown filter.');
  let rows;
  if(!config().ready){rows=await entries(category);}
  else{rows=await sb('/rest/v1/rpc/get_rankings',{method:'POST',body:JSON.stringify({p_category:category,p_period:period})});}
  return NextResponse.json({entries:rows,configured:config().ready},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
