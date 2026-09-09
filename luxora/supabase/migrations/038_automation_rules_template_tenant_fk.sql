-- Security fix: automation_rules.template_id only had a same-table FK to
-- message_templates(id), with no check that the template actually belongs
-- to the rule's own business_id. RLS on automation_rules only validates
-- the rule's own business_id (is_business_admin), so a business could
-- create a rule with a *guessed* template_id belonging to a different
-- tenant, and run_due_automations would then read that other tenant's
-- private template body into its own message_log. Replaces the
-- single-column FK with a compound one so the template must belong to the
-- same business as the rule, at the database level.
alter table public.message_templates add constraint message_templates_business_id_id_key unique (business_id, id);

alter table public.automation_rules drop constraint automation_rules_template_id_fkey;

alter table public.automation_rules
  add constraint automation_rules_template_business_fkey
  foreign key (template_id, business_id) references public.message_templates(id, business_id) on delete cascade;
