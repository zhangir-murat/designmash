begin;
create table if not exists public.categories (
 id text primary key, slug text unique not null, name text not null, created_at timestamptz not null default now()
);
create table if not exists public.entries (
 id text primary key, category_id text not null references public.categories(id), name text not null,
 company text not null default '', slug text unique not null, image_url text, source_url text not null default '', website_url text not null default '',
 elo_rating double precision not null default 1500, wins integer not null default 0, losses integer not null default 0,
 total_votes integer not null default 0, active boolean not null default true, submission_status text not null default 'approved', created_at timestamptz not null default now(),
 check(wins>=0 and losses>=0 and total_votes=wins+losses), check(submission_status in ('approved','pending','rejected'))
);
create table if not exists public.sessions (
 id uuid primary key, last_vote_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.matchups (
 id uuid primary key, session_id uuid not null references public.sessions(id), category_id text not null references public.categories(id),
 left_id text not null references public.entries(id), right_id text not null references public.entries(id),
 used boolean not null default false, created_at timestamptz not null default now(), check(left_id<>right_id)
);
create table if not exists public.votes (
 id uuid primary key default gen_random_uuid(), category_id text not null references public.categories(id),
 winner_id text not null references public.entries(id), loser_id text not null references public.entries(id),
 session_id uuid not null references public.sessions(id), matchup_id uuid unique not null references public.matchups(id),
 winner_before double precision not null, loser_before double precision not null, winner_after double precision not null, loser_after double precision not null,
 created_at timestamptz not null default now(), check(winner_id<>loser_id)
);
create table if not exists public.submissions (
 id uuid primary key default gen_random_uuid(), category text not null references public.categories(id), name text not null,
 company text not null default '', website_url text not null default '', source_url text not null default '', image_url text,
 email text not null default '', status text not null default 'pending', session_id uuid not null,
 created_at timestamptz not null default now(), check(status in ('pending','approved','rejected'))
);
create table if not exists public.removal_requests (
 id uuid primary key default gen_random_uuid(), entry_id text references public.entries(id) on delete set null,
 item_url text not null, reason text not null, email text not null, additional_information text not null default '',
 status text not null default 'pending', session_id uuid not null, created_at timestamptz not null default now(), check(status in ('pending','reviewed'))
);
create table if not exists public.admins (
 user_id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);
create index if not exists votes_session_recent on public.votes(session_id,created_at desc);
create index if not exists votes_category_recent on public.votes(category_id,created_at desc);
create index if not exists votes_winner on public.votes(winner_id);
create index if not exists votes_loser on public.votes(loser_id);
create index if not exists matchups_session_recent on public.matchups(session_id,category_id,created_at desc);
create index if not exists submissions_session_recent on public.submissions(session_id,created_at desc);
create index if not exists removal_session_recent on public.removal_requests(session_id,created_at desc);
alter table public.categories enable row level security;
alter table public.entries enable row level security;
alter table public.sessions enable row level security;
alter table public.matchups enable row level security;
alter table public.votes enable row level security;
alter table public.submissions enable row level security;
alter table public.removal_requests enable row level security;
alter table public.admins enable row level security;
-- All data operations go through the same-origin Worker, using the server-only service role.
revoke all on public.categories, public.entries, public.sessions, public.matchups, public.votes, public.submissions, public.removal_requests, public.admins from anon, authenticated;
grant all on public.categories, public.entries, public.sessions, public.matchups, public.votes, public.submissions, public.removal_requests, public.admins to service_role;

create or replace function public.issue_matchup(p_id uuid,p_session uuid,p_category text,p_left text,p_right text) returns void
language plpgsql security invoker set search_path=public as $$
begin
 insert into sessions(id) values(p_session) on conflict do nothing;
 perform 1 from sessions where id=p_session for update;
 if (select count(*) from matchups where session_id=p_session and created_at>now()-interval '1 minute')>=60 then raise exception 'RATE_LIMIT'; end if;
 if p_left=p_right or (select count(*) from entries where id in(p_left,p_right) and category_id=p_category and active and submission_status='approved')<>2 then raise exception 'INVALID_MATCHUP';end if;
 insert into matchups(id,session_id,category_id,left_id,right_id) values(p_id,p_session,p_category,p_left,p_right);
end; $$;

create or replace function public.cast_vote(p_session uuid,p_matchup uuid,p_winner text) returns jsonb
language plpgsql security invoker set search_path=public as $$
declare m matchups%rowtype; w entries%rowtype; l entries%rowtype; loser text; delta double precision; last_at timestamptz;
begin
 -- Lock the session first so concurrent requests cannot evade limits.
 select last_vote_at into last_at from sessions where id=p_session for update;
 if not found then raise exception 'INVALID_MATCHUP';end if;
 if (select count(*) from votes where session_id=p_session and created_at>now()-interval '1 minute')>=60 then raise exception 'RATE_LIMIT';end if;
 select * into m from matchups where id=p_matchup and session_id=p_session for update;
 if not found then raise exception 'INVALID_MATCHUP';end if;
 if m.used then raise exception 'DUPLICATE_VOTE';end if;
 if p_winner not in(m.left_id,m.right_id) then raise exception 'INVALID_MATCHUP';end if;
 loser:=case when p_winner=m.left_id then m.right_id else m.left_id end;
 if exists(select 1 from votes where session_id=p_session and created_at>now()-interval '5 minutes' and ((winner_id=p_winner and loser_id=loser) or(winner_id=loser and loser_id=p_winner))) then raise exception 'DUPLICATE_VOTE';end if;
 -- Deterministic row lock order avoids deadlocks between different sessions.
 perform id from entries where id in(p_winner,loser) order by id for update;
 select * into w from entries where id=p_winner;
 select * into l from entries where id=loser;
 if not w.active or not l.active or w.category_id<>m.category_id or l.category_id<>m.category_id or w.submission_status<>'approved' or l.submission_status<>'approved' then raise exception 'INVALID_MATCHUP';end if;
 delta:=32*(1-1/(1+power(10.0,(l.elo_rating-w.elo_rating)/400.0)));
 update entries set elo_rating=elo_rating+delta,wins=wins+1,total_votes=total_votes+1 where id=w.id;
 update entries set elo_rating=elo_rating-delta,losses=losses+1,total_votes=total_votes+1 where id=l.id;
 insert into votes(category_id,winner_id,loser_id,session_id,matchup_id,winner_before,loser_before,winner_after,loser_after)
 values(m.category_id,w.id,l.id,p_session,p_matchup,w.elo_rating,l.elo_rating,w.elo_rating+delta,l.elo_rating-delta);
 update matchups set used=true where id=m.id;
 update sessions set last_vote_at=now() where id=p_session;
 return jsonb_build_object('winner_rating',w.elo_rating+delta,'loser_rating',l.elo_rating-delta,'ok',true);
end; $$;

create or replace function public.get_rankings(p_category text,p_period text) returns table(
 id text,category_id text,name text,company text,slug text,image_url text,source_url text,website_url text,
 elo_rating double precision,wins bigint,losses bigint,total_votes bigint,active boolean,submission_status text
) language sql stable security invoker set search_path=public as $$
 with boundary as(select case p_period when 'today' then date_trunc('day',now() at time zone 'UTC') at time zone 'UTC' when 'week' then now()-interval '7 days' when 'month' then now()-interval '30 days' else '-infinity'::timestamptz end as since),
 counts as(select e.id,count(v.id) filter(where v.winner_id=e.id) as w,count(v.id) filter(where v.loser_id=e.id) as l
 from entries e cross join boundary b left join votes v on(v.winner_id=e.id or v.loser_id=e.id) and v.created_at>=b.since
 where e.category_id=p_category group by e.id)
 select e.id,e.category_id,e.name,e.company,e.slug,e.image_url,e.source_url,e.website_url,e.elo_rating,c.w,c.l,c.w+c.l,e.active,e.submission_status
 from entries e join counts c on c.id=e.id where e.category_id=p_category and e.active and e.submission_status='approved' order by e.elo_rating desc,e.name;
$$;
create or replace function public.item_opponents(p_entry text) returns table(opponent_id text,name text,slug text,wins bigint,losses bigint)
language sql stable security invoker set search_path=public as $$
 select e.id,e.name,e.slug,count(*) filter(where v.winner_id=p_entry),count(*) filter(where v.loser_id=p_entry)
 from votes v join entries e on e.id=case when v.winner_id=p_entry then v.loser_id else v.winner_id end
 where(v.winner_id=p_entry or v.loser_id=p_entry) and e.active and e.submission_status='approved' group by e.id;
$$;
create or replace function public.submit_entry(p_data jsonb) returns uuid
language plpgsql security invoker set search_path=public as $$
declare new_id uuid; s uuid:=(p_data->>'session_id')::uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(s::text,0));
 if(select count(*) from submissions where session_id=s and created_at>now()-interval '1 hour')>=10 then raise exception 'RATE_LIMIT';end if;
 insert into submissions(category,name,company,website_url,source_url,image_url,email,session_id)
 values(p_data->>'category',p_data->>'name',coalesce(p_data->>'company',''),coalesce(p_data->>'website_url',''),coalesce(p_data->>'source_url',''),p_data->>'image_url',coalesce(p_data->>'email',''),s) returning id into new_id;
 return new_id;
end; $$;
create or replace function public.request_removal(p_data jsonb) returns uuid
language plpgsql security invoker set search_path=public as $$
declare new_id uuid; s uuid:=(p_data->>'session_id')::uuid;
begin
 perform pg_advisory_xact_lock(hashtextextended(s::text,0));
 if(select count(*) from removal_requests where session_id=s and created_at>now()-interval '1 hour')>=10 then raise exception 'RATE_LIMIT';end if;
 insert into removal_requests(item_url,reason,email,additional_information,session_id) values(p_data->>'item_url',p_data->>'reason',p_data->>'email',coalesce(p_data->>'additional_information',''),s) returning id into new_id;
 return new_id;
end; $$;
create or replace function public.approve_submission(p_id uuid) returns text
language plpgsql security invoker set search_path=public as $$
declare s submissions%rowtype; new_id text;
begin
 select * into s from submissions where id=p_id for update;
 if not found or s.status<>'pending' then raise exception 'Invalid submission';end if;
 new_id:=s.category||'-'||regexp_replace(lower(s.name),'[^a-z0-9]+','-','g')||'-'||substr(s.id::text,1,8);
 insert into entries(id,category_id,name,company,slug,image_url,source_url,website_url) values(new_id,s.category,s.name,s.company,new_id,s.image_url,s.source_url,s.website_url);
 update submissions set status='approved' where id=p_id;
 return new_id;
end; $$;
revoke execute on function public.issue_matchup(uuid,uuid,text,text,text),public.cast_vote(uuid,uuid,text),public.get_rankings(text,text),public.item_opponents(text),public.submit_entry(jsonb),public.request_removal(jsonb),public.approve_submission(uuid) from public,anon,authenticated;
grant execute on function public.issue_matchup(uuid,uuid,text,text,text),public.cast_vote(uuid,uuid,text),public.get_rankings(text,text),public.item_opponents(text),public.submit_entry(jsonb),public.request_removal(jsonb),public.approve_submission(uuid) to service_role;
commit;
