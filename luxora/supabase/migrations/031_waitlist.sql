create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  full_name text,
  phone text,
  email text,
  service_id uuid references public.services(id) on delete set null,
  preferred_staff_id uuid references public.staff(id) on delete set null,
  preferred_date_start date,
  preferred_date_end date,
  status text not null default 'waiting' check (status in ('waiting','notified','booked','cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger waitlist_set_updated_at
before update on public.waitlist
for each row execute function public.set_updated_at();

create index waitlist_business_idx on public.waitlist(business_id, status);

alter table public.waitlist enable row level security;

create policy "waitlist_select_member" on public.waitlist
for select using (public.is_business_member(business_id));

create policy "waitlist_write_member" on public.waitlist
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

alter policy "waitlist_select_member" on public.waitlist to authenticated;
alter policy "waitlist_write_member" on public.waitlist to authenticated;
