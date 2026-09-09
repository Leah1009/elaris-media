create extension if not exists btree_gist;

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  location_id uuid not null references public.locations(id),
  client_id uuid not null references public.clients(id),
  staff_id uuid not null references public.staff(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','no_show')),
  notes text,
  deposit_status text not null default 'none' check (deposit_status in ('none','required','paid')),
  source text not null default 'manual' check (source in ('manual','online')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at)
);

create trigger appointments_set_updated_at
before update on public.appointments
for each row execute function public.set_updated_at();

create index appointments_business_idx on public.appointments(business_id);
create index appointments_staff_start_idx on public.appointments(staff_id, start_at);
create index appointments_client_idx on public.appointments(client_id);

-- Database-level double-booking prevention: no two non-cancelled
-- appointments for the same staff member may overlap in time. This holds
-- even under concurrent writes, which an app-level "check then insert" can't
-- guarantee.
alter table public.appointments
  add constraint appointments_no_staff_overlap
  exclude using gist (
    staff_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  )
  where (status <> 'cancelled');

create table public.appointment_services (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  service_id uuid not null references public.services(id),
  price_cents integer not null,
  duration_minutes integer not null,
  created_at timestamptz not null default now()
);

create index appointment_services_appointment_idx on public.appointment_services(appointment_id);

alter table public.appointments enable row level security;
alter table public.appointment_services enable row level security;

create policy "appointments_select_member" on public.appointments
for select using (public.is_business_member(business_id));

create policy "appointments_write_member" on public.appointments
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "appointment_services_select_member" on public.appointment_services
for select using (
  exists (select 1 from public.appointments a where a.id = appointment_id and public.is_business_member(a.business_id))
);

create policy "appointment_services_write_member" on public.appointment_services
for all using (
  exists (select 1 from public.appointments a where a.id = appointment_id and public.is_business_member(a.business_id))
)
with check (
  exists (select 1 from public.appointments a where a.id = appointment_id and public.is_business_member(a.business_id))
);
