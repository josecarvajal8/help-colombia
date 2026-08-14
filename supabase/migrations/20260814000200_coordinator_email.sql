-- Denormalized copy of the coordinator's email for display in the admin
-- panel — auth.users isn't queryable from the client, even for admins.
-- Not the source of truth for login; just set at invite time.
alter table public.coordinator_profiles add column email text;
