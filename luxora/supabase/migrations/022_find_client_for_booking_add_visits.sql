-- Adds total_visits to the match so the public booking wizard can decide
-- whether a "first visit only" form applies to a returning client without
-- a second privileged lookup. Requires dropping first since PL/pgSQL
-- can't ALTER the OUT-parameter row type of an existing function.
drop function public.find_client_for_booking(uuid, text, text);

create function public.find_client_for_booking(
  p_business_id uuid,
  p_phone text,
  p_email text
)
returns table (id uuid, display_name text, total_visits integer)
language sql
security definer
stable
set search_path = public
as $$
  select
    c.id,
    case
      when position(' ' in c.full_name) > 0 then
        split_part(c.full_name, ' ', 1) || ' ' || left(split_part(c.full_name, ' ', 2), 1) || '.'
      else c.full_name
    end as display_name,
    c.total_visits
  from public.clients c
  where c.business_id = p_business_id
    and (
      (p_phone is not null and public.normalize_phone(c.phone) = public.normalize_phone(p_phone))
      or (p_email is not null and public.normalize_email(c.email) = public.normalize_email(p_email))
    )
  limit 1;
$$;

revoke execute on function public.find_client_for_booking(uuid, text, text) from public;
grant execute on function public.find_client_for_booking(uuid, text, text) to anon, authenticated;
