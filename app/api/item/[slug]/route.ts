import { NextResponse } from 'next/server';
import { ApiError, config, entries, fail, sb } from '@/lib/designmash/server';
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){try{
  const {slug}=await params;const pool=await entries();const item=pool.find(e=>e.slug===slug);
  if(!item)throw new ApiError('Item not found.',404);
  const categoryPool=pool.filter(e=>e.category_id===item.category_id).sort((a,b)=>b.elo_rating-a.elo_rating||a.name.localeCompare(b.name));
  const recent=config().ready?await sb<any[]>(`/rest/v1/votes?or=(winner_id.eq.${encodeURIComponent(item.id)},loser_id.eq.${encodeURIComponent(item.id)})&select=id,winner_id,loser_id,created_at&order=created_at.desc&limit=30`):[];
  const history=config().ready?await sb<any[]>('/rest/v1/rpc/item_opponents',{method:'POST',body:JSON.stringify({p_entry:item.id})}):[];
  return NextResponse.json({item,rank:categoryPool.findIndex(e=>e.id===item.id)+1,history,recent:recent.map(v=>({...v,winner:pool.find(e=>e.id===v.winner_id),loser:pool.find(e=>e.id===v.loser_id)}))},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
