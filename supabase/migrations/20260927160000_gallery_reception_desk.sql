-- Add the reception desk photo to Inside the clinic.

insert into public.gallery_items (image_url, label, tag, is_tall, sort_order, is_published)
select
  'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/reception-desk.webp',
  'Reception desk',
  'Clinic',
  true,
  3,
  true
where not exists (
  select 1 from public.gallery_items g where g.label = 'Reception desk'
);

update public.gallery_items
set
  image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/reception-desk.webp',
  tag = 'Clinic',
  is_tall = true,
  sort_order = 3,
  is_published = true,
  updated_at = now()
where label = 'Reception desk';
