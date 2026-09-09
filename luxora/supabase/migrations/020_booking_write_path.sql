create or replace function public.normalize_phone(p_phone text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_phone is null then null
    when length(regexp_replace(p_phone, '\D', '', 'g')) = 11
      and left(regexp_replace(p_phone, '\D', '', 'g'), 1) = '1'
      then substring(regexp_replace(p_phone, '\D', '', 'g') from 2)
    when length(regexp_replace(p_phone, '\D', '', 'g')) < 7 then null
    else regexp_replace(p_phone, '\D', '', 'g')
  end;
$$;

create or replace function public.normalize_email(p_email text)
returns text
language sql
immutable
set search_path = ''
as $$
  select nullif(lower(trim(p_email)), '');
$$;

revoke execute on function public.normalize_phone(text) from public, anon, authenticated;
revoke execute on function public.normalize_email(text) from public, anon, authenticated;

-- Returns only a first-name-plus-last-initial match, never a browsable
-- client list — this is deliberately the minimum needed for a
-- "Welcome back, Maria R. — is this you?" prompt, not a lookup tool.
-- Note (documented, not solved here): without rate limiting this can still
-- be probed with guessed phone numbers; real anti-enumeration hardening
-- (throttling, OTP-gated reveal) is deferred to the messaging phase.
create or replace function public.find_client_for_booking(
  p_business_id uuid,
  p_phone text,
  p_email text
)
returns table (id uuid, display_name text)
language sql
security definer
stable
set search_path = public
as $$
  select
    c.id,
    case
      when position(' ' in c.full_name) > 0 then
        split_part(c.full_name, ' ', 1) || ' ' || left(split_part(c.full_name, ' ', 2), 1) || '.'
      else c.full_name
    end as display_name
  from public.clients c
  where c.business_id = p_business_id
    and (
      (p_phone is not null and public.normalize_phone(c.phone) = public.normalize_phone(p_phone))
      or (p_email is not null and public.normalize_email(c.email) = public.normalize_email(p_email))
    )
  limit 1;
$$;

revoke execute on function public.find_client_for_booking(uuid, text, text) from public;
grant execute on function public.find_client_for_booking(uuid, text, text) to anon, authenticated;

-- Single atomic, validated write path for a public booking — mirrors
-- register_business's approach. Anon never gets raw INSERT policies on
-- appointments/clients; every check (business bookable, staff/service/
-- location actually belong to this business, client_id isn't borrowed from
-- another tenant) happens inside this function before anything is written.
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

revoke execute on function public.create_online_booking(
  uuid, uuid[], uuid, uuid, timestamptz, uuid, text, text, text, text, jsonb
) from public;
grant execute on function public.create_online_booking(
  uuid, uuid[], uuid, uuid, timestamptz, uuid, text, text, text, text, jsonb
) to anon, authenticated;
