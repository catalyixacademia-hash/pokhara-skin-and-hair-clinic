## Learned User Preferences

- Prioritize skin treatments over hair in design and content hierarchy; hair should be visually secondary.
- Verify hero and layout fixes in real browsers (Chrome/Edge), not only the Cursor embedded browser.
- Keep the navbar compact (~3.5rem / h-14 height).
- Hero secondary text on dark backgrounds must use light tones (e.g. #C4B8A8), not dark gray, for readability.
- Hero background should stack below the fixed navbar (spacer + `.hero-viewport`), not overlap under the nav.
- Primary CTA (`.btn-primary`) hover should use solid ivory background with dark text, not transparent.
- Outline/secondary hero buttons should use a subtle backdrop blur (frosted glass).
- Leave adequate spacing between the navbar bottom and hero eyebrow text.
- Use Supabase for backend/CMS; admin should be a separate app in `admin/`, not routes in the public SPA.
- Do not edit attached plan files when implementing plans; follow existing todos without recreating them.

## Learned Workspace Facts

- Single-page marketing site: React 19, Vite 7, Tailwind CSS 4, Framer Motion; no client-side router on the public site.
- Clinic business content is centralized in `src/data/clinic.ts`.
- Hero layout relies on `--nav-height`, fixed header, nav spacer div, and `.hero-viewport` / `.hero-section` in `src/index.css`.
- Public build uses `vite-plugin-singlefile`; admin app should be a separate Vite project without singlefile.
- No admin portal or backend exists yet; appointments are client-only until Supabase is wired.
- Planned CMS scope includes services, testimonials, results, gallery, clinic settings, doctor profile, and appointment inbox.
