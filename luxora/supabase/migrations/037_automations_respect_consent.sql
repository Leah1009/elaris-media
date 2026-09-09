-- Corrects run_due_automations (036): it was logging every due trigger as
-- provider_not_configured regardless of the client's communication
-- consent. Automations must honor the same consent gate manual sends go
-- through (src/lib/luxora/messaging.ts) — a client who never opted in to
-- SMS/email shouldn't be queued for one just because an automation fired.
create or replace function public.run_due_automations(p_business_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rule record;
  v_appt record;
  v_count integer := 0;
begin
  if not public.is_business_admin(p_business_id) then
    raise exception 'Not authorized.';
  end if;

  for v_rule in
    select * from public.automation_rules
    where business_id = p_business_id and active
  loop
    for v_appt in
      select a.id as appointment_id, a.client_id
      from public.appointments a
      where a.business_id = p_business_id
        and a.status = (case when v_rule.trigger_type = 'appointment_completed' then 'completed' else 'no_show' end)
        and a.updated_at <= now() - (v_rule.delay_hours || ' hours')::interval
        and not exists (
          select 1 from public.message_log ml
          where ml.automation_rule_id = v_rule.id and ml.appointment_id = a.id
        )
    loop
      insert into public.message_log (
        business_id, client_id, appointment_id, automation_rule_id,
        channel, template_id, body, status
      )
      select
        p_business_id, v_appt.client_id, v_appt.appointment_id, v_rule.id,
        mt.channel, mt.id, mt.body,
        case
          when mt.channel = 'sms' and not coalesce(c.sms_consent, false) then 'skipped_no_consent'
          when mt.channel = 'email' and not coalesce(c.email_consent, false) then 'skipped_no_consent'
          else 'provider_not_configured'
        end
      from public.message_templates mt
      join public.clients c on c.id = v_appt.client_id
      where mt.id = v_rule.template_id;

      v_count := v_count + 1;
    end loop;
  end loop;

  return v_count;
end;
$$;
