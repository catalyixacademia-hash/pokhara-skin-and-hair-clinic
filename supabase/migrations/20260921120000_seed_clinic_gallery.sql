-- Seed curated clinic gallery photos into gallery_items (idempotent by label).
-- Images live in Storage: clinic-media/gallery/*

update public.gallery_items
set is_published = false,
    updated_at = now()
where image_url ilike '%pexels.com%';

insert into public.gallery_items (image_url, label, tag, is_tall, sort_order, is_published)
select
  v.image_url,
  v.label,
  v.tag,
  v.is_tall,
  v.sort_order,
  true
from (
  values
    (
      'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/interior-waiting.webp',
      'Reception & waiting',
      'Clinic',
      false,
      1
    ),
    (
      'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/welcome-board.webp',
      'Welcome — coffee & cookies corner',
      'Visit',
      true,
      2
    )
) as v(image_url, label, tag, is_tall, sort_order)
where not exists (
  select 1 from public.gallery_items g where g.label = v.label
);

update public.gallery_items g
set
  image_url = v.image_url,
  tag = v.tag,
  is_tall = v.is_tall,
  sort_order = v.sort_order,
  is_published = true,
  updated_at = now()
from (
  values
    (
      'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/interior-waiting.webp',
      'Reception & waiting',
      'Clinic',
      false,
      1
    ),
    (
      'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/gallery/welcome-board.webp',
      'Welcome — coffee & cookies corner',
      'Visit',
      true,
      2
    )
) as v(image_url, label, tag, is_tall, sort_order)
where g.label = v.label;
