## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Avoid generic AI-slop aesthetics; Stitch “Clinical Serenity” theme (Manrope + Work Sans, warm teal `#005f56`, secondary brown `#765842`, soft surface bands)—not cream + serif editorial templates.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Navbar: clinic logo mark plus single-line wordmark with full `clinic.nameShort` (not split `wordmarkLine1`/`wordmarkLine2`, which truncates to “Pokhara” on mobile); `.glass-nav` white frosted bar; links Treatments, Hair restoration, Dermatology, Results, Contact; Book appointment uses `.btn-nav-cta` (primary-container); secondary items (Ask a question, Location) belong in mobile menu or footer, not crowded into desktop nav.
- Hero: full-bleed `/images/hero/clinic-hero.png` with left `.hero-overlay` gradient wash; vertically centered 2-col grid (copy left, combined info card right on desktop); no frosted main headline card.
- Primary hero CTA uses `.btn-primary` (teal); secondary hero action uses `.btn-secondary-outline` (warm brown border).
- Floating CTAs: `.book-fab` (Book appointment, bottom-right) plus `.whatsapp-float`; on mobile/tablet stack book-fab above WhatsApp on the right as a compact circle (never bottom-left).
- Section CTAs must be real buttons with consistent alignment; one primary conversion path to `#contact`, not per-card booking spam.
- Harden the entire public site for mobile screens (touch targets, spacing, full-width CTAs where needed).
- Public Staff login links to the separate admin app (production `/admin` on same domain, local dev port 5174); admin treats patient form data as read-only—staff may update status and internal notes only.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.
- After substantive changes, commit and push to GitHub (`origin/main`) every time unless the user says otherwise.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Stitch design tokens live in `src/index.css` (background `#f9f9fc`, surface `#ffffff`, ink `#1a1c1e`, primary `#005f56`, primary-container `#0d7a6f`, secondary `#765842`; Manrope headlines + Work Sans body).
- Public sections: Hero, Treatments (`#services`, `#hair-services`), CareStandards, ClinicDoctor (`#about`, `#doctor`), Outcomes (`#results`), SocialProof, Visit (`#contact`), GeneralEnquiry (`#enquiry`, `#location`), Footer, BookFab, WhatsAppFloat.
- Clinic business content is centralized in `src/data/clinic.ts` (phones, hours, social, verified Google Maps embed/open URLs; brand assets `/clinic-logo-mark.png` and `/favicon.png`; floating WhatsApp uses `whatsappFloat` 984515246).
- Hero: full-bleed clinic poster (`/images/hero/clinic-hero.png`); left gradient overlay; mobile/tablet `.hero-bg-image` uses centered poster framing via `object-position` (~42–44% horizontal) so the clinic sign stays in frame; combined hours/location `.hero-info-card` on desktop; doctor portrait at `/images/doctor/dr-prakash-acharya.png`.
- Treatments: image-top `.treatment-card` grid (skin + hair only); aesthetic services listed in Outcomes section.
- Public build uses `vite-plugin-singlefile`; admin is a separate Vite project in `admin/` (dev port 5174); production deploys via `vercel.json` to Vercel (public at root, admin SPA at `/admin`, `pokhara-skin-and-hair-clinic.vercel.app`).
- Supabase backs appointment persistence, admin Auth, and Resend email edge functions with separate patient vs admin HTML templates for bookings and enquiries.
- Admin SPA routes: `/dashboard`, `/queue`, `/bookings`, `/enquiries`, `/analytics`, `/treatment-options`, `/settings`, `/services`, `/testimonials`, `/results`, `/gallery`, `/hero`, `/doctor`; login via `src/lib/admin-url.ts` (`VITE_ADMIN_URL`); patient fields read-only, status/`internal_notes` editable; follow-up queue stacks call/WhatsApp/confirm actions.
- Public booking (`#contact`) and general enquiry (`#enquiry`, `GeneralEnquiry.tsx`) forms persist to `appointments` with `form_type`; forms use borderless `.field-input` on surface-container-low inside `.form-card` white panels.
- Footer is light (`bg-surface-container-low`), four columns, secondary brand title.
- GitHub repo: `catalyixacademia-hash/pokhara-skin-and-hair-clinic`.
