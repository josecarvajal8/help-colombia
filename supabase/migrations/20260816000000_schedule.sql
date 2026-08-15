-- Independent schedule field on points — free text for now (e.g. "Mon-Fri
-- 9am-6pm"), kept separate from address/donation_info so it can be reused
-- or restructured later without touching unrelated fields.
alter table public.points add column schedule text;
