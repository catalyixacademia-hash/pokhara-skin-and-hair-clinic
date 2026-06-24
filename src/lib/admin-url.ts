/** Canonical public site URL (no trailing slash). */
export const siteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://pokhara-skin-and-hair-clinic.vercel.app';

/** Admin login on the same domain under /admin. */
export const adminLoginUrl =
  (import.meta.env.VITE_ADMIN_URL as string | undefined)?.replace(/\/$/, '') ||
  `${siteUrl}/admin/login`;
