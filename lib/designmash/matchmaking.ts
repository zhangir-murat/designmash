import type { Entry } from './data';
export function pairKey(a: string, b: string) { return [a, b].sort().join('|'); }
export function choosePair(entries: Entry[], recent: string[], random = Math.random, excluded: string[] = []): [Entry, Entry] | null {
  // Checkout comparisons require real captures. Keep pending records and their
  // ratings, but never ask visitors to vote on missing or on-demand screenshots.
  entries = entries.filter(e => e.category_id !== 'checkout-page' || Boolean(e.image_url && !e.image_url.startsWith('https://s0.wp.com/mshots/')));
  if (entries.length < 2) return null;
  const options: { pair: [Entry, Entry]; weight: number }[] = [];
  const top = new Set([...entries].sort((a,b) => b.elo_rating-a.elo_rating).slice(0,4).map(e=>e.id));
  for (let i=0;i<entries.length;i++) for (let j=i+1;j<entries.length;j++) {
    const a=entries[i], b=entries[j];
    if(a.id === b.id || a.category_id !== b.category_id || excluded.includes(a.id) || excluded.includes(b.id)) continue;
    const weight=1/Math.sqrt(1+a.total_votes+b.total_votes)+(top.has(a.id)&&top.has(b.id)?0.1:0);
    options.push({pair:[a,b], weight});
  }
  const unseen=options.filter(p=>!recent.includes(pairKey(p.pair[0].id,p.pair[1].id)));
  const pool=unseen.length ? unseen : options;
  if(!pool.length) return null;
  let threshold=random()*pool.reduce((s,p)=>s+p.weight,0);
  let result=pool[pool.length-1].pair;
  for(const p of pool) { threshold-=p.weight; if(threshold<=0){result=p.pair;break;} }
  return random()<0.5?result:[result[1], result[0]];
}
