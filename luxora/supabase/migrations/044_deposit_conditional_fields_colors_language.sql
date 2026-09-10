-- Service color-coding (used on the calendar).
alter table public.services add column color text;

-- Deposit tracking on appointments: how much is required, how much has
-- actually been paid so far (via recordManualPayment /
-- recordDepositPayment), and the 24-hour deadline after which an unpaid
-- deposit auto-cancels the appointment (see enforce_deposit_deadlines
-- below). deposit_status already exists (none/required/paid) from
-- migration 014 — these columns make it enforceable instead of just
-- informational.
alter table public.appointments add column deposit_amount_cents integer not null default 0 check (deposit_amount_cents >= 0);
alter table public.appointments add column deposit_paid_cents integer not null default 0 check (deposit_paid_cents >= 0);
alter table public.appointments add column deposit_due_at timestamptz;

-- Conditional/dynamic form fields: a field can declare it only appears
-- when another field on the same form was answered a specific way (e.g.
-- "Please list any allergies" only shows when "Do you have any allergies?"
-- = "Yes"). Enforced client-side in the fill-out UI and re-validated
-- server-side on submission.
alter table public.form_fields add column depends_on_field_id uuid references public.form_fields(id) on delete cascade;
alter table public.form_fields add column depends_on_value text;
alter table public.form_fields add constraint form_fields_depends_on_requires_value
  check (depends_on_field_id is null or depends_on_value is not null);

-- Dashboard language preference, set once at business registration and
-- changeable later from Business Profile settings.
alter table public.businesses add column preferred_language text not null default 'en' check (preferred_language in ('en', 'es'));

-- Auto-cancels appointments whose deposit deadline has passed without full
-- payment, and logs a cancellation notice via message_log (same
-- provider-not-configured honesty as run_due_automations — this queues the
-- notice, it doesn't fake sending it).
create or replace function public.enforce_deposit_deadlines(p_business_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_appt record;
  v_count integer := 0;
begin
  if not public.is_business_admin(p_business_id) then
    raise exception 'Not authorized.';
  end if;

  for v_appt in
    select a.id, a.client_id
    from public.appointments a
    where a.business_id = p_business_id
      and a.deposit_status = 'required'
      and a.deposit_due_at is not null
      and a.deposit_due_at <= now()
      and a.deposit_paid_cents < a.deposit_amount_cents
      and a.status not in ('cancelled', 'completed', 'no_show')
  loop
    update public.appointments set status = 'cancelled' where id = v_appt.id;

    insert into public.message_log (business_id, client_id, appointment_id, channel, body, status)
    select
      p_business_id,
      v_appt.client_id,
      v_appt.id,
      case when c.sms_consent then 'sms' else 'email' end,
      'Your appointment was cancelled because the required deposit was not received within 24 hours.',
      case when (c.sms_consent or c.email_consent) then 'provider_not_configured' else 'skipped_no_consent' end
    from public.clients c where c.id = v_appt.client_id;

    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke execute on function public.enforce_deposit_deadlines(uuid) from public, anon;
grant execute on function public.enforce_deposit_deadlines(uuid) to authenticated;
