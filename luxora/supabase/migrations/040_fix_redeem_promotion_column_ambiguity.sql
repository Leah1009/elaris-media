-- Bug fix found during Phase 6 RLS/isolation testing: redeem_promotion's
-- RETURNS TABLE (id, discount_type, discount_value) clause implicitly
-- declares "id" as a PL/pgSQL OUT variable, which collided with
-- promotions.id in "update ... where id = v_promo.id" — every call
-- errored with "column reference id is ambiguous" instead of ever
-- incrementing uses_count. Qualifying the column reference fixes it.
create or replace function public.redeem_promotion(
  p_business_id uuid,
  p_code text,
  p_client_id uuid default null
)
returns table (id uuid, discount_type text, discount_value numeric)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_promo public.promotions;
  v_client_uses integer;
begin
  if not public.is_business_member(p_business_id) then
    raise exception 'Not authorized.';
  end if;

  select * into v_promo from public.promotions
  where business_id = p_business_id and upper(code) = upper(trim(p_code))
  for update;

  if v_promo.id is null or not v_promo.active then
    raise exception 'Promo code not found or inactive.';
  end if;
  if v_promo.valid_from is not null and now() < v_promo.valid_from then
    raise exception 'Promo code is not yet active.';
  end if;
  if v_promo.valid_to is not null and now() > v_promo.valid_to then
    raise exception 'Promo code has expired.';
  end if;
  if v_promo.max_uses is not null and v_promo.uses_count >= v_promo.max_uses then
    raise exception 'Promo code has reached its usage limit.';
  end if;
  if v_promo.per_client_limit is not null and p_client_id is not null then
    select count(*) into v_client_uses from public.promotion_redemptions
    where promotion_id = v_promo.id and client_id = p_client_id;
    if v_client_uses >= v_promo.per_client_limit then
      raise exception 'This client has already used this promo code.';
    end if;
  end if;

  update public.promotions set uses_count = promotions.uses_count + 1 where promotions.id = v_promo.id;

  return query select v_promo.id, v_promo.discount_type, v_promo.discount_value;
end;
$$;
