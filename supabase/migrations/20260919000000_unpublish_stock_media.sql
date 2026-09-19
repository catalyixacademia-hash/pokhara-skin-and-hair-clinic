-- Unpublish illustrative Pexels seed rows so the public site shows
-- curated clinic photography from the repo (results + gallery fallbacks).
update public.results
set is_published = false,
    updated_at = now()
where before_url ilike '%pexels.com%'
   or after_url ilike '%pexels.com%';

update public.gallery_items
set is_published = false,
    updated_at = now()
where image_url ilike '%pexels.com%';

-- Point published services that still use Pexels at empty image_url so the
-- public site falls back to curated local assets in src/data/services.ts.
update public.services
set image_url = null,
    updated_at = now()
where image_url ilike '%pexels.com%';
