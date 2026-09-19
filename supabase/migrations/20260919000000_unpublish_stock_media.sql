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
