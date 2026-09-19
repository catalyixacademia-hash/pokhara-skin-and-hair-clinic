-- Point CMS service rows at curated treatment photography in Storage (clinic-media).
-- Paths match public/images/treatments/{skin,hair,aesthetic} uploaded via
-- scripts/sync-treatment-images-to-supabase.mjs

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/exosome-skin.webp', updated_at = now()
where title = 'Exosome Skin Rejuvenation';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/acne-pigmentation.webp', updated_at = now()
where title = 'Acne & Pigmentation';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/chemical-peels.webp', updated_at = now()
where title = 'Chemical Peels';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/skin-analyzer.webp', updated_at = now()
where title = 'Skin Analyzer & Skin Tests';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/microneedling.webp', updated_at = now()
where title = 'Microneedling';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/laser-procedures.webp', updated_at = now()
where title = 'Laser Procedures';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/skin/hydrafacial.webp', updated_at = now()
where title = 'HydraFacial & Rejuvenation';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/hair/prp-therapy.webp', updated_at = now()
where title = 'PRP Therapy';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/hair/gfc-therapy.webp', updated_at = now()
where title = 'GFC Therapy';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/hair/exosome-therapy.webp', updated_at = now()
where title = 'Exosome Therapy';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/hair/hair-consultation.webp', updated_at = now()
where title = 'Hair Fall Consultation';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/hair/hair-density.webp', updated_at = now()
where title = 'Hair Density Restoration';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/aesthetic/botox.webp', updated_at = now()
where title = 'Botox';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/aesthetic/dermal-fillers.webp', updated_at = now()
where title = 'Dermal Fillers';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/aesthetic/anti-aging.webp', updated_at = now()
where title = 'Anti-Aging Procedures';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/aesthetic/laser-hair-reduction.webp', updated_at = now()
where title = 'Laser Hair Reduction';

update public.services set image_url = 'https://hgreobmkdckjecvgiver.supabase.co/storage/v1/object/public/clinic-media/treatments/aesthetic/cosmetology.webp', updated_at = now()
where title = 'Personalized Cosmetology';

-- Clear leftover Pexels URLs on any other service rows.
update public.services
set image_url = null, updated_at = now()
where image_url ilike '%pexels.com%';
