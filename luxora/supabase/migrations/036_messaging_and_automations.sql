-- Communication consent: required before any SMS/email send. No default
-- opt-in — both start false and must be explicitly recorded (booking form
-- checkbox, or a staff member toggling it with the client present).
alter table public.clients add column sms_consent boolean not null default false;
alter table public.clients add column sms_consent_at timestamptz;
alter table public.clients add column email_consent boolean not null default false;
alter table public.clients add column email_consent_at timestamptz;

create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  type text not null check (type in ('appointment_reminder', 'appointment_confirmation', 'review_request', 'marketing', 'custom')),
  channel text not null check (channel in ('sms', 'email')),
  subject text,
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, name)
);

create trigger message_templates_set_updated_at
before update on public.message_templates
for each row execute function public.set_updated_at();

-- Every attempted send is logged, whether or not it actually went out —
-- this is the audit trail plus the dedupe key automations use to avoid
-- re-sending. status='provider_not_configured' is expected and honest
-- until a real SMS/email provider (Twilio + A2P 10DLC, or a transactional
-- email API) is connected — see src/lib/luxora/messaging.ts.
create table public.message_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  automation_rule_id uuid,
  channel text not null check (channel in ('sms', 'email')),
  template_id uuid references public.message_templates(id) on delete set null,
  to_address text,
  subject text,
  body text not null,
  status text not null check (status in ('sent', 'failed', 'skipped_no_consent', 'provider_not_configured')),
  provider_message_id text,
  error text,
  created_at timestamptz not null default now()
);

create index message_log_business_idx on public.message_log(business_id, created_at desc);
create index message_log_client_idx on public.message_log(client_id);

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  trigger_type text not null check (trigger_type in ('appointment_completed', 'appointment_no_show')),
  delay_hours integer not null default 0 check (delay_hours >= 0),
  template_id uuid not null references public.message_templates(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger automation_rules_set_updated_at
before update on public.automation_rules
for each row execute function public.set_updated_at();

alter table public.message_log
  add constraint message_log_automation_rule_fkey
  foreign key (automation_rule_id) references public.automation_rules(id) on delete set null;

-- One automated send per (rule, appointment) — the evaluator uses this to
-- know a trigger has already fired, so re-running it is always safe.
create unique index message_log_automation_dedupe_idx
  on public.message_log(automation_rule_id, appointment_id)
  where automation_rule_id is not null and appointment_id is not null;

alter table public.message_templates enable row level security;
alter table public.message_log enable row level security;
alter table public.automation_rules enable row level security;

create policy "message_templates_select_member" on public.message_templates
for select using (public.is_business_member(business_id));
create policy "message_templates_write_admin" on public.message_templates
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

create policy "message_log_select_member" on public.message_log
for select using (public.is_business_member(business_id));
create policy "message_log_insert_member" on public.message_log
for insert with check (public.is_business_member(business_id));

create policy "automation_rules_select_member" on public.automation_rules
for select using (public.is_business_member(business_id));
create policy "automation_rules_write_admin" on public.automation_rules
for all using (public.is_business_admin(business_id)) with check (public.is_business_admin(business_id));

alter policy "message_templates_select_member" on public.message_templates to authenticated;
alter policy "message_templates_write_admin" on public.message_templates to authenticated;
alter policy "message_log_select_member" on public.message_log to authenticated;
alter policy "message_log_insert_member" on public.message_log to authenticated;
alter policy "automation_rules_select_member" on public.automation_rules to authenticated;
alter policy "automation_rules_write_admin" on public.automation_rules to authenticated;

-- Evaluates due automation rules for one business and logs the (inert,
-- provider-not-configured) sends they would trigger. Real unattended
-- scheduling needs something to call this periodically — e.g. a Postgres
-- cron job (the pg_cron extension is available on this project but not
-- enabled) or an external scheduler — which is an infrastructure decision
-- left to the business owner, not switched on silently here. Until then,
-- this can be run on demand from Settings -> Automations.
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
        'provider_not_configured'
      from public.message_templates mt
      where mt.id = v_rule.template_id;

      v_count := v_count + 1;
    end loop;
  end loop;

  return v_count;
end;
$$;

revoke execute on function public.run_due_automations(uuid) from public, anon;
grant execute on function public.run_due_automations(uuid) to authenticated;
