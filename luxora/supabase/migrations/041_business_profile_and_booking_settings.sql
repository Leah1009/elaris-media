-- Business profile / website customization fields. No RLS changes needed:
-- businesses already has an anon-readable SELECT policy (019) with no
-- column restriction and an admin-only UPDATE policy (007) — both apply to
-- these new columns automatically.
alter table public.businesses add column logo_url text;
alter table public.businesses add column cover_image_url text;
alter table public.businesses add column brand_color text;
alter table public.businesses add column website_tagline text;

-- Online booking configuration. Enforced both in the anon availability
-- search (apps/luxora/src/app/api/public/[slug]/availability/route.ts) and,
-- as the real source of truth, inside create_online_booking itself (see
-- migration 042) — the search API is a convenience, not the security
-- boundary.
alter table public.businesses add column online_booking_enabled boolean not null default true;
alter table public.businesses add column booking_window_days integer not null default 60 check (booking_window_days > 0);
alter table public.businesses add column min_notice_hours integer not null default 2 check (min_notice_hours >= 0);
alter table public.businesses add column buffer_minutes integer not null default 0 check (buffer_minutes >= 0);
