-- The availability search API already respects online_booking_enabled/
-- booking_window_days/min_notice_hours, but that's a convenience — the
-- actual write path (create_online_booking) is the real boundary and must
-- enforce them itself, or a client could just call the RPC directly with
-- an arbitrary p_start_at and bypass all three.
create or replace function public.create_online_booking(
  p_business_id uuid,
  p_service_ids uuid[],
  p_staff_id uuid,
  p_location_id uuid,
  p_start_at timestamptz,
  p_client_id uuid default null,
  p_new_client_full_name text default null,
  p_new_client_phone text default null,
  p_new_client_email text default null,
  p_notes text default null,
  p_form_submissions jsonb default '[]'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_business public.businesses;
  v_client_id uuid;
  v_total_minutes integer;
  v_any_deposit boolean;
  v_end_at timestamptz;
  v_appointment_id uuid;
  v_submission jsonb;
begin
  if not public.is_business_bookable(p_business_id) then
    raise exception 'This business is not currently accepting online bookings.';
  end if;

  select * into v_business from public.businesses where id = p_business_id;

  if not v_business.online_booking_enabled then
    raise exception 'Online booking is currently turned off for this business.';
  end if;
  if p_start_at < now() + (v_business.min_notice_hours || ' hours')::interval then
    raise exception 'This time is too soon — please choose a time further out.';
  end if;
  if p_start_at > now() + (v_business.booking_window_days || ' days')::interval then
    raise exception 'This date is too far in the future to book online.';
  end if;

  if not exists (
    select 1 from public.staff where id = p_staff_id and business_id = p_business_id and active
  ) then
    raise exception 'Invalid staff selection.';
  end if;

  if not exists (
    select 1 from public.locations where id = p_location_id and business_id = p_business_id and active
  ) then
    raise exception 'Invalid location selection.';
  end if;

  select sum(duration_minutes), bool_or(deposit_required)
    into v_total_minutes, v_any_deposit
  from public.services
  where id = any(p_service_ids) and business_id = p_business_id and active;

  if v_total_minutes is null or v_total_minutes <= 0 then
    raise exception 'Invalid service selection.';
  end if;

  if p_client_id is not null then
    select id into v_client_id from public.clients
    where id = p_client_id and business_id = p_business_id;

    if v_client_id is null then
      raise exception 'Invalid client reference.';
    end if;
  else
    if p_new_client_full_name is null or length(trim(p_new_client_full_name)) = 0 then
      raise exception 'Client name is required.';
    end if;

    insert into public.clients (business_id, full_name, phone, email)
    values (p_business_id, p_new_client_full_name, p_new_client_phone, p_new_client_email)
    returning id into v_client_id;
  end if;

  v_end_at := p_start_at + (v_total_minutes || ' minutes')::interval;

  insert into public.appointments (
    business_id, location_id, client_id, staff_id, start_at, end_at,
    status, notes, deposit_status, source
  ) values (
    p_business_id, p_location_id, v_client_id, p_staff_id, p_start_at, v_end_at,
    'pending', p_notes, case when v_any_deposit then 'required' else 'none' end, 'online'
  )
  returning id into v_appointment_id;

  insert into public.appointment_services (appointment_id, service_id, price_cents, duration_minutes)
  select v_appointment_id, s.id, s.price_cents, s.duration_minutes
  from public.services s
  where s.id = any(p_service_ids) and s.business_id = p_business_id and s.active;

  for v_submission in select * from jsonb_array_elements(p_form_submissions)
  loop
    insert into public.form_submissions (business_id, form_id, client_id, appointment_id, answers)
    values (
      p_business_id,
      (v_submission ->> 'form_id')::uuid,
      v_client_id,
      v_appointment_id,
      coalesce(v_submission -> 'answers', '{}'::jsonb)
    );
  end loop;

  return v_appointment_id;
end;
$$;
