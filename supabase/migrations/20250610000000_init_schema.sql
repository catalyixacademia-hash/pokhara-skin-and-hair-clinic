-- Pokhara Skin Clinic CMS schema

create extension if not exists "pgcrypto";

-- Clinic settings (singleton)
create table if not exists clinic_settings (
  id int primary key default 1 check (id = 1),
  name text not null,
  name_short text,
  tagline text,
  address jsonb not null default '{}',
  hours jsonb not null default '{}',
  maps_embed_url text,
  maps_open_url text,
  updated_at timestamptz not null default now()
);

create table if not exists phones (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  role text not null,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  url text not null,
  handle text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists doctor_profile (
  id int primary key default 1 check (id = 1),
  name text not null,
  title text not null,
  title_short text,
  bio jsonb not null default '[]',
  credentials jsonb not null default '[]',
  portrait_url text,
  updated_at timestamptz not null default now()
);

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  sort_order int not null default 0
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references service_categories(id) on delete cascade,
  title text not null,
  description text not null,
  benefits jsonb not null default '[]',
  result text not null,
  image_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists treatment_options (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  treatment text not null,
  rating int not null default 5 check (rating between 1 and 5),
  quote text not null,
  initial char(1),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  before_url text not null,
  after_url text not null,
  duration text,
  category text not null default 'skin' check (category in ('skin', 'hair')),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  label text not null,
  tag text,
  is_tall boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  alt text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists trust_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  sub text,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists about_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  treatment text not null,
  preferred_date date,
  message text,
  status appointment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table clinic_settings enable row level security;
alter table phones enable row level security;
alter table social_links enable row level security;
alter table doctor_profile enable row level security;
alter table service_categories enable row level security;
alter table services enable row level security;
alter table treatment_options enable row level security;
alter table testimonials enable row level security;
alter table results enable row level security;
alter table gallery_items enable row level security;
alter table hero_slides enable row level security;
alter table trust_items enable row level security;
alter table about_stats enable row level security;
alter table appointments enable row level security;

-- Public read policies (published content)
create policy "public_read_clinic_settings" on clinic_settings for select using (true);
create policy "public_read_phones" on phones for select using (true);
create policy "public_read_social_links" on social_links for select using (true);
create policy "public_read_doctor_profile" on doctor_profile for select using (true);
create policy "public_read_service_categories" on service_categories for select using (true);
create policy "public_read_services" on services for select using (is_published = true);
create policy "public_read_treatment_options" on treatment_options for select using (is_published = true);
create policy "public_read_testimonials" on testimonials for select using (is_published = true);
create policy "public_read_results" on results for select using (is_published = true);
create policy "public_read_gallery_items" on gallery_items for select using (is_published = true);
create policy "public_read_hero_slides" on hero_slides for select using (is_published = true);
create policy "public_read_trust_items" on trust_items for select using (true);
create policy "public_read_about_stats" on about_stats for select using (true);

-- Appointments: public insert, admin read/update
create policy "public_insert_appointments" on appointments for insert with check (true);
create policy "admin_all_appointments" on appointments for all using (auth.role() = 'authenticated');

-- Admin full access on content tables
create policy "admin_all_clinic_settings" on clinic_settings for all using (auth.role() = 'authenticated');
create policy "admin_all_phones" on phones for all using (auth.role() = 'authenticated');
create policy "admin_all_social_links" on social_links for all using (auth.role() = 'authenticated');
create policy "admin_all_doctor_profile" on doctor_profile for all using (auth.role() = 'authenticated');
create policy "admin_all_service_categories" on service_categories for all using (auth.role() = 'authenticated');
create policy "admin_all_services" on services for all using (auth.role() = 'authenticated');
create policy "admin_all_treatment_options" on treatment_options for all using (auth.role() = 'authenticated');
create policy "admin_all_testimonials" on testimonials for all using (auth.role() = 'authenticated');
create policy "admin_all_results" on results for all using (auth.role() = 'authenticated');
create policy "admin_all_gallery_items" on gallery_items for all using (auth.role() = 'authenticated');
create policy "admin_all_hero_slides" on hero_slides for all using (auth.role() = 'authenticated');
create policy "admin_all_trust_items" on trust_items for all using (auth.role() = 'authenticated');
create policy "admin_all_about_stats" on about_stats for all using (auth.role() = 'authenticated');

-- Storage bucket (run in Supabase dashboard or via storage API)
-- insert into storage.buckets (id, name, public) values ('clinic-media', 'clinic-media', true);
