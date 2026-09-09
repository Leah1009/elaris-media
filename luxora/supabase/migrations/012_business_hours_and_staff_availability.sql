create table public.business_hours (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  open_time time,
  close_time time,
  closed boolean not null default false,
  unique (location_id, day_of_week)
);

create table public.staff_weekly_availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);

create index staff_weekly_availability_staff_idx on public.staff_weekly_availability(staff_id);

alter table public.business_hours enable row level security;
alter table public.staff_weekly_availability enable row level security;

create policy "business_hours_select_member" on public.business_hours
for select using (
  exists (select 1 from public.locations l where l.id = location_id and public.is_business_member(l.business_id))
);

create policy "business_hours_write_admin" on public.business_hours
for all using (
  exists (select 1 from public.locations l where l.id = location_id and public.is_business_admin(l.business_id))
)
with check (
  exists (select 1 from public.locations l where l.id = location_id and public.is_business_admin(l.business_id))
);

create policy "staff_availability_select_member" on public.staff_weekly_availability
for select using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_member(s.business_id))
);

create policy "staff_availability_write_admin" on public.staff_weekly_availability
for all using (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
)
with check (
  exists (select 1 from public.staff s where s.id = staff_id and public.is_business_admin(s.business_id))
);
