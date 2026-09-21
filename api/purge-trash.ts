import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const RETENTION_DAYS = 30;

function getAdmin() {
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function assertStaff(req: VercelRequest): Promise<boolean> {
  const auth = req.headers.authorization ?? '';
  if (!auth.startsWith('Bearer ')) return false;
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return false;
  const client = createClient(url, anon, {
    global: { headers: { Authorization: auth } },
  });
  const { data, error } = await client.auth.getUser();
  return Boolean(data.user) && !error;
}

/**
 * Cron (GET) or staff (POST): purge expired trash, or permanently delete one trash row.
 * Cron: Authorization Bearer CRON_SECRET (optional if unset in preview).
 * Staff POST: Authorization Bearer <supabase access token>.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = getAdmin();
  if (!admin) {
    return res.status(500).json({ ok: false, error: 'Missing Supabase env' });
  }

  if (req.method === 'GET') {
    const cronSecret = process.env.CRON_SECRET;
    const auth = req.headers.authorization ?? '';
    if (cronSecret && auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }
    return purgeExpired(admin, res);
  }

  if (req.method === 'POST') {
    const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as {
      action?: string;
      id?: string;
    };
    const action = body.action ?? 'purge_expired';

    if (!(await assertStaff(req))) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    if (action === 'delete_forever') {
      const id = typeof body.id === 'string' ? body.id.trim() : '';
      if (!id) return res.status(400).json({ ok: false, error: 'id is required' });

      const { data: row, error: readError } = await admin
        .from('appointments')
        .select('id, deleted_at')
        .eq('id', id)
        .maybeSingle();
      if (readError) return res.status(500).json({ ok: false, error: readError.message });
      if (!row) return res.status(404).json({ ok: false, error: 'Not found' });
      if (!row.deleted_at) {
        return res.status(400).json({ ok: false, error: 'Only trash items can be permanently deleted' });
      }

      const { error: deleteError } = await admin.from('appointments').delete().eq('id', id);
      if (deleteError) return res.status(500).json({ ok: false, error: deleteError.message });
      return res.status(200).json({ ok: true, deleted: 1 });
    }

    return purgeExpired(admin, res);
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}

async function purgeExpired(
  admin: ReturnType<typeof createClient>,
  res: VercelResponse,
) {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);

  const { data: expired, error: listError } = await admin
    .from('appointments')
    .select('id')
    .not('deleted_at', 'is', null)
    .lt('deleted_at', cutoff.toISOString());

  if (listError) {
    return res.status(500).json({ ok: false, error: listError.message });
  }

  const ids = (expired ?? []).map((r) => r.id as string);
  if (ids.length === 0) {
    return res.status(200).json({ ok: true, deleted: 0, retentionDays: RETENTION_DAYS });
  }

  const { error: deleteError } = await admin.from('appointments').delete().in('id', ids);
  if (deleteError) {
    return res.status(500).json({ ok: false, error: deleteError.message });
  }

  return res.status(200).json({
    ok: true,
    deleted: ids.length,
    retentionDays: RETENTION_DAYS,
  });
}
