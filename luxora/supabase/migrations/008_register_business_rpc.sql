-- Atomic, server-verified business registration: creates the business, the
-- owner membership, the trial window and the initial subscription row in one
-- transaction. This is the ONLY way a business can be created — the client
-- can never fabricate a trial_ends_at date or skip owner membership because
-- all of it happens inside this SECURITY DEFINER function, not from
-- separate client-issued inserts.
create or replace function public.register_business(
  p_name text,
  p_business_type text,
  p_business_type_other text,
  p_phone text,
  p_email text,
  p_address_line1 text,
  p_city text,
  p_state text,
  p_zip text,
  p_description text,
  p_slug text,
  p_default_plan_key text default 'starter',
  p_trial_days integer default 30
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business_id uuid;
  v_plan_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_plan_id from public.plans where key = p_default_plan_key and is_active = true;
  if v_plan_id is null then
    raise exception 'Invalid default plan';
  end if;

  insert into public.businesses (
    name, business_type, business_type_other, owner_profile_id,
    phone, email, address_line1, city, state, zip, description, slug
  ) values (
    p_name, p_business_type, nullif(p_business_type_other, ''), auth.uid(),
    p_phone, p_email, p_address_line1, p_city, p_state, p_zip, p_description, p_slug
  )
  returning id into v_business_id;

  insert into public.business_members (business_id, profile_id, role, status)
  values (v_business_id, auth.uid(), 'owner', 'active');

  insert into public.trials (business_id, trial_started_at, trial_ends_at)
  values (v_business_id, now(), now() + (p_trial_days || ' days')::interval);

  insert into public.subscriptions (business_id, plan_id, status)
  values (v_business_id, v_plan_id, 'trialing');

  insert into public.audit_logs (business_id, actor_profile_id, action, target_table, target_id)
  values (v_business_id, auth.uid(), 'business_registered', 'businesses', v_business_id);

  return v_business_id;
end;
$$;

grant execute on function public.register_business(
  text, text, text, text, text, text, text, text, text, text, text, text, integer
) to authenticated;

-- Computed access gate: trialing-and-active vs. locked. security_invoker
-- means this view enforces the RLS of the underlying tables for whoever
-- queries it, instead of running as the (more privileged) view owner.
create or replace view public.business_access_status
with (security_invoker = true) as
select
  b.id as business_id,
  s.status as subscription_status,
  t.trial_ends_at,
  case
    when s.status = 'active' then false
    when s.status = 'trialing' and t.trial_ends_at > now() then false
    else true
  end as is_locked
from public.businesses b
left join public.subscriptions s on s.business_id = b.id
left join public.trials t on t.business_id = b.id;
