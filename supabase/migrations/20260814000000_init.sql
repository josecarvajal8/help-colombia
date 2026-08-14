-- NJ/NYC Donation Points Network — initial schema
-- Run this once against a fresh Supabase project (SQL Editor, or `supabase db push`).

create extension if not exists "pgcrypto";

-- ---------- enums ----------

create type point_city as enum ('NJ', 'NYC');
create type point_status as enum ('abierto', 'saturado', 'cerrado');
create type need_priority as enum ('alta', 'media', 'baja');

-- ---------- tables ----------

create table public.points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city point_city not null,
  lat double precision,
  lng double precision,
  status point_status not null default 'abierto',
  maps_url text,
  donation_info text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.needs (
  id uuid primary key default gen_random_uuid(),
  point_id uuid not null references public.points(id) on delete cascade,
  item text not null,
  priority need_priority not null default 'media',
  created_at timestamptz not null default now()
);

-- One coordinator profile per auth user, linked to at most one point (v1).
-- Rows are created by the admin at invite time — see docs/coordinator-invite-flow.md.
create table public.coordinator_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  point_id uuid references public.points(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Admin allowlist. No insert/update/delete policy is defined below on purpose —
-- bootstrap the first admin manually from the Supabase SQL editor:
--   insert into public.admins (id) values ('<auth-user-uuid>');
create table public.admins (
  id uuid primary key references auth.users(id) on delete cascade
);

create index needs_point_id_idx on public.needs(point_id);
create index points_city_idx on public.points(city);
create index coordinator_profiles_point_id_idx on public.coordinator_profiles(point_id);

-- ---------- keep "last updated" honest ----------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger points_touch_updated_at
before update on public.points
for each row execute function public.touch_updated_at();

-- A need changing (added/edited/removed) counts as the point being updated too.
create or replace function public.touch_point_from_need()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.points
  set updated_at = now()
  where id = coalesce(new.point_id, old.point_id);
  return coalesce(new, old);
end;
$$;

create trigger needs_touch_point_updated_at
after insert or update or delete on public.needs
for each row execute function public.touch_point_from_need();

-- ---------- RLS helper functions ----------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where id = auth.uid());
$$;

create or replace function public.coordinator_point_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select point_id from public.coordinator_profiles where id = auth.uid();
$$;

-- ---------- RLS ----------

alter table public.points enable row level security;
alter table public.needs enable row level security;
alter table public.coordinator_profiles enable row level security;
alter table public.admins enable row level security;

-- points: anyone can read; the assigned coordinator can update their own point;
-- only admins can insert/delete/update any point (including reassigning coordinators).
create policy "points_public_read" on public.points
  for select using (true);

create policy "points_coordinator_update" on public.points
  for update using (id = public.coordinator_point_id())
  with check (id = public.coordinator_point_id());

create policy "points_admin_all" on public.points
  for all using (public.is_admin())
  with check (public.is_admin());

-- needs: anyone can read; the assigned coordinator has full CRUD on their point's needs;
-- admins have full CRUD on all needs.
create policy "needs_public_read" on public.needs
  for select using (true);

create policy "needs_coordinator_all" on public.needs
  for all using (point_id = public.coordinator_point_id())
  with check (point_id = public.coordinator_point_id());

create policy "needs_admin_all" on public.needs
  for all using (public.is_admin())
  with check (public.is_admin());

-- coordinator_profiles: a coordinator can read their own row (to know their point
-- assignment); only admins can create/edit/reassign/delete coordinator profiles.
create policy "coordinator_profiles_self_read" on public.coordinator_profiles
  for select using (id = auth.uid());

create policy "coordinator_profiles_admin_all" on public.coordinator_profiles
  for all using (public.is_admin())
  with check (public.is_admin());

-- admins: a user can check their own admin status; the allowlist itself is only
-- ever written from the SQL editor or a service-role script, never from the app.
create policy "admins_self_read" on public.admins
  for select using (id = auth.uid());
