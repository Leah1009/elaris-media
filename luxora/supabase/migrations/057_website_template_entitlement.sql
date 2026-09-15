-- Gates access to the non-default website templates (Modern Dark, Soft
-- Beauty) behind Pro/Business, per the Subscription & Billing spec. Starter
-- keeps full use of one real template (Minimal Luxury) rather than losing
-- website access entirely.
insert into public.plan_entitlements (plan_id, key, value_type, value_boolean)
select id, 'feature_all_templates', 'boolean', case key when 'starter' then false else true end
from public.plans;
