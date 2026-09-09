-- Extends register_business (008) so every new business starts with a
-- usable primary location, sensible default business hours, and the
-- default client tags from the spec — without any extra client round trip.
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
  v_location_id uuid;
  v_day int;
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

  insert into public.locations (business_id, name, address_line1, city, state, zip, phone, is_primary, active)
  values (v_business_id, p_name, p_address_line1, p_city, p_state, p_zip, p_phone, true, true)
  returning id into v_location_id;

  for v_day in 0..6 loop
    insert into public.business_hours (location_id, day_of_week, open_time, close_time, closed)
    values (
      v_location_id, v_day,
      case when v_day between 1 and 5 then time '09:00' end,
      case when v_day between 1 and 5 then time '17:00' end,
      v_day not between 1 and 5
    );
  end loop;

  insert into public.client_tags (business_id, name)
  values
    (v_business_id, 'New'),
    (v_business_id, 'Returning'),
    (v_business_id, 'VIP'),
    (v_business_id, 'Inactive'),
    (v_business_id, 'High Value');

  insert into public.audit_logs (business_id, actor_profile_id, action, target_table, target_id)
  values (v_business_id, auth.uid(), 'business_registered', 'businesses', v_business_id);

  return v_business_id;
end;
$$;
