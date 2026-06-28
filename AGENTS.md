## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Avoid generic AI-slop aesthetics; clinical-light sans-led design (cool off-white, ink typography, restrained blue-teal accent)—not cream + serif + sage editorial templates.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Navbar: clinic logo mark plus single-line wordmark (`clinic.nameShort`); transparent glass bar over hero; links Treatments, Hair restoration, Dermatology, Results, Contact; Book appointment uses `.btn-accent`; secondary items (Ask a question, Location) belong in mobile menu or footer, not crowded into desktop nav.
- Hero: full-bleed real clinic poster under glass navbar; frosted glass cards (`.hero-main-card`, `.hero-info-stack`) keep copy readable without heavy gradient wash; keep the reception photo clearly visible.
- Hero extends under the fixed navbar via `.hero-viewport` negative margin + padding (no separate nav spacer div).
- Primary CTA (`.btn-primary`) hover should use solid off-white/surface background with dark text, not transparent; hero and navbar booking CTAs use `.btn-accent`, secondary hero actions use `.btn-hero-secondary`.
- Section CTAs must be real buttons with consistent alignment; one primary conversion path to `#contact`, not per-card booking spam.
- Harden the entire public site for mobile screens (touch targets, spacing, full-width CTAs where needed).
- Public Staff login links to the separate admin app (production `/admin` on same domain, local dev port 5174); admin treats patient form data as read-only—staff may update status and internal notes only.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.
- After substantive changes, commit and push to GitHub (`origin/main`) every time unless the user says otherwise.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Clinical Light design tokens live in `src/index.css` (paper `#F7F8FA`, surface `#FFFFFF`, ink `#0D1117`, accent `#145C7A`, brand-green/navy on wordmark; Sora + IBM Plex Sans + IBM Plex Mono).
- Public sections: Hero, Treatments (`#services`), CareStandards, ClinicDoctor (`#about`, `#doctor`), Outcomes (`#results`), SocialProof, Visit (`#contact`, `#location`), GeneralEnquiry (`#enquiry`), Footer.
- Clinic business content is centralized in `src/data/clinic.ts` (phones, hours, social, verified Google Maps embed/open URLs; brand assets `/clinic-logo-mark.png` and `/favicon.png`; floating WhatsApp uses `whatsappFloat` 984515246).
- Hero: full-bleed `/images/hero/clinic-hero.png` with `.hero-overlay-subtle`; glass `.hero-main-card` plus bottom-right `.hero-info-stack`; `.hero-viewport` negative margin under fixed nav; doctor portrait at `/images/doctor/dr-prakash-acharya.png`.
- Treatments section includes `#hair-services` anchor for the Hair restoration nav link.
- Public build uses `vite-plugin-singlefile`; admin is a separate Vite project in `admin/` (dev port 5174); production deploys via `vercel.json` to Vercel (public at root, admin SPA at `/admin`, `pokhara-skin-and-hair-clinic.vercel.app`).
- Supabase backs appointment persistence, admin Auth, and Resend email edge functions with separate patient vs admin HTML templates for bookings and enquiries.
- Admin SPA routes: `/dashboard`, `/bookings`, `/enquiries`, `/analytics`; login via `src/lib/admin-url.ts` (`VITE_ADMIN_URL`); patient fields read-only, status/`internal_notes` editable.
- Public booking (`#contact`) and general enquiry (`#enquiry`, `GeneralEnquiry.tsx`) forms persist to `appointments` with `form_type`; both use `.booking-form-panel` bordered card.
- GitHub repo: `catalyixacademia-hash/pokhara-skin-and-hair-clinic`.
