'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Category, categoryLabel } from '@/lib/designmash/data';
import { VotingFlow, VotingState } from '@/lib/designmash/voting-flow';
import { Shell, CategoryLinks } from './shell';
import { EntryImage } from './image';
export function Voting({category='logos'}:{category?:Category|'random'}){
  const [state,setState]=useState<VotingState>({match:null,busy:true,chosen:''});
  const flow=useRef<VotingFlow|null>(null);
  useEffect(()=>{const current=new VotingFlow(category,setState);flow.current=current;current.start();return()=>{current.dispose();flow.current=null;};},[category]);
  const {match,busy,chosen}=state;
  const activeCategory=match?.category||(category==='random'?'logos':category);
  return <Shell className="voting-frame"><p className="tagline">Were we born with good taste? No. Will we be judged on it? Yes.</p><h1>{activeCategory==='ceo'?'Who wins?':'Which is better?'}</h1>
    <section className="battle-space" aria-busy={busy} aria-label={`${categoryLabel(activeCategory)} matchup`}>
      {match?<div className="matchup">{match.pair.map((entry,index)=><div key={`${entry.id}-${index}`} className="competitor">{index===1&&<span className="mobile-or"/>}<button className={`choice ${chosen===entry.id?'chosen':''}`} onClick={()=>void flow.current?.vote(entry.id)} disabled={busy} aria-label={`Vote for ${entry.name}`}><EntryImage entry={entry}/></button><Link className="item-name" href={`/item/${entry.slug}`}>{entry.name}</Link><p className="creator">{['landing-page','checkout-page','chat-page'].includes(entry.category_id)?new URL(entry.website_url).hostname:entry.company}</p></div>).reduce<React.ReactNode[]>((acc,node,i)=>i===0?[node]:[...acc,<span key="or" className="or">OR</span>,node],[])}</div>:<p className="status" role="status">Loading a fresh pair…</p>}
      <button className="skip" disabled={busy} onClick={()=>flow.current?.skip()}>skip</button>
      <p className="status" role="status" aria-live="polite">{match&&category==='random'?`This round: ${categoryLabel(match.category)}`:''}</p>
    </section><CategoryLinks active={category}/>
  </Shell>;
}
