/**
 * One-off: upload clinic gallery photos to Storage and upsert gallery_items.
 * Uses VITE_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env (never logged).
 *
 * Run: node scripts/seed-clinic-gallery.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function loadEnv(filePath) {
  if (!existsSync(filePath)) return {};
  const out = {};
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = { ...loadEnv(resolve(root, '.env')), ...loadEnv(resolve(root, 'admin/.env')) };
const url = env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEEDS = [
  {
    file: 'public/images/clinic/interior-waiting.webp',
    storagePath: 'gallery/interior-waiting.webp',
    label: 'Reception & waiting',
    tag: 'Clinic',
    is_tall: false,
    sort_order: 1,
  },
  {
    file: 'public/images/clinic/welcome-board.webp',
    storagePath: 'gallery/welcome-board.webp',
    label: 'Welcome — coffee & cookies corner',
    tag: 'Visit',
    is_tall: true,
    sort_order: 2,
  },
];

async function main() {
  for (const seed of SEEDS) {
    const abs = resolve(root, seed.file);
    if (!existsSync(abs)) {
      console.error('Missing file', seed.file);
      process.exit(1);
    }
    const body = readFileSync(abs);
    const { error: uploadError } = await supabase.storage
      .from('clinic-media')
      .upload(seed.storagePath, body, {
        contentType: 'image/webp',
        upsert: true,
      });
    if (uploadError) {
      console.error('Upload failed', seed.storagePath, uploadError.message);
      process.exit(1);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('clinic-media').getPublicUrl(seed.storagePath);

    const { data: existing, error: findError } = await supabase
      .from('gallery_items')
      .select('id')
      .eq('label', seed.label)
      .maybeSingle();
    if (findError) {
      console.error('Lookup failed', seed.label, findError.message);
      process.exit(1);
    }

    const payload = {
      image_url: publicUrl,
      label: seed.label,
      tag: seed.tag,
      is_tall: seed.is_tall,
      sort_order: seed.sort_order,
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabase.from('gallery_items').update(payload).eq('id', existing.id);
      if (error) {
        console.error('Update failed', seed.label, error.message);
        process.exit(1);
      }
      console.log('Updated', seed.label);
    } else {
      const { error } = await supabase.from('gallery_items').insert(payload);
      if (error) {
        console.error('Insert failed', seed.label, error.message);
        process.exit(1);
      }
      console.log('Inserted', seed.label);
    }
  }

  // Keep stock Pexels rows unpublished so they do not replace clinic photos.
  const { error: unpublishError } = await supabase
    .from('gallery_items')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .ilike('image_url', '%pexels.com%');
  if (unpublishError) {
    console.error('Unpublish stock failed', unpublishError.message);
    process.exit(1);
  }

  const { data: published, error: listError } = await supabase
    .from('gallery_items')
    .select('label, tag, sort_order, is_published')
    .eq('is_published', true)
    .order('sort_order');
  if (listError) {
    console.error(listError.message);
    process.exit(1);
  }
  console.log('Published gallery items:', published?.length ?? 0);
  for (const row of published ?? []) {
    console.log(`  ${row.sort_order}. ${row.label} [${row.tag ?? ''}]`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
