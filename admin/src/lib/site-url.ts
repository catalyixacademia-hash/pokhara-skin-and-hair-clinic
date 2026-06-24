/** Public marketing site URL — used on the admin login page "back to site" link. */
export const siteUrl =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') ||
  'https://pokhara-skin-and-hair-clinic.vercel.app';
