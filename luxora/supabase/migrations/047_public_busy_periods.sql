-- appointments and appointment_blocks are both member-only under RLS (they
-- carry client names, notes, block reasons — real privacy-sensitive data),
-- so an anonymous booking visitor's read of either table returns zero rows.
-- The public availability route was silently getting an empty busy-list as
-- a result, meaning it never actually excluded real bookings before this —
-- the database's EXCLUDE constraint on appointments was the only thing
-- stopping an actual double-booking, after showing a slot as free that
-- wasn't. This closes that gap the same way the rest of public booking
-- works: a SECURITY DEFINER function returning only the time ranges (no
-- client/notes/reason) a visitor needs to compute real availability.
create or replace function public.get_public_busy_periods(
  p_business_id uuid,
  p_location_id uuid,
  p_range_start timestamptz,
  p_range_end timestamptz
)
returns table (staff_id uuid, start_at timestamptz, end_at timestamptz)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_business_bookable(p_business_id) then
    return;
  end if;

  return query
  select a.staff_id, a.start_at, a.end_at
  from public.appointments a
  where a.business_id = p_business_id
    and a.location_id = p_location_id
    and a.status <> 'cancelled'
    and a.start_at < p_range_end
    and a.end_at > p_range_start
  union all
  select b.staff_id, b.start_at, b.end_at
  from public.appointment_blocks b
  where b.business_id = p_business_id
    and b.location_id = p_location_id
    and b.start_at < p_range_end
    and b.end_at > p_range_start;
end;
$$;

revoke execute on function public.get_public_busy_periods(uuid, uuid, timestamptz, timestamptz) from public;
grant execute on function public.get_public_busy_periods(uuid, uuid, timestamptz, timestamptz) to anon, authenticated;
