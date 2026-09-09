alter table public.businesses add column tax_rate_percent numeric(5,2) not null default 0;

-- One Stripe Connect Express account per business. Funds flow customer ->
-- Stripe -> this connected account -> the business's own bank, never
-- through a Luxora-owned account (see architecture note in payments RPC
-- comments below).
create table public.stripe_connected_accounts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  stripe_account_id text not null unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger stripe_connected_accounts_set_updated_at
before update on public.stripe_connected_accounts
for each row execute function public.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  appointment_id uuid references public.appointments(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  services_cents integer not null default 0,
  products_cents integer not null default 0,
  discount_cents integer not null default 0,
  tax_cents integer not null default 0,
  tip_cents integer not null default 0,
  deposit_applied_cents integer not null default 0,
  total_cents integer not null,
  method text not null check (method in ('card','terminal','tap_to_pay','cash','zelle','cash_app','other')),
  status text not null default 'succeeded' check (status in ('pending','succeeded','failed','refunded','partially_refunded')),
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create index payments_business_idx on public.payments(business_id, created_at desc);
create index payments_appointment_idx on public.payments(appointment_id);
create unique index payments_stripe_pi_idx on public.payments(stripe_payment_intent_id) where stripe_payment_intent_id is not null;

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  payment_id uuid not null references public.payments(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  reason text,
  stripe_refund_id text,
  created_at timestamptz not null default now()
);

create index refunds_payment_idx on public.refunds(payment_id);

alter table public.stripe_connected_accounts enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;

-- Connect status is admin-only (billing-sensitive); reconciliation from
-- Stripe webhooks (no Supabase user session) goes through the service role
-- instead, bypassing RLS by design — see 026 and the webhook route.
create policy "stripe_connected_accounts_select_admin" on public.stripe_connected_accounts
for select using (public.is_business_admin(business_id));

-- Payments/refunds: any active member can record a checkout (front desk
-- staff), but not just anyone should edit financial history after the
-- fact — restrict writes to admins, reads to all members.
create policy "payments_select_member" on public.payments
for select using (public.is_business_member(business_id));

create policy "payments_insert_member" on public.payments
for insert with check (public.is_business_member(business_id));

create policy "payments_update_admin" on public.payments
for update using (public.is_business_admin(business_id));

create policy "refunds_select_member" on public.refunds
for select using (public.is_business_member(business_id));

create policy "refunds_insert_admin" on public.refunds
for insert with check (public.is_business_admin(business_id));
