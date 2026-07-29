# Admin portal

Staff SPA for Pokhara Skin & Hair Clinic (Vite + React, port **5174** in local dev).

## Access control

- Login uses Supabase Auth (`signInWithPassword`).
- `ProtectedRoute` requires an active session.
- Optional allowlist: set `VITE_ADMIN_EMAILS` to a comma-separated list of staff emails. When set, users who authenticate but are not listed are signed out immediately. When unset, behavior is unchanged (any authenticated Auth user can use admin).
- Do not leave the allowlist empty-string-only if you intend unrestricted access — omit the variable entirely.

## Patient submissions

- Patient-entered fields are read-only in the UI.
- After applying migration `20260729000000_appointments_soft_delete_and_immutability.sql`, the database also blocks updates to patient fields; staff may only change `status`, `internal_notes`, and soft-delete via `deleted_at`.
- Hard delete is not available to authenticated staff; use Remove (soft-delete) in the inbox.

## Deploy checklist

1. Apply the latest Supabase migrations (especially the appointments soft-delete / immutability migration) to the remote project before relying on soft-delete or field protection in production.
2. Ensure public booking still works via the `send-appointment-emails` edge function (service role insert).
3. Optionally set `VITE_ADMIN_EMAILS` in Vercel for the admin build if you want email allowlisting.
