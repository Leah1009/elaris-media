-- Payments area overhaul: per-business manual-method toggles, a real
-- (currently empty) hardware catalog + orders + device registry, and
-- 'paypal' added alongside the existing manual methods.

alter table public.payments drop constraint payments_method_check;
alter table public.payments
  add constraint payments_method_check
  check (method in ('card','terminal','tap_to_pay','cash','zelle','cash_app','paypal','other'));

-- Which manual methods this business currently accepts — Checkout reads
-- this so a disabled method never shows as an option there. Card/Tap to
-- Pay/Terminal aren't in this list: their availability is derived from the
-- real Stripe connection + device registration, never a manual toggle.
alter table public.businesses
  add column enabled_manual_methods text[] not null default array['cash','zelle','cash_app','other']::text[];

-- Real, platform-admin-managed hardware catalog. selling_price_cents is
-- nullable on purpose: until a platform admin sets a real price, the
-- product has no sellable price rather than a fabricated one.
-- internal_cost_cents must never reach tenant-facing queries — enforced by
-- restricting SELECT on this table to platform admins only, with
-- hardware_products_public (below) as the one tenant-safe read path.
create table public.hardware_products (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'luxore',
  provider_product_id text,
  name text not null,
  description text,
  image_url text,
  device_type text not null check (device_type in ('tap_to_pay', 'card_reader', 'smart_terminal')),
  selling_price_cents integer check (selling_price_cents is null or selling_price_cents >= 0),
  internal_cost_cents integer check (internal_cost_cents is null or internal_cost_cents >= 0),
  active boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger hardware_products_set_updated_at
before update on public.hardware_products
for each row execute function public.set_updated_at();

alter table public.hardware_products enable row level security;

create policy "hardware_products_admin_all" on public.hardware_products
for all to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

-- The one path tenant businesses read the catalog through — a view (not a
-- second RLS policy) so internal_cost_cents structurally cannot leak: it
-- isn't a column on this view at all.
create view public.hardware_products_public
as
select id, provider, name, description, image_url, device_type, selling_price_cents, active, display_order
from public.hardware_products
where active = true
order by display_order, name;

grant select on public.hardware_products_public to authenticated;

create table public.hardware_orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  hardware_product_id uuid not null references public.hardware_products(id),
  quantity integer not null default 1 check (quantity > 0),
  location_id uuid references public.locations(id) on delete set null,
  shipping_name text not null,
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_city text not null,
  shipping_state text not null,
  shipping_zip text not null,
  shipping_phone text,
  unit_price_cents integer not null,
  subtotal_cents integer not null,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'ordered', 'shipped', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger hardware_orders_set_updated_at
before update on public.hardware_orders
for each row execute function public.set_updated_at();

create index hardware_orders_business_idx on public.hardware_orders(business_id, created_at desc);

alter table public.hardware_orders enable row level security;

create policy "hardware_orders_select_member" on public.hardware_orders
for select to authenticated
using (public.is_business_member(business_id));

create policy "hardware_orders_insert_admin" on public.hardware_orders
for insert to authenticated
with check (public.is_business_admin(business_id));

create policy "hardware_orders_admin_manage" on public.hardware_orders
for all to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

-- Registered payment devices per business/location. Nothing populates this
-- yet (no terminal-registration flow exists) — it exists so "Your Devices"
-- has a real, honestly-empty source rather than a hardcoded placeholder.
create table public.business_devices (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  location_id uuid references public.locations(id) on delete set null,
  hardware_order_id uuid references public.hardware_orders(id) on delete set null,
  label text not null,
  device_type text not null check (device_type in ('tap_to_pay', 'card_reader', 'smart_terminal')),
  provider_device_id text,
  status text not null default 'offline' check (status in ('connected', 'offline')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger business_devices_set_updated_at
before update on public.business_devices
for each row execute function public.set_updated_at();

alter table public.business_devices enable row level security;

create policy "business_devices_select_member" on public.business_devices
for select to authenticated
using (public.is_business_member(business_id));

create policy "business_devices_write_admin" on public.business_devices
for all to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));
