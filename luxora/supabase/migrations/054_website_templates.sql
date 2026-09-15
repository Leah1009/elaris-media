-- Website template selection + a generic image-slot system so each of the
-- 3 Luxore templates can define its own named image slots (hero, about,
-- gallery_1, ...) without needing a new column per slot per template.
alter table public.businesses
  add column website_template text not null default 'minimal_luxury'
  check (website_template in ('minimal_luxury', 'modern_dark', 'soft_beauty'));

create table public.website_image_slots (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template text not null check (template in ('minimal_luxury', 'modern_dark', 'soft_beauty')),
  slot_key text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, template, slot_key)
);

create trigger website_image_slots_set_updated_at
before update on public.website_image_slots
for each row execute function public.set_updated_at();

create index website_image_slots_business_idx on public.website_image_slots(business_id, template);

alter table public.website_image_slots enable row level security;

create policy "website_image_slots_select_member" on public.website_image_slots
for select to authenticated
using (public.is_business_member(business_id));

create policy "website_image_slots_write_admin" on public.website_image_slots
for all to authenticated
using (public.is_business_admin(business_id))
with check (public.is_business_admin(business_id));

-- Mirrors promotions_select_public / services_select_public — only the
-- business's own live public page needs to read these, and only ever the
-- image_url for its currently-selected template.
create policy "website_image_slots_select_public" on public.website_image_slots
for select to anon, authenticated
using (public.is_business_bookable(business_id));
