-- Optional CMS override for the public Exosomes spotlight poster.
alter table clinic_settings
  add column if not exists exosomes_promo_url text;

comment on column clinic_settings.exosomes_promo_url is
  'Public Exosomes spotlight poster URL; null/empty uses local curated asset';
