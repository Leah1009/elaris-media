-- Blocked time: a business closing a specific staff member (or an entire
-- location) for a period — lunch, a meeting, training, early closing, etc.
-- Distinct from appointments so it never shows up as a bookable client visit,
-- but lives in the same time-range space so both online booking and manual
-- scheduling can check against it.
create table public.appointment_blocks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  reason text,
  created_at timestamptz not null default now(),
  check (end_at > start_at)
);

comment on column public.appointment_blocks.staff_id is 'Null means the block applies to every staff member at the location.';

create index appointment_blocks_business_idx on public.appointment_blocks(business_id);
create index appointment_blocks_location_time_idx on public.appointment_blocks(location_id, start_at, end_at);
create index appointment_blocks_staff_time_idx on public.appointment_blocks(staff_id, start_at, end_at);

alter table public.appointment_blocks enable row level security;

create policy "appointment_blocks_select_member" on public.appointment_blocks
for select using (public.is_business_member(business_id));

create policy "appointment_blocks_write_member" on public.appointment_blocks
for all using (public.is_business_member(business_id))
with check (public.is_business_member(business_id));

-- Same double-booking guarantee as the staff-overlap exclusion on
-- appointments (migration 014), but blocks aren't appointments — a
-- database trigger is how a insert on one table can be rejected based on
-- overlap with rows in another. Fires on every insert path, including the
-- online-booking RPC, not just the dashboard form.
create or replace function public.check_appointment_block_conflict()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_reason text;
begin
  if new.status = 'cancelled' then
    return new;
  end if;

  select b.reason into v_reason
  from public.appointment_blocks b
  where b.location_id = new.location_id
    and (b.staff_id = new.staff_id or b.staff_id is null)
    and tstzrange(b.start_at, b.end_at, '[)') && tstzrange(new.start_at, new.end_at, '[)')
  limit 1;

  if found then
    raise exception 'This time is blocked% — choose another time.',
      case when v_reason is not null and length(trim(v_reason)) > 0 then format(' (%s)', v_reason) else '' end;
  end if;

  return new;
end;
$$;

create trigger appointments_check_block_conflict
before insert or update on public.appointments
for each row execute function public.check_appointment_block_conflict();
