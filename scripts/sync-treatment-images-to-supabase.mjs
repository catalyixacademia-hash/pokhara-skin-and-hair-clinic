/**
 * Upload curated treatment images to Supabase Storage (clinic-media)
 * and patch public.services.image_url to the public object URLs.
 *
 * Usage (from repo root, with .env loaded):
 *   node --env-file=.env scripts/sync-treatment-images-to-supabase.mjs
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

const TITLE_TO_RELATIVE = {
  'Exosome Skin Rejuvenation': 'treatments/skin/exosome-skin.webp',
  'Acne & Pigmentation': 'treatments/skin/acne-pigmentation.webp',
  'Chemical Peels': 'treatments/skin/chemical-peels.webp',
  'Skin Analyzer & Skin Tests': 'treatments/skin/skin-analyzer.webp',
  Microneedling: 'treatments/skin/microneedling.webp',
  'Laser Procedures': 'treatments/skin/laser-procedures.webp',
  'HydraFacial & Rejuvenation': 'treatments/skin/hydrafacial.webp',
  'PRP Therapy': 'treatments/hair/prp-therapy.webp',
  'GFC Therapy': 'treatments/hair/gfc-therapy.webp',
  'Exosome Therapy': 'treatments/hair/exosome-therapy.webp',
  'Hair Fall Consultation': 'treatments/hair/hair-consultation.webp',
  'Hair Density Restoration': 'treatments/hair/hair-density.webp',
  Botox: 'treatments/aesthetic/botox.webp',
  'Dermal Fillers': 'treatments/aesthetic/dermal-fillers.webp',
  'Anti-Aging Procedures': 'treatments/aesthetic/anti-aging.webp',
  'Laser Hair Reduction': 'treatments/aesthetic/laser-hair-reduction.webp',
  'Personalized Cosmetology': 'treatments/aesthetic/cosmetology.webp',
};

async function listLocalFiles() {
  const base = path.join(root, 'public', 'images', 'treatments');
  const out = [];
  for (const folder of ['skin', 'hair', 'aesthetic']) {
    const dir = path.join(base, folder);
    const files = await readdir(dir);
    for (const name of files) {
      if (!/\.(webp|jpg|jpeg|png)$/i.test(name)) continue;
      out.push({
        local: path.join(dir, name),
        storagePath: `treatments/${folder}/${name}`,
      });
    }
  }
  return out;
}

async function uploadAll() {
  const files = await listLocalFiles();
  for (const file of files) {
    const body = await readFile(file.local);
    const contentType = file.local.endsWith('.webp')
      ? 'image/webp'
      : file.local.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';
    const { error } = await supabase.storage.from('clinic-media').upload(file.storagePath, body, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error('upload failed', file.storagePath, error.message);
    } else {
      console.log('uploaded', file.storagePath);
    }
  }
}

function publicUrl(storagePath) {
  return `${url}/storage/v1/object/public/clinic-media/${storagePath}`;
}

async function patchServices() {
  for (const [title, relative] of Object.entries(TITLE_TO_RELATIVE)) {
    const imageUrl = publicUrl(relative);
    const { error, count } = await supabase
      .from('services')
      .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq('title', title);
    if (error) {
      console.error('update failed', title, error.message);
    } else {
      console.log('updated', title, '→', imageUrl, count ?? '');
    }
  }
}

await uploadAll();
await patchServices();
console.log('done');
