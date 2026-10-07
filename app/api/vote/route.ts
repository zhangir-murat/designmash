import { NextResponse } from 'next/server';
import { fail, jsonInput, sb, session, textField } from '@/lib/designmash/server';
export async function POST(request:Request){try{
  const b=await jsonInput(request); const id=await session(request);
  const result=await sb('/rest/v1/rpc/cast_vote',{method:'POST',body:JSON.stringify({p_session:id,p_matchup:textField(b.challenge,36,true),p_winner:textField(b.winner,160,true)})});
  return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
