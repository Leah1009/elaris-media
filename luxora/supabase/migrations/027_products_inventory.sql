create table public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  category text,
  sku text,
  barcode text,
  supplier text,
  cost_cents integer not null default 0,
  retail_price_cents integer not null default 0,
  quantity_on_hand integer not null default 0,
  reorder_threshold integer not null default 0,
  product_type text not null default 'retail' check (product_type in ('retail','supply','both')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create index products_business_idx on public.products(business_id);

create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  change_type text not null check (change_type in ('restock','sale','usage','adjustment','return')),
  quantity_delta integer not null,
  payment_id uuid,
  notes text,
  created_at timestamptz not null default now()
);

create index inventory_movements_product_idx on public.inventory_movements(product_id, created_at desc);

alter table public.products enable row level security;
alter table public.inventory_movements enable row level security;

create policy "products_select_member" on public.products
for select using (public.is_business_member(business_id));

create policy "products_write_admin" on public.products
for all using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

create policy "inventory_movements_select_member" on public.inventory_movements
for select using (public.is_business_member(business_id));

create policy "inventory_movements_insert_member" on public.inventory_movements
for insert with check (public.is_business_member(business_id));

alter policy "products_select_member" on public.products to authenticated;
alter policy "products_write_admin" on public.products to authenticated;
alter policy "inventory_movements_select_member" on public.inventory_movements to authenticated;
alter policy "inventory_movements_insert_member" on public.inventory_movements to authenticated;
