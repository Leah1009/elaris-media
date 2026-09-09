create table public.package_plans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  service_id uuid references public.services(id) on delete set null,
  price_cents integer not null check (price_cents >= 0),
  total_sessions integer not null check (total_sessions > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger package_plans_set_updated_at
before update on public.package_plans
for each row execute function public.set_updated_at();

create table public.client_packages (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  package_plan_id uuid not null references public.package_plans(id),
  sessions_remaining integer not null,
  payment_id uuid references public.payments(id) on delete set null,
  purchased_at timestamptz not null default now(),
  expires_at timestamptz,
  status text not null default 'active' check (status in ('active','expired','cancelled'))
);

create index client_packages_client_idx on public.client_packages(client_id);

create table public.package_usages (
  id uuid primary key default gen_random_uuid(),
  client_package_id uuid not null references public.client_packages(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  used_at timestamptz not null default now()
);

alter table public.package_plans enable row level security;
alter table public.client_packages enable row level security;
alter table public.package_usages enable row level security;

create policy "package_plans_select_member" on public.package_plans
for select using (public.is_business_member(business_id));
create policy "package_plans_write_admin" on public.package_plans
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

create policy "client_packages_select_member" on public.client_packages
for select using (public.is_business_member(business_id));
create policy "client_packages_write_member" on public.client_packages
for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create policy "package_usages_select_member" on public.package_usages
for select using (
  exists (select 1 from public.client_packages cp where cp.id = client_package_id and public.is_business_member(cp.business_id))
);
create policy "package_usages_insert_member" on public.package_usages
for insert with check (
  exists (select 1 from public.client_packages cp where cp.id = client_package_id and public.is_business_member(cp.business_id))
);

alter policy "package_plans_select_member" on public.package_plans to authenticated;
alter policy "package_plans_write_admin" on public.package_plans to authenticated;
alter policy "client_packages_select_member" on public.client_packages to authenticated;
alter policy "client_packages_write_member" on public.client_packages to authenticated;
alter policy "package_usages_select_member" on public.package_usages to authenticated;
alter policy "package_usages_insert_member" on public.package_usages to authenticated;
