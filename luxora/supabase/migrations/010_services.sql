create table public.services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  category text,
  description text,
  duration_minutes integer not null check (duration_minutes > 0),
  price_cents integer not null check (price_cents >= 0),
  deposit_required boolean not null default false,
  deposit_cents integer,
  active boolean not null default true,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger services_set_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create index services_business_idx on public.services(business_id);

create table public.service_locations (
  service_id uuid not null references public.services(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  primary key (service_id, location_id)
);

alter table public.services enable row level security;
alter table public.service_locations enable row level security;

create policy "services_select_member" on public.services
for select using (public.is_business_member(business_id));

create policy "services_write_admin" on public.services
for all using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "service_locations_select_member" on public.service_locations
for select using (
  exists (select 1 from public.services s where s.id = service_id and public.is_business_member(s.business_id))
);

create policy "service_locations_write_admin" on public.service_locations
for all using (
  exists (select 1 from public.services s where s.id = service_id and public.is_business_admin(s.business_id))
)
with check (
  exists (select 1 from public.services s where s.id = service_id and public.is_business_admin(s.business_id))
);
