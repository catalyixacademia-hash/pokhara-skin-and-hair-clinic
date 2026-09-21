/**
 * Purge soft-deleted appointments older than 30 days, or permanently delete one trash row.
 * Requires Authorization: Bearer <user JWT> (authenticated staff).
 * Uses service role so hard DELETE works even before the matching RLS migration is applied.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RETENTION_DAYS = 30;

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

  if (!supabaseUrl || !anonKey || !serviceKey) {
    return json({ ok: false, error: 'Missing Supabase env' }, 500);
  }

  const authHeader = req.headers.get('Authorization') ?? '';
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();

  // Allow service-role cron (no user) via shared secret header, or authenticated staff.
  const cronSecret = Deno.env.get('TRASH_PURGE_SECRET') ?? '';
  const providedSecret = req.headers.get('x-trash-purge-secret') ?? '';
  const isCron =
    Boolean(cronSecret) && providedSecret.length > 0 && providedSecret === cronSecret;

  if ((!user || userError) && !isCron) {
    return json({ ok: false, error: 'Unauthorized' }, 401);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let body: { action?: string; id?: string } = {};
  if (req.method === 'POST') {
    try {
      body = (await req.json()) as { action?: string; id?: string };
    } catch {
      body = {};
    }
  }

  const action = body.action ?? 'purge_expired';

  if (action === 'delete_forever') {
    if (isCron) {
      return json({ ok: false, error: 'Cron may only purge expired items' }, 403);
    }
    const id = body.id?.trim();
    if (!id) return json({ ok: false, error: 'id is required' }, 400);

    const { data: row, error: readError } = await admin
      .from('appointments')
      .select('id, deleted_at')
      .eq('id', id)
      .maybeSingle();

    if (readError) return json({ ok: false, error: readError.message }, 500);
    if (!row) return json({ ok: false, error: 'Not found' }, 404);
    if (!row.deleted_at) {
      return json({ ok: false, error: 'Only trash items can be permanently deleted' }, 400);
    }

    const { error: deleteError } = await admin.from('appointments').delete().eq('id', id);
    if (deleteError) return json({ ok: false, error: deleteError.message }, 500);
    return json({ ok: true, deleted: 1 });
  }

  // Default: purge_expired
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RETENTION_DAYS);
  const cutoffIso = cutoff.toISOString();

  const { data: expired, error: listError } = await admin
    .from('appointments')
    .select('id')
    .not('deleted_at', 'is', null)
    .lt('deleted_at', cutoffIso);

  if (listError) return json({ ok: false, error: listError.message }, 500);

  const ids = (expired ?? []).map((r) => r.id as string);
  if (ids.length === 0) {
    return json({ ok: true, deleted: 0, retentionDays: RETENTION_DAYS });
  }

  const { error: deleteError } = await admin.from('appointments').delete().in('id', ids);
  if (deleteError) return json({ ok: false, error: deleteError.message }, 500);

  return json({ ok: true, deleted: ids.length, retentionDays: RETENTION_DAYS });
});
