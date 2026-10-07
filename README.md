# DESIGNMASH

A head-to-head design voting app using a Vinext Cloudflare Worker, Sites D1 storage, R2 image uploads, and owner-only ChatGPT administration. A Supabase implementation is retained for an optional later switch. Six pools (76 logos, 100 names, and 10 entries in each of the other pools) plus same-category random mode. Each new round excludes both competitors from the preceding round; no winner stays on. The intentionally primitive visual shell follows the supplied screenshot.

## Active backend

`DB` and `BUCKET` are provisioned by Sites. Drizzle migrations create the schema; server initialization seeds new databases and applies the versioned logo/name expansion to existing databases once. `DESIGNMASH_ADMIN_EMAIL` restricts moderation to the owner identified by platform-authenticated headers. Voting does not require an app account.

Votes use a conditional insert and atomic D1 batch with optimistic rating checks; both ratings, history, session timestamp, and challenge state commit together. No browser rating is trusted. Submissions and removal requests persist in D1. Images are stored in R2; pending images require administrator access.

## Optional Supabase backend setup

1. Apply `supabase/schema.sql` and `supabase/seed.sql` to a Supabase project.
2. Create a **public** Storage bucket named `designmash`, restrict uploads to PNG/JPEG/WebP and 5 MB. Do not grant anonymous uploads; the Worker uses its service-role credential.
3. Set Sites secrets `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. All database keys stay on the server.
4. Create an administrator in Supabase Auth, then add that Auth user ID to `public.admins`. Only IDs in that table can use admin APIs. No public registration or administrator bootstrap endpoint exists.
5. Logo seed images are local Simple Icons assets. The remaining non-name categories have explicit sample placeholders until screenshots or licensed headshots are uploaded through Admin.

The optional Supabase backend uses atomic PostgreSQL transactions. Each server-issued challenge binds a pair and category to an HTTP-only session cookie, has no time limit, and can be used once. Session rate limits, an exact-pair cooldown, consistent entry lock ordering, RLS, and server-only functions protect writes. A new cookie can evade session limits; this is intentionally lightweight abuse protection rather than bot-proof identity verification.

Rankings use current Elo for ordering. Today/rolling week/rolling month filters apply to win/loss statistics; Today uses UTC. Elo reset retains history. Deleting an entry with battles removes it from public pages and the admin list while preserving historical references; unused entries are deleted permanently.

`npm run build` builds the Worker. `node --test tests/designmash.test.mjs tests/store.test.mjs` exercises matchmaking, category separation, seed integrity, server voting, ranking filters, histories, submissions, approval, removals, and persisted entry updates. Supabase integration tests require the connected project and runtime configuration.

Voting loads a server-issued pair immediately. Invalid or already-used challenges recover silently, and failed matchup requests retry automatically with bounded backoff. Both choices lock synchronously for a vote and unlock only once a fresh pair has loaded. Category changes cancel obsolete requests and retries. There is no age-based matchup expiry or vote confirmation screen.

## Uploaded logo and name pools

The October 6 pool import adds 76 local SVG logos and 100 text-only names from the supplied files. The other four pools retain their original entries and image behavior. Logo filenames use stable slugs, including `epic-games.svg` and `booking-com.svg`.

Apply the new Drizzle migration `0001_seed_updates.sql` before running the updated Worker. It creates a small seed-version table; the next request adds the 156 new entries to an existing database without changing ratings, history, edited entries, or moderation state. Completed seed updates are recorded atomically so later requests do not recreate deleted entries. The optional Supabase seed file has matching pools and uses `ON CONFLICT DO NOTHING`.

Run `npm test` for the build, voting-flow checks, seed upgrade checks, and Worker integration checks. This repository update does not publish the separate ChatGPT Site automatically.
