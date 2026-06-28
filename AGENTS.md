## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Avoid generic AI-slop aesthetics; clinical-light sans-led design (cool off-white, ink typography, restrained blue-teal accent)—not cream + serif + sage editorial templates.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Navbar: clinic logo mark plus two-line wordmark (Pokhara / Skin & Hair Clinic); links About, Treatments, Results, Doctor, Contact; Book visit stays a separate CTA; secondary items (Ask a question, Location) belong in mobile menu or footer, not crowded into desktop nav.
- Hero uses real clinic reception poster with left gradient overlay; text must stay readable on first load with ink-on-paper contrast over the photo.
- Hero background should stack below the fixed navbar (spacer + `.hero-viewport`), not overlap under the nav.
- Primary CTA (`.btn-primary`) hover should use solid off-white/surface background with dark text, not transparent.
- Outline/secondary hero buttons should use subtle backdrop blur or background (`.btn-outline-frost`).
- Section CTAs must be real buttons with consistent alignment; one primary conversion path to `#contact`, not per-card booking spam.
- Harden the entire public site for mobile screens (touch targets, spacing, full-width CTAs where needed).
- Public Staff login links to the separate admin app (production `/admin` on same domain, local dev port 5174); admin treats patient form data as read-only—staff may update status and internal notes only.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.
- After completing substantive changes, commit and push to GitHub (`origin/main`) unless the user says otherwise.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Clinical Light design tokens live in `src/index.css` (paper `#F7F8FA`, surface `#FFFFFF`, ink `#0D1117`, accent `#145C7A`, brand-green/navy on wordmark; Sora + IBM Plex Sans + IBM Plex Mono).
- Public sections: Hero, Treatments (`#services`), CareStandards, ClinicDoctor (`#about`, `#doctor`), Outcomes (`#results`), SocialProof, Visit (`#contact`, `#location`), GeneralEnquiry (`#enquiry`), Footer.
- Clinic business content is centralized in `src/data/clinic.ts` (phones, hours, social, verified Google Maps embed/open URLs; brand assets `/clinic-logo-mark.png` and `/favicon.png`; floating WhatsApp uses `whatsappFloat` 984515246).
- Hero uses real clinic poster `/images/hero/clinic-hero.png` with left gradient for text readability; layout uses `--nav-height`, fixed header, `.hero-viewport` / `.hero-section`; doctor portrait at `/images/doctor/dr-prakash-acharya.png`.
- Public build uses `vite-plugin-singlefile`; admin is a separate Vite project in `admin/` (dev port 5174, no singlefile).
- Production deploys to Vercel via combined `vercel.json` build: public at site root, admin SPA at `/admin` on the same domain (`pokhara-skin-and-hair-clinic.vercel.app`).
- Supabase backs appointment persistence, admin Auth, and Resend email edge functions with separate patient vs admin HTML templates for bookings and enquiries.
- Admin routes: `/dashboard` overview, `/bookings` and `/enquiries` submission inboxes, `/analytics` dashboard; patient fields read-only, status/`internal_notes` editable.
- Public General Enquiry form lives at `#enquiry` (`GeneralEnquiry.tsx`); both forms persist to `appointments` with `form_type` (`booking` | `general_query`).
- Public Staff login uses `src/lib/admin-url.ts` (`VITE_ADMIN_URL`, production default `{VITE_SITE_URL}/admin/login`).
- Booking and enquiry forms share `.booking-form-panel` bordered card (`src/index.css`); enquiry form should stay compact.
- GitHub repo: `catalyixacademia-hash/pokhara-skin-and-hair-clinic`.
