import { NextResponse } from 'next/server';
import { categories, isCategory } from '@/lib/designmash/data';
import { choosePair, pairKey } from '@/lib/designmash/matchmaking';
import { ApiError, config, entries, fail, sb, session } from '@/lib/designmash/server';
export async function GET(request:Request) {
  try {
    const search=new URL(request.url).searchParams;
    const requested=search.get('category')||'logos';
    if(requested!=='random'&&!isCategory(requested))throw new ApiError('Unknown category.');
    const category=requested==='random'?categories[Math.floor(Math.random()*categories.length)].slug:requested;
    const id=await session(request); const ready=config().ready;
    const pool=await entries(category);
    let recent:string[]=[],excluded:string[]=[];
    if(ready){
      const matches=await sb<any[]>(`/rest/v1/matchups?session_id=eq.${id}&category_id=eq.${category}&select=left_id,right_id&order=created_at.desc&limit=45`);
      recent=matches.map(m=>pairKey(m.left_id,m.right_id));
      const previousId=search.get('previous');
      const previous=previousId&&/^[0-9a-f-]{36}$/.test(previousId)
        ?(await sb<any[]>(`/rest/v1/matchups?id=eq.${previousId}&session_id=eq.${id}&select=left_id,right_id`))[0]
        :matches[0];
      if(previous)excluded=[previous.left_id,previous.right_id];
    }
    const pair=choosePair(pool,recent,Math.random,excluded);
    if(!pair)throw new ApiError('There are not enough fresh entries in this category yet.',404);
    let challenge:string|null=null;
    if(ready){challenge=crypto.randomUUID(); await sb('/rest/v1/rpc/issue_matchup',{method:'POST',body:JSON.stringify({p_id:challenge,p_session:id,p_category:category,p_left:pair[0].id,p_right:pair[1].id})});}
    return NextResponse.json({pair,category,challenge,configured:ready},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return fail(e);}
}
