create table public.staff (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  photo_url text,
  email text,
  phone text,
  title text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger staff_set_updated_at
before update on public.staff
for each row execute function public.set_updated_at();

create index staff_business_idx on public.staff(business_id);

create table public.staff_services (
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  primary key (staff_id, service_id)
);

create table public.staff_locations (
  staff_id uuid not null references public.staff(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  primary key (staff_id, location_id)
);

alter table public.staff enable row level security;
alter table public.staff_services enable row level security;
alter table public.staff_locations enable row level security;

create policy "staff_select_member" on public.staff
for select using (public.is_business_member(business_id));

create policy "staff_write_admin" on public.staff
for all using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "staff_services_select_member" on public.staff_services
for select using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_member(s.business_id))
);

create policy "staff_services_write_admin" on public.staff_services
for all using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
)
with check (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
);

create policy "staff_locations_select_member" on public.staff_locations
for select using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_member(s.business_id))
);

create policy "staff_locations_write_admin" on public.staff_locations
for all using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
)
with check (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
);
