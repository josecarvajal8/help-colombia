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
- `app/(admin)` — login, coordinator dashboard, and admin dashboard
- `app/api/admin` — server-only routes needing the Supabase secret key (coordinator invites)
- `components/` — shared UI (status pulse, need tags, cards, filters, dashboards)
- `lib/` — types, formatting, and the Supabase client/query helpers
- `supabase/migrations/` — SQL schema + Row Level Security policies, in order
- `supabase/seed.sql` — the 5 sample points, for a populated dev/demo view

## Database

Apply the migrations in `supabase/migrations/` **in filename order** (SQL
Editor, or `supabase db push` if using the CLI):

1. `20260814000000_init.sql` — `points`, `needs`, `coordinator_profiles`, `admins` tables + RLS
2. `20260814000100_realtime.sql` — enables Realtime broadcasts on `points`/`needs`
3. `20260814000200_coordinator_email.sql` — adds a display-only email column to `coordinator_profiles`

Optionally run `supabase/seed.sql` too, for sample data.

### Bootstrapping the first admin

1. Go to `/login` and sign in with your own email (magic link).
2. In the Supabase SQL editor, find your user's id in `auth.users`, then:
   ```sql
   insert into public.admins (id) values ('<your auth uuid>');
   ```
3. Reload `/admin` — you should now see the admin dashboard instead of "sin acceso".

From there, admin invites coordinators by email from the admin dashboard —
no more manual SQL needed for that part.

## Environment variables

See `.env.example`. `SUPABASE_SECRET_KEY` is required for the coordinator
invite flow (`/api/admin/invite-coordinator`) — it uses the Supabase Admin
API, which only works with the secret key, never the publishable key. Keep
it out of the browser bundle and out of version control.

## Deploying

`render.yaml` defines a Render Web Service (Node, `npm run build` /
`npm run start`). Connect the repo in the Render dashboard, then set
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and
`SUPABASE_SECRET_KEY` in the service's Environment tab.
