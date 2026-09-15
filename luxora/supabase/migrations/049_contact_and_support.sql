-- Public-facing contact form and authenticated support tickets. Neither
-- table existed before (checked: no contact/support/ticket tables in the
-- schema). Both are tenant-independent platform tables, not scoped under
-- businesses — a contact/support request is between the sender and Luxore
-- itself, not any one tenant.

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  business_name text,
  email text not null,
  phone text,
  reason text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

create policy "anyone can submit a contact request"
  on public.contact_requests for insert
  to anon, authenticated
  with check (true);

create policy "platform admins can view contact requests"
  on public.contact_requests for select
  using (public.is_platform_admin());

create policy "platform admins can update contact requests"
  on public.contact_requests for update
  using (public.is_platform_admin());

create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  business_id uuid references public.businesses(id) on delete set null,
  category text not null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'waiting_customer', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_tickets enable row level security;

-- A submitter can only ever attach their own auth.uid() (or none, for a
-- logged-out visitor who can't sign in) — never someone else's.
create policy "users can submit their own support ticket"
  on public.support_tickets for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "users can view their own support tickets"
  on public.support_tickets for select
  using (user_id = auth.uid() or public.is_platform_admin());

create policy "platform admins can update support tickets"
  on public.support_tickets for update
  using (public.is_platform_admin());
