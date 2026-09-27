/**
 * Apply doctor_profile multi-row data and upload Dr. Bishnu's portrait.
 *
 * Usage (from repo root):
 *   node --env-file=.env scripts/seed-doctor-profiles.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFile } from 'node:fs/promises';
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

const STORAGE_PATH = `doctor/dr-bishnu-prasad-adhikari.jpg`;
const LOCAL_PORTRAIT = path.join(
  root,
  'public',
  'images',
  'doctor',
  'dr-bishnu-prasad-adhikari.jpg',
);

const BISHNU = {
  id: 2,
  name: 'Dr. Bishnu Prasad Adhikari',
  title: 'Consultant Dermatologist & Lecturer',
  title_short: 'Consultant Dermatologist · MD',
  bio: [
    'Dr. Bishnu Prasad Adhikari is a Consultant Dermatologist at Pokhara Skin and Hair Clinic, where he provides specialist care for a wide range of skin, hair, and related conditions. He is registered with the Nepal Medical Council (NMC Reg. No. 19353).',
    'He holds an MBBS from Ryazan State I.P. Medical University and an MD in Dermatology from Manipal College of Medical Sciences (MCOMS), Kathmandu University. He is a Lecturer in the Department of Dermatology at MCOMS, Pokhara, and has published case reports in the Nepal Journal of Dermatology, Venereology & Leprology, including work on rare presentations such as Lues Maligna and acquired epidermodysplasia verruciformis.',
  ],
  credentials: [
    { label: 'NMC Registration', value: 'NMC Reg. No. 19353' },
    {
      label: 'MD, Dermatology',
      value: 'Manipal College of Medical Sciences (MCOMS), Kathmandu University',
    },
    { label: 'MBBS', value: 'Ryazan State I.P. Medical University, Ryazan' },
    { label: 'Lecturer', value: 'Department of Dermatology, MCOMS, Pokhara' },
    {
      label: 'Focus Areas',
      value: 'Skin diseases, venereal diseases, and related medical dermatology',
    },
  ],
  sort_order: 2,
  is_published: true,
  pull_quote:
    'I start with a clear diagnosis — then treat skin and related conditions with what is medically indicated, not what is fashionable.',
};

async function uploadPortrait() {
  const body = await readFile(LOCAL_PORTRAIT);
  const { error } = await supabase.storage.from('clinic-media').upload(STORAGE_PATH, body, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) {
    throw new Error(`Portrait upload failed: ${error.message}`);
  }
  const publicUrl = `${url}/storage/v1/object/public/clinic-media/${STORAGE_PATH}`;
  console.log('uploaded', STORAGE_PATH);
  return publicUrl;
}

async function applySql(sql) {
  const endpoints = [
    `${url}/pg/query`,
    `${url}/pg-meta/default/query`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      });
      const text = await res.text();
      console.log('sql endpoint', endpoint, res.status, text.slice(0, 300));
      if (res.ok) return true;
    } catch (err) {
      console.log('sql endpoint failed', endpoint, err instanceof Error ? err.message : err);
    }
  }
  return false;
}

const migrationSql = await readFile(
  path.join(root, 'supabase', 'migrations', '20260927075741_doctor_profile_multi.sql'),
  'utf8',
);

const sqlApplied = await applySql(migrationSql);
if (!sqlApplied) {
  console.log('Direct SQL endpoints unavailable; continuing with table writes.');
}

const portraitUrl = await uploadPortrait();

const { error: prakashError } = await supabase
  .from('doctor_profile')
  .update({
    sort_order: 1,
    is_published: true,
    pull_quote:
      'Every plan starts with evidence — I recommend only what is medically appropriate for your skin, not what is fashionable.',
    updated_at: new Date().toISOString(),
  })
  .eq('id', 1);

if (prakashError) {
  console.error('Prakash update failed:', prakashError.message);
} else {
  console.log('updated Prakash row');
}

const payload = {
  ...BISHNU,
  portrait_url: portraitUrl,
  updated_at: new Date().toISOString(),
};

const { error: upsertError } = await supabase
  .from('doctor_profile')
  .upsert(payload, { onConflict: 'id' });

if (upsertError) {
  console.error('Bishnu upsert failed:', upsertError.message);
  console.error('Apply supabase/migrations/20260927075741_doctor_profile_multi.sql in the SQL Editor, then re-run this script.');
} else {
  console.log('upserted Bishnu row');
}

const { data, error: listError } = await supabase
  .from('doctor_profile')
  .select('id, name, sort_order, is_published, portrait_url')
  .order('id');

if (listError) {
  console.error('list failed:', listError.message);
} else {
  console.log(JSON.stringify(data, null, 2));
}
