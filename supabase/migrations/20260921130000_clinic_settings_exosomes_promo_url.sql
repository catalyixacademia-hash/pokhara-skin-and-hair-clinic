-- OPTIONAL: dedicated column for Exosomes promo URL.
-- Not required for the live site — Media hub stores the URL in
-- clinic_settings.address->>'exosomesPromoUrl' until this runs on the
-- clinic project (ref: hgreobmkdckjecvgiver).
--
-- Run ONLY in that project's SQL editor. Cursor / other linked Supabase
-- projects do not have clinic_settings and will error with 42P01.

alter table clinic_settings
  add column if not exists exosomes_promo_url text;

comment on column clinic_settings.exosomes_promo_url is
  'Public Exosomes spotlight poster URL; null/empty uses local curated asset';

-- Copy any sideloaded URL from address JSON into the new column.
update clinic_settings
set exosomes_promo_url = nullif(address->>'exosomesPromoUrl', '')
where id = 1
  and (exosomes_promo_url is null or exosomes_promo_url = '')
  and coalesce(address->>'exosomesPromoUrl', '') <> '';
