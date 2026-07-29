import type { PostgrestError } from '@supabase/supabase-js';

export type MutationResult = { ok: true } | { ok: false; message: string };

/** Normalize a Supabase mutation/query error into a success/failure result. */
export function mutationResult(error: PostgrestError | null | undefined): MutationResult {
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export function errorMessage(
  error: { message?: string } | null | undefined,
  fallback = 'Something went wrong',
): string {
  const msg = error?.message?.trim();
  return msg || fallback;
}
