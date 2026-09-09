-- Missed in 024: the onboarding action (run as the signed-in business
-- admin) needs to create/read its own row. Reconciliation from Stripe
-- webhooks — which have no Supabase user session at all — goes through
-- the service role instead, bypassing RLS entirely by design (see the
-- webhook route's own comments).
create policy "stripe_connected_accounts_insert_admin" on public.stripe_connected_accounts
for insert with check (public.is_business_admin(business_id));

create policy "stripe_connected_accounts_update_admin" on public.stripe_connected_accounts
for update using (public.is_business_admin(business_id));

alter policy "stripe_connected_accounts_insert_admin" on public.stripe_connected_accounts to authenticated;
alter policy "stripe_connected_accounts_update_admin" on public.stripe_connected_accounts to authenticated;
