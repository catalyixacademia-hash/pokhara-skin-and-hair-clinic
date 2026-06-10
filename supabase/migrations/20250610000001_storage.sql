-- Storage bucket for clinic media
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'clinic-media',
  'clinic-media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Public read for clinic-media
create policy "public_read_clinic_media"
on storage.objects for select
using (bucket_id = 'clinic-media');

-- Authenticated upload/update/delete
create policy "admin_upload_clinic_media"
on storage.objects for insert
with check (bucket_id = 'clinic-media' and auth.role() = 'authenticated');

create policy "admin_update_clinic_media"
on storage.objects for update
using (bucket_id = 'clinic-media' and auth.role() = 'authenticated');

create policy "admin_delete_clinic_media"
on storage.objects for delete
using (bucket_id = 'clinic-media' and auth.role() = 'authenticated');
