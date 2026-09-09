-- Postgres evaluates every applicable RLS policy for the querying role,
-- even ones that would ultimately return false — and if evaluating one
-- calls a function that role has no EXECUTE grant on, the whole query
-- errors out instead of just skipping that policy. Discovered when anon
-- tried to read `businesses` and hit "permission denied for function
-- is_business_member" even though the *_select_public policy alone would
-- have allowed it. Fix: scope every existing member/admin/own policy to
-- `authenticated` so Postgres never evaluates it for anon at all.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname not like '%\_select\_public'
      and policyname not in ('plans_select_active', 'plan_entitlements_select_all')
  loop
    execute format('alter policy %I on %I.%I to authenticated', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

-- The new public-booking policies are for anon (and authenticated, so a
-- logged-in user can still view a public booking page) specifically.
do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and policyname like '%\_select\_public'
  loop
    execute format('alter policy %I on %I.%I to anon, authenticated', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;
