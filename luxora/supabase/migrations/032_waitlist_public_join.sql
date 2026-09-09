-- Public visitors can join a waitlist from the booking page (no
-- availability found) but can never read it back — no anon SELECT policy
-- exists on this table at all.
create policy "waitlist_insert_public" on public.waitlist
for insert with check (
  public.is_business_bookable(business_id)
  and status = 'waiting'
  and client_id is null
);

alter policy "waitlist_insert_public" on public.waitlist to anon, authenticated;
