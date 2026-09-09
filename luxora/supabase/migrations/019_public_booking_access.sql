-- Booking gate: a single boolean, safe to expose to anon, that hides the
-- actual subscription/trial internals (anon has no access to those tables
-- at all — only this function, via SECURITY DEFINER, can see them).
create or replace function public.is_business_bookable(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select not s.is_locked from public.business_access_status s where s.business_id = target_business_id),
    false
  );
$$;

revoke execute on function public.is_business_bookable(uuid) from public;
grant execute on function public.is_business_bookable(uuid) to anon, authenticated;

-- Public, read-only visibility into what's needed to render a booking page
-- and compute availability — never clients, never appointments, never
-- anything financial/administrative.
create policy "businesses_select_public" on public.businesses
for select using (public.is_business_bookable(id));

create policy "services_select_public" on public.services
for select using (active = true and public.is_business_bookable(business_id));

create policy "staff_select_public" on public.staff
for select using (active = true and public.is_business_bookable(business_id));

create policy "locations_select_public" on public.locations
for select using (active = true and public.is_business_bookable(business_id));

create policy "business_hours_select_public" on public.business_hours
for select using (
  exists (
    select 1 from public.locations l
    where l.id = location_id and l.active and public.is_business_bookable(l.business_id)
  )
);

create policy "staff_services_select_public" on public.staff_services
for select using (
  exists (select 1 from public.staff s where s.id = staff_id and s.active and public.is_business_bookable(s.business_id))
);

create policy "staff_locations_select_public" on public.staff_locations
for select using (
  exists (select 1 from public.staff s where s.id = staff_id and s.active and public.is_business_bookable(s.business_id))
);

create policy "service_locations_select_public" on public.service_locations
for select using (
  exists (select 1 from public.services sv where sv.id = service_id and sv.active and public.is_business_bookable(sv.business_id))
);

-- appointments/appointment_services: no public SELECT policy is added.
-- Anon still needs to INSERT a booking; that policy is added in the next
-- migration alongside the availability + booking write path.
