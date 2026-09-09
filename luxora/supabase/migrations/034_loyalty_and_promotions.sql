-- Loyalty: points are earned from a completed payment's total and can be
-- redeemed as a currency-equivalent applied against a later payment,
-- exactly like the gift card flow in 028.
create table public.loyalty_programs (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  enabled boolean not null default false,
  cents_spent_per_point integer not null default 100 check (cents_spent_per_point > 0),
  point_value_cents integer not null default 1 check (point_value_cents > 0),
  min_redeem_points integer not null default 0 check (min_redeem_points >= 0),
  updated_at timestamptz not null default now()
);

create trigger loyalty_programs_set_updated_at
before update on public.loyalty_programs
for each row execute function public.set_updated_at();

create table public.client_loyalty_points (
  client_id uuid primary key references public.clients(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  points_balance integer not null default 0 check (points_balance >= 0),
  updated_at timestamptz not null default now()
);

create trigger client_loyalty_points_set_updated_at
before update on public.client_loyalty_points
for each row execute function public.set_updated_at();

create index client_loyalty_points_business_idx on public.client_loyalty_points(business_id);

create table public.loyalty_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  type text not null check (type in ('earn', 'redeem', 'adjustment')),
  points_delta integer not null,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz not null default now()
);

create index loyalty_transactions_client_idx on public.loyalty_transactions(client_id, created_at desc);

alter table public.payments add column loyalty_applied_cents integer not null default 0;
alter table public.payments add column loyalty_points_earned integer not null default 0;

-- Promotions: percent or fixed discount codes, unique per business,
-- optionally capped by total uses and/or uses per client.
create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null,
  description text,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10, 2) not null check (discount_value > 0),
  max_uses integer check (max_uses is null or max_uses > 0),
  uses_count integer not null default 0,
  per_client_limit integer check (per_client_limit is null or per_client_limit > 0),
  valid_from timestamptz,
  valid_to timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, code)
);

create trigger promotions_set_updated_at
before update on public.promotions
for each row execute function public.set_updated_at();

create table public.promotion_redemptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  discount_cents integer not null,
  created_at timestamptz not null default now()
);

create index promotion_redemptions_promotion_idx on public.promotion_redemptions(promotion_id);

alter table public.payments add column promotion_id uuid references public.promotions(id) on delete set null;

alter table public.loyalty_programs enable row level security;
alter table public.client_loyalty_points enable row level security;
alter table public.loyalty_transactions enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_redemptions enable row level security;

create policy "loyalty_programs_select_member" on public.loyalty_programs
for select using (public.is_business_member(business_id));
create policy "loyalty_programs_write_admin" on public.loyalty_programs
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

create policy "client_loyalty_points_select_member" on public.client_loyalty_points
for select using (public.is_business_member(business_id));
create policy "client_loyalty_points_write_member" on public.client_loyalty_points
for all using (public.is_business_member(business_id)) with check (public.is_business_member(business_id));

create policy "loyalty_transactions_select_member" on public.loyalty_transactions
for select using (public.is_business_member(business_id));
create policy "loyalty_transactions_insert_member" on public.loyalty_transactions
for insert with check (public.is_business_member(business_id));

create policy "promotions_select_member" on public.promotions
for select using (public.is_business_member(business_id));
create policy "promotions_write_admin" on public.promotions
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

create policy "promotion_redemptions_select_member" on public.promotion_redemptions
for select using (public.is_business_member(business_id));
create policy "promotion_redemptions_insert_member" on public.promotion_redemptions
for insert with check (public.is_business_member(business_id));

alter policy "loyalty_programs_select_member" on public.loyalty_programs to authenticated;
alter policy "loyalty_programs_write_admin" on public.loyalty_programs to authenticated;
alter policy "client_loyalty_points_select_member" on public.client_loyalty_points to authenticated;
alter policy "client_loyalty_points_write_member" on public.client_loyalty_points to authenticated;
alter policy "loyalty_transactions_select_member" on public.loyalty_transactions to authenticated;
alter policy "loyalty_transactions_insert_member" on public.loyalty_transactions to authenticated;
alter policy "promotions_select_member" on public.promotions to authenticated;
alter policy "promotions_write_admin" on public.promotions to authenticated;
alter policy "promotion_redemptions_select_member" on public.promotion_redemptions to authenticated;
alter policy "promotion_redemptions_insert_member" on public.promotion_redemptions to authenticated;
