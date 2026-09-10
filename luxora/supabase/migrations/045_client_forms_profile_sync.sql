-- Lets a form field declare that its answer should sync straight into the
-- client's profile record (e.g. the "New Client" template's Full Name field
-- writes to clients.full_name) instead of only ever living inside
-- form_submissions.answers as opaque JSON.
alter table public.form_fields add column client_field_key text
  check (client_field_key is null or client_field_key in (
    'full_name', 'phone', 'email', 'birthday', 'has_allergies', 'allergy_notes'
  ));

-- Structured allergy fields for the New Client template — previously only
-- a free-text clients.notes column existed, which isn't queryable/reportable.
alter table public.clients add column has_allergies boolean;
alter table public.clients add column allergy_notes text;

-- Same signature as migration 042's create_online_booking; adds a pass
-- after each form submission is recorded that copies any answer whose
-- field declares a client_field_key onto the client row, so a business
-- doesn't have to re-key what the client just typed. Blank answers are
-- left alone rather than clobbering existing data.
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
  v_field record;
  v_value text;
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

    for v_field in
      select ff.id, ff.client_field_key
      from public.form_fields ff
      where ff.form_id = (v_submission ->> 'form_id')::uuid
        and ff.client_field_key is not null
    loop
      v_value := v_submission -> 'answers' ->> v_field.id::text;
      if v_value is not null and length(trim(v_value)) > 0 then
        case v_field.client_field_key
          when 'full_name' then update public.clients set full_name = v_value where id = v_client_id;
          when 'phone' then update public.clients set phone = v_value where id = v_client_id;
          when 'email' then update public.clients set email = v_value where id = v_client_id;
          when 'birthday' then update public.clients set birthday = v_value::date where id = v_client_id;
          when 'has_allergies' then update public.clients set has_allergies = (lower(v_value) = 'yes') where id = v_client_id;
          when 'allergy_notes' then update public.clients set allergy_notes = v_value where id = v_client_id;
          else null;
        end case;
      end if;
    end loop;
  end loop;

  return v_appointment_id;
end;
$$;
