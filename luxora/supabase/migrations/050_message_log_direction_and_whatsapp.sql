-- Prepares messaging for a real two-way chat UI. Today message_log only
-- ever holds outbound (business/system -> client) rows, since no SMS/email
-- provider is connected yet — but the Messages page is being redesigned as
-- a chat, and WhatsApp is the most likely channel to connect next, so both
-- get added now rather than requiring another migration once a provider
-- actually exists.

alter table public.message_log
  add column direction text not null default 'outbound';

alter table public.message_log
  add constraint message_log_direction_check check (direction = any (array['inbound', 'outbound']));

alter table public.message_log drop constraint message_log_channel_check;
alter table public.message_log
  add constraint message_log_channel_check check (channel = any (array['sms', 'email', 'whatsapp']));

alter table public.message_templates drop constraint message_templates_channel_check;
alter table public.message_templates
  add constraint message_templates_channel_check check (channel = any (array['sms', 'email', 'whatsapp']));
