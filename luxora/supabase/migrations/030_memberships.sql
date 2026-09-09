create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  price_cents integer not null check (price_cents >= 0),
  billing_interval text not null default 'monthly' check (billing_interval in ('monthly','yearly')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger membership_plans_set_updated_at
before update on public.membership_plans
for each row execute function public.set_updated_at();

create table public.membership_plan_services (
  membership_plan_id uuid not null references public.membership_plans(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  quantity_per_period integer not null default 1 check (quantity_per_period > 0),
  primary key (membership_plan_id, service_id)
);

create table public.client_memberships (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  membership_plan_id uuid not null references public.membership_plans(id),
  status text not null default 'active' check (status in ('active','paused','cancelled')),
  started_at timestamptz not null default now(),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger client_memberships_set_updated_at
before update on public.client_memberships
for each row execute function public.set_updated_at();

create index client_memberships_client_idx on public.client_memberships(client_id);

create table public.membership_usages (
  id uuid primary key default gen_random_uuid(),
  client_membership_id uuid not null references public.client_memberships(id) on delete cascade,
  service_id uuid not null references public.services(id),
  appointment_id uuid references public.appointments(id) on delete set null,
  used_at timestamptz not null default now()
);

alter table public.membership_plans enable row level security;
alter table public.membership_plan_services enable row level security;
alter table public.client_memberships enable row level security;
alter table public.membership_usages enable row level security;

create policy "membership_plans_select_member" on public.membership_plans
for select using (public.is_business_member(business_id));
create policy "membership_plans_write_admin" on public.membership_plans
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

create policy "membership_plan_services_select_member" on public.membership_plan_services
for select using (
  exists (select 1 from public.membership_plans mp where mp.id = membership_plan_id and public.is_business_member(mp.business_id))
);
create policy "membership_plan_services_write_admin" on public.membership_plan_services
for all using (
  exists (select 1 from public.membership_plans mp where mp.id = membership_plan_id and public.is_business_admin(mp.business_id))
) with check (
  exists (select 1 from public.membership_plans mp where mp.id = membership_plan_id and public.is_business_admin(mp.business_id))
);

create policy "client_memberships_select_member" on public.client_memberships
for select using (public.is_business_member(business_id));
create policy "client_memberships_write_member" on public.client_memberships
for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create policy "membership_usages_select_member" on public.membership_usages
for select using (
  exists (select 1 from public.client_memberships cm where cm.id = client_membership_id and public.is_business_member(cm.business_id))
);
create policy "membership_usages_insert_member" on public.membership_usages
for insert with check (
  exists (select 1 from public.client_memberships cm where cm.id = client_membership_id and public.is_business_member(cm.business_id))
);

alter policy "membership_plans_select_member" on public.membership_plans to authenticated;
alter policy "membership_plans_write_admin" on public.membership_plans to authenticated;
alter policy "membership_plan_services_select_member" on public.membership_plan_services to authenticated;
alter policy "membership_plan_services_write_admin" on public.membership_plan_services to authenticated;
alter policy "client_memberships_select_member" on public.client_memberships to authenticated;
alter policy "client_memberships_write_member" on public.client_memberships to authenticated;
alter policy "membership_usages_select_member" on public.membership_usages to authenticated;
alter policy "membership_usages_insert_member" on public.membership_usages to authenticated;
