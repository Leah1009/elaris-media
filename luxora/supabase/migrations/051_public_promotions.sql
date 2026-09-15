-- Mirrors services_select_public: lets a business's public landing page
-- show its currently-valid, still-available promotions, without exposing
-- ones that are inactive, outside their date window, or already used up.

create policy "promotions_select_public" on public.promotions
for select
to anon, authenticated
using (
  active
  and is_business_bookable(business_id)
  and (valid_from is null or valid_from <= now())
  and (valid_to is null or valid_to >= now())
  and (max_uses is null or uses_count < max_uses)
);
