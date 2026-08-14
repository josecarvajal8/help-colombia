-- Sample donation points, matching the validated HTML prototype's placeholder
-- data. Safe to re-run (idempotent on id). Run after 20260814000000_init.sql.

insert into public.points (id, name, address, city, status, maps_url, updated_at)
values
  ('11111111-1111-4111-8111-111111111111', 'Iglesia El Buen Pastor', '210 Bloomfield Ave, Newark, NJ', 'NJ', 'abierto', 'https://maps.google.com/?q=210+Bloomfield+Ave+Newark+NJ', now() - interval '12 minutes'),
  ('22222222-2222-4222-8222-222222222222', 'Centro Comunitario Colombo-Americano', '85-15 37th Ave, Jackson Heights, NY', 'NYC', 'saturado', 'https://maps.google.com/?q=85-15+37th+Ave+Jackson+Heights+NY', now() - interval '40 minutes'),
  ('33333333-3333-4333-8333-333333333333', 'Restaurante La Fonda Paisa', '512 Bergenline Ave, Union City, NJ', 'NJ', 'abierto', 'https://maps.google.com/?q=512+Bergenline+Ave+Union+City+NJ', now() - interval '3 minutes'),
  ('44444444-4444-4444-8444-444444444444', 'Salón Comunitario Barrio Colombia', '90-05 Roosevelt Ave, Queens, NY', 'NYC', 'cerrado', 'https://maps.google.com/?q=90-05+Roosevelt+Ave+Queens+NY', now() - interval '2 hours'),
  ('55555555-5555-4555-8555-555555555555', 'Iglesia Adventista Hispana', '77 Franklin St, Bloomfield, NJ', 'NJ', 'abierto', 'https://maps.google.com/?q=77+Franklin+St+Bloomfield+NJ', now() - interval '25 minutes')
on conflict (id) do nothing;

-- Note: inserting needs re-touches each point's updated_at via the trigger,
-- so points with needs below will show as just-updated rather than the
-- staggered times set above — expected, and irrelevant once real data flows in.
insert into public.needs (id, point_id, item, priority)
values
  ('a1111111-1111-4111-8111-111111111101', '11111111-1111-4111-8111-111111111111', 'Agua embotellada', 'alta'),
  ('a1111111-1111-4111-8111-111111111102', '11111111-1111-4111-8111-111111111111', 'Pañales talla 3-4', 'alta'),
  ('a1111111-1111-4111-8111-111111111103', '11111111-1111-4111-8111-111111111111', 'Linternas y pilas', 'media'),

  ('a2222222-2222-4222-8222-222222222201', '22222222-2222-4222-8222-222222222222', 'Ropa de invierno', 'baja'),

  ('a3333333-3333-4333-8333-333333333301', '33333333-3333-4333-8333-333333333333', 'Kits de primeros auxilios', 'alta'),
  ('a3333333-3333-4333-8333-333333333302', '33333333-3333-4333-8333-333333333333', 'Leche en polvo', 'alta'),
  ('a3333333-3333-4333-8333-333333333303', '33333333-3333-4333-8333-333333333333', 'Toallas sanitarias', 'media'),

  ('a5555555-5555-4555-8555-555555555501', '55555555-5555-4555-8555-555555555555', 'Carpas y sleeping bags', 'media'),
  ('a5555555-5555-4555-8555-555555555502', '55555555-5555-4555-8555-555555555555', 'Guantes de trabajo', 'baja')
on conflict (id) do nothing;
