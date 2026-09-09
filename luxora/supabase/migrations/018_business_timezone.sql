-- Scheduling needs a real IANA zone per business (initial market is
-- Miami/Florida) so wall-clock appointment times convert to UTC correctly,
-- including across DST changes.
alter table public.businesses add column timezone text not null default 'America/New_York';
