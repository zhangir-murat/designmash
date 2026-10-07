import type { Category, Entry } from './data';

export type Matchup = { pair:[Entry,Entry]; category:Category; challenge:string; configured:boolean };
export type VotingState = { match:Matchup|null; busy:boolean; chosen:string };

// A flow owns one category. Disposing it cancels obsolete responses and retries.
export class VotingFlow {
  private alive=true;
  private locked=true;
  private previous:Matchup|null=null;
  private state:VotingState={match:null,busy:true,chosen:''};
  private request:AbortController|null=null;
  private retry:ReturnType<typeof setTimeout>|null=null;
  constructor(private category:Category|'random', private changed:(state:VotingState)=>void, private transport:typeof fetch=fetch){}
  private emit(state:VotingState){this.state=state;if(this.alive)this.changed(state);}
  start(){void this.next();}
  dispose(){this.alive=false;this.request?.abort();if(this.retry!==null)clearTimeout(this.retry);}
  private async json(url:string,options:RequestInit={}){
    const controller=new AbortController();this.request=controller;
    const timeout=setTimeout(()=>controller.abort(),10000);
    // Window.fetch requires a Window receiver. Calling a stored native fetch as
    // this.transport(...) binds it to VotingFlow and Chrome throws before I/O.
    try {const response=await this.transport.call(globalThis,url,{...options,signal:controller.signal,cache:'no-store',credentials:'same-origin'});return {response,data:await response.json()};}
    finally {clearTimeout(timeout);if(this.request===controller)this.request=null;}
  }
  private async next(attempt=0):Promise<void>{
    if(!this.alive)return;
    this.locked=true;
    // Never leave a rejected/completed round visible during retries.
    this.emit({match:null,busy:true,chosen:''});
    try {
      const previous=this.previous;
      const query=new URLSearchParams({category:this.category});
      if(previous)query.set('previous',previous.challenge);
      const {response,data}=await this.json('/api/matchup?'+query);
      if(!this.alive)return;
      if(!response.ok||!data.configured||!data.challenge||!Array.isArray(data.pair)||data.pair.length!==2||data.pair[0].id===data.pair[1].id||data.pair.some((e:Entry)=>previous?.pair.some(old=>old.id===e.id)))throw new Error('Retry matchup');
      this.previous=data;this.locked=false;
      this.emit({match:data,busy:false,chosen:''});
    } catch {
      if(!this.alive)return;
      this.retry=setTimeout(()=>{this.retry=null;void this.next(attempt+1);},Math.min(5000,400*2**Math.min(attempt,4)));
    }
  }
  skip(){if(!this.alive||this.locked)return;this.locked=true;void this.next();}
  async vote(winner:string){
    const match=this.state.match;
    if(!this.alive||this.locked||!match||!match.pair.some(e=>e.id===winner))return;
    this.locked=true;this.emit({match,busy:true,chosen:winner});
    try {
      // A lost response may already have committed: submit each click once.
      await this.json('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({challenge:match.challenge,winner})});
    } catch { /* Network failures and stale challenges recover silently. */ }
    if(this.alive)await this.next();
  }
}
