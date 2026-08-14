-- Enable Realtime change broadcasts for the public view's live updates.
alter publication supabase_realtime add table public.points;
alter publication supabase_realtime add table public.needs;
