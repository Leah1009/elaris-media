alter table public.payments drop constraint payments_method_check;
alter table public.payments add constraint payments_method_check
  check (method in ('card','terminal','tap_to_pay','cash','zelle','cash_app','other','gift_card'));
alter table public.payments add column gift_card_applied_cents integer not null default 0;
alter table public.payments add column package_credit_applied boolean not null default false;

create table public.gift_cards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  code text not null unique,
  original_value_cents integer not null check (original_value_cents > 0),
  remaining_balance_cents integer not null,
  purchaser_client_id uuid references public.clients(id) on delete set null,
  recipient_name text,
  recipient_email text,
  status text not null default 'active' check (status in ('active','redeemed','expired','cancelled')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger gift_cards_set_updated_at
before update on public.gift_cards
for each row execute function public.set_updated_at();

create unique index gift_cards_business_code_idx on public.gift_cards(business_id, code);

create table public.gift_card_transactions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  gift_card_id uuid not null references public.gift_cards(id) on delete cascade,
  type text not null check (type in ('purchase','redemption','adjustment')),
  amount_cents integer not null,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz not null default now()
);

create index gift_card_transactions_card_idx on public.gift_card_transactions(gift_card_id, created_at desc);

alter table public.gift_cards enable row level security;
alter table public.gift_card_transactions enable row level security;

create policy "gift_cards_select_member" on public.gift_cards
for select using (public.is_business_member(business_id));

create policy "gift_cards_write_member" on public.gift_cards
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

create policy "gift_card_transactions_select_member" on public.gift_card_transactions
for select using (public.is_business_member(business_id));

create policy "gift_card_transactions_insert_member" on public.gift_card_transactions
for insert with check (public.is_business_member(business_id));

alter policy "gift_cards_select_member" on public.gift_cards to authenticated;
alter policy "gift_cards_write_member" on public.gift_cards to authenticated;
alter policy "gift_card_transactions_select_member" on public.gift_card_transactions to authenticated;
alter policy "gift_card_transactions_insert_member" on public.gift_card_transactions to authenticated;
