## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Avoid generic AI-slop aesthetics; favor distinctive high-contrast editorial design over beige template stacks.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Navbar links: About, Treatments, Results, Doctor, Contact; Book visit stays a separate CTA; secondary items (Ask a question, Location) belong in mobile menu or footer, not crowded into desktop nav.
- Navbar and hero text must stay readable on first load over the hero image (light tones, not dark gray).
- Hero background should stack below the fixed navbar (spacer + `.hero-viewport`), not overlap under the nav.
- Primary CTA (`.btn-primary`) hover should use solid ivory/parchment background with dark text, not transparent.
- Outline/secondary hero buttons should use a subtle backdrop blur or background (frosted glass).
- Section card CTAs must be real buttons with consistent alignment across cards, not plain text links.
- Harden the entire public site for mobile screens (touch targets, spacing, full-width CTAs where needed).
- Public Staff login links to the separate admin app (production `/admin` on same domain, local dev port 5174); admin treats patient form data as read-only—staff may update status and internal notes only.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Clinical Editorial design tokens live in `src/index.css` (paper, ink, accent; Instrument Serif + DM Sans).
- Clinic business content is centralized in `src/data/clinic.ts` (phones, hours, social; floating WhatsApp uses `whatsappFloat` 984515246).
- Hero layout relies on `--nav-height`, fixed header, nav spacer div, and `.hero-viewport` / `.hero-section` in `src/index.css`.
- Public build uses `vite-plugin-singlefile`; admin is a separate Vite project in `admin/` (dev port 5174, no singlefile).
- Production deploys to Vercel via combined `vercel.json` build: public at site root, admin SPA at `/admin` on the same domain (`pokhara-skin-and-hair-clinic.vercel.app`).
- Supabase backs appointment persistence, admin Auth, and Resend email edge functions with separate patient vs admin HTML templates for bookings and enquiries.
- Admin routes: `/dashboard` overview, `/bookings` and `/enquiries` submission inboxes, `/analytics` dashboard; patient fields read-only, status/`internal_notes` editable.
- Public General Enquiry form lives at `#enquiry` (`GeneralEnquiry.tsx`); both forms persist to `appointments` with `form_type` (`booking` | `general_query`).
- Public Staff login uses `src/lib/admin-url.ts` (`VITE_ADMIN_URL`, production default `{VITE_SITE_URL}/admin/login`).
- About stats centered via `.about-stats`; booking form wrapped in `.booking-form-panel` bordered card (`src/index.css`).
- GitHub repo: `catalyixacademia-hash/pokhara-skin-and-hair-clinic`.
