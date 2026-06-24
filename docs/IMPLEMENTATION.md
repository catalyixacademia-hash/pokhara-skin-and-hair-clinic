# Pokhara Skin Clinic — Implementation Guide

This document covers local setup, Supabase configuration, admin CMS usage, deployment, and verification.

## Prerequisites

- Node.js 20+
- npm
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional but recommended)
- Supabase project (free tier is sufficient)

## Project structure

| Path | Purpose |
|------|---------|
| `/` | Public marketing site (Vite + React) |
| `admin/` | Staff CMS (separate Vite app, port 5174) |
| `supabase/migrations/` | Postgres schema + RLS + storage |
| `supabase/seed.sql` | Initial content from clinic data |
| `src/data/clinic.ts` | Static fallback when Supabase env is missing |
| `src/hooks/` | Supabase data hooks with static fallbacks |

## Environment variables

Copy `.env.example` to `.env` at the repo root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (Supabase Edge Functions — never prefix with VITE_)
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM_EMAIL=bookings@your-verified-domain.com
ADMIN_NOTIFICATION_EMAIL=clinic@your-domain.com
CLINIC_REPLY_TO_EMAIL=clinic@your-domain.com
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The admin app reads the same `VITE_*` variables. Create `admin/.env` with identical values, or symlink/copy from root.

**Never commit `.env`** — it is gitignored. Do not put `RESEND_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in any `VITE_*` variable.

## Appointment emails (Resend)

Booking submissions call the `send-appointment-emails` Supabase Edge Function, which:

1. Saves the request to the `appointments` table
2. Sends a **patient confirmation** email (light clinical theme) when an email address is provided
3. Sends an **admin notification** email (dark operational theme) to `ADMIN_NOTIFICATION_EMAIL`

### Deploy the edge function

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set RESEND_API_KEY=re_xxxxxxxx
supabase secrets set RESEND_FROM_EMAIL=bookings@your-verified-domain.com
supabase secrets set ADMIN_NOTIFICATION_EMAIL=clinic@your-domain.com
supabase secrets set CLINIC_REPLY_TO_EMAIL=clinic@your-domain.com
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase functions deploy send-appointment-emails
```

For local function testing:

```bash
supabase functions serve send-appointment-emails --env-file .env
```

### Resend without a custom domain

Until you verify a clinic domain in [Resend](https://resend.com/domains), keep:

```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Emails will show as **Pokhara Skin & Hair Clinic** with Resend’s test sender. Booking alerts still go to `ADMIN_NOTIFICATION_EMAIL` (your Gmail). Patient replies go to `CLINIC_REPLY_TO_EMAIL`. A Vercel URL cannot be used as a mail-from domain.

## Local development

```bash
# Install public site dependencies
npm install

# Install admin dependencies
npm install --prefix admin

# Public site (default http://localhost:5173)
npm run dev

# Admin CMS (http://localhost:5174)
npm run dev:admin
```

Without Supabase env vars and a deployed `send-appointment-emails` edge function, the appointment form cannot persist bookings or send emails.

## Supabase setup

### 1. Create project

Create a project at [supabase.com](https://supabase.com). Note the project URL and anon key.

### 2. Apply migrations

**Option A — Supabase CLI (linked project):**

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Option B — SQL Editor:**

Run in order:

1. `supabase/migrations/20250610000000_init_schema.sql`
2. `supabase/migrations/20250610000001_storage.sql`
3. `supabase/seed.sql`

### 3. Create first admin user

In Supabase Dashboard → Authentication → Users → Add user (email + password).

This user can sign in at `http://localhost:5174/login`.

### 4. Verify RLS

| Action | Expected |
|--------|----------|
| Anon `SELECT` on published content | Allowed |
| Anon `INSERT` on `appointments` | Allowed |
| Anon `UPDATE/DELETE` on content | Denied |
| Authenticated CRUD on all tables | Allowed |

## Admin CMS

Routes:

- `/dashboard` — pending appointments, quick links
- `/appointments` — inbox with status workflow
- `/services` — skin / hair / aesthetic services
- `/testimonials`, `/results`, `/gallery`, `/hero` — content CRUD
- `/settings` — clinic name, tagline, address, hours, maps
- `/doctor` — doctor bio and credentials

Images upload to the `clinic-media` storage bucket when configured.

## Public site data flow

Hooks fetch published rows from Supabase on mount:

- `useServices`, `useTestimonials`, `useResults`, `useGallery`, `useHeroSlides`, `useTreatmentOptions`

If fetch fails or env is missing, components fall back to static arrays in hooks / `clinic.ts`.

Appointment form calls the `send-appointment-emails` edge function when Supabase is configured.

## Build & deploy

### Public site

```bash
npm run build
# Output: dist/
```

For single-file static hosting (legacy):

```powershell
# Windows PowerShell
$env:SINGLE_FILE='true'; npm run build
```

```bash
# macOS / Linux
SINGLE_FILE=true npm run build
```

Deploy `dist/` to Vercel, Netlify, or any static host.

**Production (Vercel):** [https://pokhara-skin-and-hair-clinic.vercel.app/](https://pokhara-skin-and-hair-clinic.vercel.app/)

Set these in the Vercel project → Settings → Environment Variables (Production + Preview):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Redeploy after adding env vars so the build picks them up. Resend and service-role keys stay on **Supabase** (edge function secrets), not Vercel.

### Admin app

```bash
npm run build:admin
# Output: admin/dist/
```

Deploy separately (e.g. `admin.yourclinic.com`). Restrict access via Supabase Auth only; consider additional network restrictions for production.

Set the same `VITE_SUPABASE_*` env vars in your hosting provider for both apps.

## Phase checklist

### Phase 1 — Design (complete)

- [x] Design tokens in `src/index.css` (`@theme`, skin/hair semantics)
- [x] Skin-first Services layout (skin grid, hair band, aesthetic accordion)
- [x] Hero, TrustBar, Results, Testimonials, Gallery hierarchy
- [x] `SectionHeader`, `CategoryBadge` components

### Phase 2 — Supabase (complete)

- [x] Schema migration with RLS
- [x] Storage bucket `clinic-media`
- [x] Seed script from clinic data
- [x] `.env.example`

### Phase 3 — Admin app (complete)

- [x] Separate Vite app in `admin/`
- [x] Supabase Auth login
- [x] CRUD for all content entities + appointments inbox

### Phase 4 — Public wiring (complete)

- [x] Supabase hooks with static fallbacks
- [x] Appointment insert to Supabase

### Phase 5 — Docs (complete)

- [x] This guide
- [x] `dev:admin` and `build:admin` scripts

## Testing matrix

| Test | Steps | Pass criteria |
|------|-------|---------------|
| Public offline | Run `npm run dev` without `.env` | Site renders with static data |
| Public online | Set env, seed DB, refresh | Services/testimonials match DB |
| Appointment | Submit form with Supabase configured | Row appears in admin inbox |
| Admin auth | Wrong password / correct login | Blocked / dashboard access |
| Service CRUD | Edit service title in admin | Public site shows update after refresh |
| RLS | Anon client cannot delete services | Supabase returns policy error |
| Build | `npm run build` + `npm run build:admin` | Both complete without errors |

## Troubleshooting

**Admin login fails** — Confirm user exists in Supabase Auth and email confirmation is not required (or user is confirmed).

**Images not uploading** — Ensure `clinic-media` bucket exists and storage policies from migration `20250610000001_storage.sql` are applied.

**Public site shows old content** — Hard refresh; verify `is_published = true` on rows.

**CORS / env errors** — Confirm `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set at build time for production deploys.
