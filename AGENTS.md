## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Avoid generic AI-slop aesthetics; favor distinctive high-contrast editorial design over beige template stacks.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Keep the navbar compact (~3.5rem / h-14) with only essential links (e.g. Treatments, About, Book visit); secondary sections stay in footer/in-page anchors.
- Navbar and hero text must stay readable on first load over the hero image (light tones, not dark gray).
- Hero background should stack below the fixed navbar (spacer + `.hero-viewport`), not overlap under the nav.
- Primary CTA (`.btn-primary`) hover should use solid ivory/parchment background with dark text, not transparent.
- Outline/secondary hero buttons should use a subtle backdrop blur or background (frosted glass).
- Section card CTAs must be real buttons with consistent alignment across cards, not plain text links.
- Harden the entire public site for mobile screens (touch targets, spacing, full-width CTAs where needed).
- Public Staff login links to the separate admin app (`admin/`, not routes in the public SPA); admin scope is appointment bookings CRUD only.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Clinical Editorial design tokens live in `src/index.css` (paper, ink, accent; Instrument Serif + DM Sans).
- Clinic business content is centralized in `src/data/clinic.ts` (phones, hours, social; floating WhatsApp uses `whatsappFloat` 984515246).
- Hero layout relies on `--nav-height`, fixed header, nav spacer div, and `.hero-viewport` / `.hero-section` in `src/index.css`.
- Public build uses `vite-plugin-singlefile`; admin is a separate Vite project in `admin/` (no singlefile, dev port 5174).
- Supabase backs appointment persistence, admin Auth, and Resend email edge functions with separate patient vs admin HTML templates.
- Admin app scope is simplified to appointment bookings CRUD only (`/bookings` routes), not the original full CMS plan.
- Public Staff login uses `src/lib/admin-url.ts` (`VITE_ADMIN_URL`, default `http://localhost:5174/login`).
- Production public site deploys to Vercel at pokhara-skin-and-hair-clinic.vercel.app; admin `site-url.ts` uses `VITE_SITE_URL` for back links.
