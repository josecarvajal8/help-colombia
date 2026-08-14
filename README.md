# Red de Acopio — NJ / NYC

Coordination tool for humanitarian donation points, built for the Colombian
community in New Jersey and New York. Public view shows what each donation
point needs right now and how urgent it is; coordinators update their own
point; an admin creates points and assigns coordinators.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Realtime)
- Hosted on Render as a Node web service

## Local setup

Requires **Node 20+** (see `.nvmrc`; run `nvm use` if you have nvm installed).

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project's URL + keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/(public)` — the public, read-only donation points view
- `app/(admin)` — coordinator and admin panels
- `components/` — shared UI (status pulse, need tags, cards, filters)
- `lib/` — types and (for now) sample data
- `supabase/migrations/` — SQL schema + Row Level Security policies

## Database

Apply `supabase/migrations/20260814000000_init.sql` to your Supabase project
(SQL Editor, or `supabase db push` if using the CLI). It creates the
`points`, `needs`, `coordinator_profiles`, and `admins` tables with RLS.

After the first admin signs in once via magic link, bootstrap admin access
from the Supabase SQL editor:

```sql
insert into public.admins (id) values ('<that user''s auth uuid>');
```

## Deploying

`render.yaml` defines a Render Web Service (Node, `npm run build` /
`npm run start`). Connect the repo in the Render dashboard, then set
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` in the service's Environment tab.
