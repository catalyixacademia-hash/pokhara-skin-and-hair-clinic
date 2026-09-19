/**
 * Upload curated before/after results to Supabase Storage and update results rows.
 * Usage: node --env-file=.env scripts/sync-results-images-to-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const url = process.env.VITE_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function publicUrl(storagePath) {
  return `${url}/storage/v1/object/public/clinic-media/${storagePath}`;
}

const UPDATES = [
  {
    matchLabel: 'Acne Treatment',
    label: 'Acne & pigmentation care',
    before: 'results/acne-before.webp',
    after: 'results/acne-after.webp',
    category: 'skin',
    sort_order: 1,
    is_published: true,
  },
  {
    matchLabel: 'Pigmentation Correction',
    label: 'Pigmentation & peel refinement',
    before: 'results/peel-before.webp',
    after: 'results/peel-after.webp',
    category: 'skin',
    sort_order: 2,
    is_published: true,
  },
  {
    matchLabel: 'Hair Density Restoration',
    label: 'Hair restoration',
    before: 'results/hair-before.webp',
    after: 'results/hair-after.webp',
    category: 'hair',
    sort_order: 3,
    is_published: true,
  },
];

async function uploadResults() {
  const dir = path.join(root, 'public', 'images', 'results');
  const files = await readdir(dir);
  for (const name of files) {
    if (!/\.(webp|jpg|jpeg|png)$/i.test(name)) continue;
    const local = path.join(dir, name);
    const body = await readFile(local);
    const contentType = name.endsWith('.webp')
      ? 'image/webp'
      : name.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
    const storagePath = `results/${name}`;
    const { error } = await supabase.storage.from('clinic-media').upload(storagePath, body, {
      contentType,
      upsert: true,
    });
    if (error) console.error('upload failed', storagePath, error.message);
    else console.log('uploaded', storagePath);
  }
}

async function patchResults() {
  for (const row of UPDATES) {
    const payload = {
      label: row.label,
      before_url: publicUrl(row.before),
      after_url: publicUrl(row.after),
      category: row.category,
      sort_order: row.sort_order,
      is_published: row.is_published,
      duration: 'Clinical photography · individual results vary',
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('results').update(payload).eq('label', row.matchLabel);
    if (error) console.error('update failed', row.matchLabel, error.message);
    else console.log('updated', row.matchLabel, '→', row.label);
  }

  // Drop leftover stock seed that has no curated pair.
  const { error: unpublishError } = await supabase
    .from('results')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('label', 'Skin Rejuvenation');
  if (unpublishError) console.error('unpublish failed', unpublishError.message);
  else console.log('unpublished Skin Rejuvenation (stock)');

  const { error: clearError } = await supabase
    .from('results')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .or('before_url.ilike.%pexels.com%,after_url.ilike.%pexels.com%');
  if (clearError) console.error('clear pexels failed', clearError.message);
  else console.log('unpublished any remaining Pexels results');
}

await uploadResults();
await patchResults();
console.log('done');
