-- Extend clinic_settings for public contact channels editable in admin
alter table clinic_settings
  add column if not exists whatsapp_float_number text,
  add column if not exists maps_reviews_url text,
  add column if not exists social_instagram_url text,
  add column if not exists social_facebook_url text,
  add column if not exists social_tiktok_url text,
  add column if not exists whatsapp_main_url text;

comment on column clinic_settings.whatsapp_float_number is 'Digits for floating WhatsApp / form handoff (e.g. 984515246)';
comment on column clinic_settings.maps_reviews_url is 'Google Business reviews / Knowledge Panel URL';

-- Allow authenticated staff to create walk-in / phone bookings
drop policy if exists "admin_insert_appointments" on appointments;
create policy "admin_insert_appointments" on appointments
  for insert
  with check (auth.role() = 'authenticated');
