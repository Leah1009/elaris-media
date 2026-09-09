-- SECURITY DEFINER is required here: RLS policies on business_members would
-- otherwise recurse into themselves when checking membership. These
-- functions are the single source of truth for "is this user in this
-- business" and are granted to `authenticated` only (see 009).
create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = target_business_id
      and profile_id = auth.uid()
      and status = 'active'
  );
$$;

create or replace function public.is_business_admin(target_business_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.business_members
    where business_id = target_business_id
      and profile_id = auth.uid()
      and status = 'active'
      and role in ('owner','manager')
  );
$$;

alter table public.businesses enable row level security;

create policy "businesses_select_member" on public.businesses
for select using (public.is_business_member(id));

create policy "businesses_update_admin" on public.businesses
for update using (public.is_business_admin(id));

-- No insert/delete policy: businesses are only created via the
-- register_business RPC (008) and never deleted from the client.

alter table public.business_members enable row level security;

create policy "business_members_select_member" on public.business_members
for select using (public.is_business_member(business_id));

create policy "business_members_insert_admin" on public.business_members
for insert with check (public.is_business_admin(business_id) and role <> 'owner');

create policy "business_members_update_admin" on public.business_members
for update using (public.is_business_admin(business_id))
with check (role <> 'owner');

create policy "business_members_delete_admin" on public.business_members
for delete using (public.is_business_admin(business_id) and role <> 'owner');

alter table public.locations enable row level security;

create policy "locations_select_member" on public.locations
for select using (public.is_business_member(business_id));

create policy "locations_insert_admin" on public.locations
for insert with check (public.is_business_admin(business_id));

create policy "locations_update_admin" on public.locations
for update using (public.is_business_admin(business_id));

create policy "locations_delete_admin" on public.locations
for delete using (public.is_business_admin(business_id));

-- subscriptions/trials: read-only for business admins, no client writes
-- (created via register_business RPC, updated later only via Stripe
-- webhooks running with the service role).
create policy "subscriptions_select_admin" on public.subscriptions
for select using (public.is_business_admin(business_id));

create policy "trials_select_admin" on public.trials
for select using (public.is_business_admin(business_id));
