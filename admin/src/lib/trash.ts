import { supabase } from '@/lib/supabase';

const RETENTION_DAYS = 30;

type PurgeResult = { deleted: number; via: string };

async function invokeApiPurge(body: Record<string, unknown>): Promise<PurgeResult | null> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return null;

    const res = await fetch('/api/purge-trash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { ok?: boolean; deleted?: number };
    if (!json.ok) return null;
    return { deleted: typeof json.deleted === 'number' ? json.deleted : 0, via: 'api' };
  } catch {
    return null;
  }
}

/** Permanently remove trash older than 30 days. Tries RPC → Vercel API → edge function. */
export async function runExpiredPurge(): Promise<PurgeResult | null> {
  const rpc = await supabase.rpc('purge_expired_appointment_trash');
  if (!rpc.error && typeof rpc.data === 'number') {
    return { deleted: rpc.data, via: 'rpc' };
  }

  const api = await invokeApiPurge({ action: 'purge_expired' });
  if (api) return api;

  const { data, error } = await supabase.functions.invoke('purge-appointment-trash', {
    body: { action: 'purge_expired' },
  });
  if (error) return null;
  const deleted = typeof data?.deleted === 'number' ? data.deleted : 0;
  return { deleted, via: 'edge' };
}

/** Hard-delete one trash row. Tries RLS delete → Vercel API → edge function. */
export async function deleteTrashItemForever(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const { error: deleteError } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .not('deleted_at', 'is', null);

  if (!deleteError) return { ok: true };

  const api = await invokeApiPurge({ action: 'delete_forever', id });
  if (api) return { ok: true };

  const { data, error: fnError } = await supabase.functions.invoke('purge-appointment-trash', {
    body: { action: 'delete_forever', id },
  });
  if (fnError || data?.ok === false) {
    return {
      ok: false,
      error: fnError?.message ?? (data?.error as string | undefined) ?? deleteError.message,
    };
  }
  return { ok: true };
}

export { RETENTION_DAYS };
