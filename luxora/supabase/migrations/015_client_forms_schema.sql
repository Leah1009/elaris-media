-- Schema only in this phase; the form builder / fill-out UI ships in a
-- later slice (client import + custom forms), but the shape is settled now
-- so appointments/clients built in this phase don't need to change later.
create table public.client_forms (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text,
  service_id uuid references public.services(id) on delete set null,
  trigger text not null default 'manual' check (trigger in ('manual','first_visit_only','every_appointment')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger client_forms_set_updated_at
before update on public.client_forms
for each row execute function public.set_updated_at();

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.client_forms(id) on delete cascade,
  label text not null,
  field_type text not null check (field_type in ('text','textarea','checkbox','multiple_choice','date','signature','consent')),
  options jsonb,
  required boolean not null default false,
  sort_order integer not null default 0
);

create index form_fields_form_idx on public.form_fields(form_id);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  form_id uuid not null references public.client_forms(id),
  client_id uuid not null references public.clients(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  answers jsonb not null default '{}'::jsonb,
  signed_at timestamptz,
  submitted_at timestamptz not null default now()
);

create index form_submissions_client_idx on public.form_submissions(client_id);

alter table public.client_forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;

create policy "client_forms_select_member" on public.client_forms
for select using (public.is_business_member(business_id));

create policy "client_forms_write_admin" on public.client_forms
for all using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "form_fields_select_member" on public.form_fields
for select using (
  exists (select 1 from public.client_forms f where f.id = form_id and public.is_business_member(f.business_id))
);

create policy "form_fields_write_admin" on public.form_fields
for all using (
  exists (select 1 from public.client_forms f where f.id = form_id and public.is_business_admin(f.business_id))
)
with check (
  exists (select 1 from public.client_forms f where f.id = form_id and public.is_business_admin(f.business_id))
);

create policy "form_submissions_select_member" on public.form_submissions
for select using (public.is_business_member(business_id));

create policy "form_submissions_write_member" on public.form_submissions
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));
