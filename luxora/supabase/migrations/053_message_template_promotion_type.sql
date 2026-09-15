-- Adds a distinct "promotion" template type alongside "marketing" — both
-- support an attached image, but promotions are tied to a specific promo
-- code/discount rather than general marketing copy.
alter table public.message_templates drop constraint message_templates_type_check;
alter table public.message_templates
  add constraint message_templates_type_check
  check (type in ('appointment_reminder', 'appointment_confirmation', 'review_request', 'marketing', 'promotion', 'custom'));
