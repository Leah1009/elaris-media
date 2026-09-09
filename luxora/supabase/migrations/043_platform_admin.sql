-- Luxora Super Admin: every capability here is a curated SECURITY DEFINER
-- function that checks is_platform_admin() itself, the same pattern used
-- throughout (create_online_booking, redeem_promotion, run_due_automations)
-- rather than blanket cross-tenant RLS policies on businesses/subscriptions/
-- etc. That keeps the set of privileged operations small, named, and
-- auditable instead of opening a wide SELECT/UPDATE hole that every future
-- query against those tables has to be trusted not to abuse.
create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_platform_admin from public.profiles where id = auth.uid()), false);
$$;

revoke execute on function public.is_platform_admin() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;

-- business_access_status (008) never actually consulted businesses.status —
-- a platform admin "locking" a business would have silently done nothing.
-- Fixed so an explicit lock/suspend always wins over subscription state.
create or replace view public.business_access_status
with (security_invoker = true) as
select
  b.id as business_id,
  s.status as subscription_status,
  t.trial_ends_at,
  case
    when b.status in ('locked', 'suspended') then true
    when s.status = 'active' then false
    when s.status = 'trialing' and t.trial_ends_at > now() then false
    else true
  end as is_locked
from public.businesses b
left join public.subscriptions s on s.business_id = b.id
left join public.trials t on t.business_id = b.id;

create or replace function public.admin_platform_stats()
returns table (
  total_businesses integer,
  trialing_count integer,
  active_count integer,
  locked_count integer,
  mrr_cents bigint
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    (select count(*)::integer from public.businesses),
    (select count(*)::integer from public.subscriptions where status = 'trialing'),
    (select count(*)::integer from public.subscriptions where status = 'active'),
    (select count(*)::integer from public.business_access_status where is_locked),
    coalesce((
      select sum(p.price_monthly_cents)
      from public.subscriptions s
      join public.plans p on p.id = s.plan_id
      where s.status = 'active'
    ), 0);
end;
$$;

revoke execute on function public.admin_platform_stats() from public, anon;
grant execute on function public.admin_platform_stats() to authenticated;

create or replace function public.admin_list_businesses()
returns table (
  id uuid,
  name text,
  slug text,
  business_type text,
  email text,
  phone text,
  status text,
  created_at timestamptz,
  subscription_status text,
  plan_name text,
  trial_ends_at timestamptz,
  is_locked boolean,
  member_count integer
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    b.id, b.name, b.slug, b.business_type, b.email, b.phone, b.status, b.created_at,
    s.status, p.name, t.trial_ends_at, coalesce(bas.is_locked, true),
    (select count(*)::integer from public.business_members bm where bm.business_id = b.id)
  from public.businesses b
  left join public.subscriptions s on s.business_id = b.id
  left join public.plans p on p.id = s.plan_id
  left join public.trials t on t.business_id = b.id
  left join public.business_access_status bas on bas.business_id = b.id
  order by b.created_at desc;
end;
$$;

revoke execute on function public.admin_list_businesses() from public, anon;
grant execute on function public.admin_list_businesses() to authenticated;

create or replace function public.admin_get_business(p_business_id uuid)
returns table (
  id uuid,
  name text,
  slug text,
  business_type text,
  email text,
  phone text,
  status text,
  created_at timestamptz,
  subscription_id uuid,
  subscription_status text,
  plan_id uuid,
  plan_name text,
  trial_ends_at timestamptz,
  is_locked boolean
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    b.id, b.name, b.slug, b.business_type, b.email, b.phone, b.status, b.created_at,
    s.id, s.status, p.id, p.name, t.trial_ends_at, coalesce(bas.is_locked, true)
  from public.businesses b
  left join public.subscriptions s on s.business_id = b.id
  left join public.plans p on p.id = s.plan_id
  left join public.trials t on t.business_id = b.id
  left join public.business_access_status bas on bas.business_id = b.id
  where b.id = p_business_id;
end;
$$;

revoke execute on function public.admin_get_business(uuid) from public, anon;
grant execute on function public.admin_get_business(uuid) to authenticated;

create or replace function public.admin_list_business_members(p_business_id uuid)
returns table (profile_id uuid, full_name text, role text, status text)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select bm.profile_id, pr.full_name, bm.role, bm.status
  from public.business_members bm
  join public.profiles pr on pr.id = bm.profile_id
  where bm.business_id = p_business_id
  order by bm.role;
end;
$$;

revoke execute on function public.admin_list_business_members(uuid) from public, anon;
grant execute on function public.admin_list_business_members(uuid) to authenticated;

create or replace function public.admin_list_audit_logs(p_business_id uuid, p_limit integer default 50)
returns table (id uuid, action text, target_table text, target_id uuid, metadata jsonb, created_at timestamptz, actor_name text)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select al.id, al.action, al.target_table, al.target_id, al.metadata, al.created_at, pr.full_name
  from public.audit_logs al
  left join public.profiles pr on pr.id = al.actor_profile_id
  where al.business_id = p_business_id
  order by al.created_at desc
  limit least(p_limit, 200);
end;
$$;

revoke execute on function public.admin_list_audit_logs(uuid, integer) from public, anon;
grant execute on function public.admin_list_audit_logs(uuid, integer) to authenticated;

create or replace function public.admin_set_business_status(p_business_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;
  if p_status not in ('active', 'locked', 'suspended') then
    raise exception 'Invalid status.';
  end if;

  update public.businesses set status = p_status where id = p_business_id;

  insert into public.audit_logs (business_id, actor_profile_id, action, target_table, target_id, metadata)
  values (p_business_id, auth.uid(), 'admin_set_business_status', 'businesses', p_business_id, jsonb_build_object('status', p_status));
end;
$$;

revoke execute on function public.admin_set_business_status(uuid, text) from public, anon;
grant execute on function public.admin_set_business_status(uuid, text) to authenticated;

create or replace function public.admin_update_subscription(p_business_id uuid, p_plan_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;
  if p_status not in ('trialing', 'active', 'past_due', 'canceled') then
    raise exception 'Invalid status.';
  end if;
  if not exists (select 1 from public.plans where id = p_plan_id) then
    raise exception 'Invalid plan.';
  end if;

  update public.subscriptions set plan_id = p_plan_id, status = p_status where business_id = p_business_id;

  insert into public.audit_logs (business_id, actor_profile_id, action, target_table, target_id, metadata)
  values (
    p_business_id, auth.uid(), 'admin_update_subscription', 'subscriptions', p_business_id,
    jsonb_build_object('plan_id', p_plan_id, 'status', p_status)
  );
end;
$$;

revoke execute on function public.admin_update_subscription(uuid, uuid, text) from public, anon;
grant execute on function public.admin_update_subscription(uuid, uuid, text) to authenticated;

create or replace function public.admin_extend_trial(p_business_id uuid, p_new_trial_end timestamptz)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;
  if p_new_trial_end <= now() then
    raise exception 'New trial end must be in the future.';
  end if;

  update public.trials set trial_ends_at = p_new_trial_end where business_id = p_business_id;

  insert into public.audit_logs (business_id, actor_profile_id, action, target_table, target_id, metadata)
  values (p_business_id, auth.uid(), 'admin_extend_trial', 'trials', p_business_id, jsonb_build_object('trial_ends_at', p_new_trial_end));
end;
$$;

revoke execute on function public.admin_extend_trial(uuid, timestamptz) from public, anon;
grant execute on function public.admin_extend_trial(uuid, timestamptz) to authenticated;

create or replace function public.admin_list_plans()
returns table (
  id uuid,
  key text,
  name text,
  price_monthly_cents integer,
  display_order integer,
  badge text,
  is_active boolean,
  entitlements jsonb
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  return query
  select
    p.id, p.key, p.name, p.price_monthly_cents, p.display_order, p.badge, p.is_active,
    coalesce(
      (select jsonb_agg(jsonb_build_object(
         'key', pe.key, 'value_type', pe.value_type,
         'value_boolean', pe.value_boolean, 'value_integer', pe.value_integer, 'value_text', pe.value_text
       ) order by pe.key)
       from public.plan_entitlements pe where pe.plan_id = p.id),
      '[]'::jsonb
    )
  from public.plans p
  order by p.display_order;
end;
$$;

revoke execute on function public.admin_list_plans() from public, anon;
grant execute on function public.admin_list_plans() to authenticated;

create or replace function public.admin_update_plan(
  p_plan_id uuid,
  p_name text,
  p_price_monthly_cents integer,
  p_badge text,
  p_is_active boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;

  update public.plans
  set name = p_name, price_monthly_cents = p_price_monthly_cents, badge = nullif(p_badge, ''), is_active = p_is_active
  where id = p_plan_id;
end;
$$;

revoke execute on function public.admin_update_plan(uuid, text, integer, text, boolean) from public, anon;
grant execute on function public.admin_update_plan(uuid, text, integer, text, boolean) to authenticated;

create or replace function public.admin_upsert_entitlement(
  p_plan_id uuid,
  p_key text,
  p_value_type text,
  p_value_boolean boolean default null,
  p_value_integer integer default null,
  p_value_text text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized.';
  end if;
  if p_value_type not in ('boolean', 'integer', 'text') then
    raise exception 'Invalid value type.';
  end if;

  insert into public.plan_entitlements (plan_id, key, value_type, value_boolean, value_integer, value_text)
  values (p_plan_id, p_key, p_value_type, p_value_boolean, p_value_integer, p_value_text)
  on conflict (plan_id, key) do update set
    value_type = excluded.value_type,
    value_boolean = excluded.value_boolean,
    value_integer = excluded.value_integer,
    value_text = excluded.value_text;
end;
$$;

revoke execute on function public.admin_upsert_entitlement(uuid, text, text, boolean, integer, text) from public, anon;
grant execute on function public.admin_upsert_entitlement(uuid, text, text, boolean, integer, text) to authenticated;
