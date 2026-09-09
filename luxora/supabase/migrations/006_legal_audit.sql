create table public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_id uuid references public.businesses(id) on delete cascade,
  document_type text not null,
  version text not null,
  accepted_at timestamptz not null default now(),
  ip_address text
);

create index legal_acceptances_profile_idx on public.legal_acceptances(profile_id);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_business_idx on public.audit_logs(business_id);

-- Deliberately no policies: audit_logs is service_role-only (RLS denies by
-- default with no matching policy), never readable/writable by business
-- users or anon.
alter table public.legal_acceptances enable row level security;
alter table public.audit_logs enable row level security;

create policy "legal_acceptances_select_own" on public.legal_acceptances
for select using (profile_id = auth.uid());

create policy "legal_acceptances_insert_own" on public.legal_acceptances
for insert with check (profile_id = auth.uid());
