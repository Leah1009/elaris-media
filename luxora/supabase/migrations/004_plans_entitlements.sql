create table public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  price_monthly_cents integer not null,
  display_order integer not null default 0,
  badge text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger plans_set_updated_at
before update on public.plans
for each row execute function public.set_updated_at();

create table public.plan_entitlements (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.plans(id) on delete cascade,
  key text not null,
  value_type text not null check (value_type in ('boolean','integer','text')),
  value_boolean boolean,
  value_integer integer,
  value_text text,
  unique (plan_id, key)
);

-- Seed values are provisional (see spec note on SMS allowances) and can be
-- changed here at any time without touching application code.
insert into public.plans (key, name, price_monthly_cents, display_order, badge) values
  ('starter', 'Starter', 4900, 1, null),
  ('pro', 'Pro', 9900, 2, 'MOST_POPULAR'),
  ('business', 'Business', 14900, 3, null);

insert into public.plan_entitlements (plan_id, key, value_type, value_integer)
select id, 'staff_limit', 'integer', case key when 'starter' then 3 when 'pro' then 8 when 'business' then 20 end
from public.plans;

insert into public.plan_entitlements (plan_id, key, value_type, value_integer)
select id, 'location_limit', 'integer', case key when 'starter' then 1 when 'pro' then 1 when 'business' then 5 end
from public.plans;

insert into public.plan_entitlements (plan_id, key, value_type, value_integer)
select id, 'sms_monthly_limit', 'integer', case key when 'starter' then 250 when 'pro' then 1000 when 'business' then 3000 end
from public.plans;

insert into public.plan_entitlements (plan_id, key, value_type, value_boolean)
select id, 'feature_two_way_messaging', 'boolean', case key when 'starter' then false else true end
from public.plans;

insert into public.plan_entitlements (plan_id, key, value_type, value_boolean)
select id, 'feature_advanced_reports', 'boolean', case key when 'starter' then false else true end
from public.plans;

insert into public.plan_entitlements (plan_id, key, value_type, value_boolean)
select id, 'feature_multi_location', 'boolean', case key when 'business' then true else false end
from public.plans;

alter table public.plans enable row level security;
create policy "plans_select_active" on public.plans for select using (is_active = true);

alter table public.plan_entitlements enable row level security;
create policy "plan_entitlements_select_all" on public.plan_entitlements for select using (true);
