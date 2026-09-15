-- First real file-upload surface in the app (everything before this was
-- "paste a URL you hosted elsewhere"). Public bucket since these images
-- (promotions, marketing templates) need to render on the anon-visible
-- public landing page; writes are scoped per business via the folder
-- prefix convention {business_id}/filename, checked against membership
-- with the existing is_business_member() helper.

insert into storage.buckets (id, name, public) values ('business-media', 'business-media', true);

create policy "business_media_select_public" on storage.objects
for select
to anon, authenticated
using (bucket_id = 'business-media');

create policy "business_media_insert_member" on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'business-media'
  and is_business_member((storage.foldername(name))[1]::uuid)
);

create policy "business_media_update_member" on storage.objects
for update
to authenticated
using (
  bucket_id = 'business-media'
  and is_business_member((storage.foldername(name))[1]::uuid)
);

create policy "business_media_delete_member" on storage.objects
for delete
to authenticated
using (
  bucket_id = 'business-media'
  and is_business_member((storage.foldername(name))[1]::uuid)
);

alter table public.promotions add column image_url text;
alter table public.message_templates add column image_url text;
