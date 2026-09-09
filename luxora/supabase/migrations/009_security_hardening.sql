-- Fixes flagged by `supabase get_advisors` after 001-008:
--  1. set_updated_at() had a mutable search_path.
--  2. handle_new_user() / prevent_admin_self_promotion() are trigger-only
--     internals and should not be callable directly via PostgREST RPC.
--  3. is_business_member/is_business_admin/register_business were callable
--     by the `anon` role (default PUBLIC execute grant) — they must require
--     a real signed-in session.
alter function public.set_updated_at() set search_path = '';

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.prevent_admin_self_promotion() from public, anon, authenticated;

revoke execute on function public.is_business_member(uuid) from public, anon;
grant execute on function public.is_business_member(uuid) to authenticated;

revoke execute on function public.is_business_admin(uuid) from public, anon;
grant execute on function public.is_business_admin(uuid) to authenticated;

revoke execute on function public.register_business(
  text, text, text, text, text, text, text, text, text, text, text, text, integer
) from public, anon;
grant execute on function public.register_business(
  text, text, text, text, text, text, text, text, text, text, text, text, integer
) to authenticated;
