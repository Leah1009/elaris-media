create table public.clients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  birthday date,
  address_line1 text,
  city text,
  state text,
  zip text,
  notes text,
  preferred_staff_id uuid references public.staff(id) on delete set null,
  first_visit_at timestamptz,
  last_visit_at timestamptz,
  total_visits integer not null default 0,
  lifetime_spend_cents integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger clients_set_updated_at
before update on public.clients
for each row execute function public.set_updated_at();

create index clients_business_idx on public.clients(business_id);
create index clients_phone_idx on public.clients(business_id, phone);
create index clients_email_idx on public.clients(business_id, email);

create table public.client_tags (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (business_id, name)
);

create table public.client_tag_assignments (
  client_id uuid not null references public.clients(id) on delete cascade,
  tag_id uuid not null references public.client_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (client_id, tag_id)
);

alter table public.clients enable row level security;
alter table public.client_tags enable row level security;
alter table public.client_tag_assignments enable row level security;

create policy "clients_select_member" on public.clients
for select using (public.is_business_member(business_id));

-- Any active member (not just owner/manager) can create/edit clients —
-- staff need this day to day; only the tag *definitions* below are
-- admin-only.
create policy "clients_write_member" on public.clients
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "client_tags_select_member" on public.client_tags
for select using (public.is_business_member(business_id));

create policy "client_tags_write_admin" on public.client_tags
for all using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "client_tag_assignments_select_member" on public.client_tag_assignments
for select using (
  exists (select 1 from public.clients c where c.id = client_id and public.is_business_member(c.business_id))
);

create policy "client_tag_assignments_write_member" on public.client_tag_assignments
for all using (
  exists (select 1 from public.clients c where c.id = client_id and public.is_business_member(c.business_id))
)
with check (
  exists (select 1 from public.clients c where c.id = client_id and public.is_business_member(c.business_id))
);
