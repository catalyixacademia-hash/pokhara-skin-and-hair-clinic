-- Allow multiple published doctor profiles (was singleton id = 1).

alter table doctor_profile drop constraint if exists doctor_profile_id_check;

create sequence if not exists doctor_profile_id_seq;

select setval(
  'doctor_profile_id_seq',
  greatest(coalesce((select max(id) from doctor_profile), 1), 1)
);

alter table doctor_profile alter column id set default nextval('doctor_profile_id_seq');
alter sequence doctor_profile_id_seq owned by doctor_profile.id;

alter table doctor_profile
  add column if not exists sort_order int not null default 0,
  add column if not exists is_published boolean not null default true,
  add column if not exists pull_quote text;

drop policy if exists public_read_doctor_profile on doctor_profile;

create policy public_read_doctor_profile
  on doctor_profile
  for select
  using (is_published = true);

update doctor_profile
set
  sort_order = 1,
  pull_quote = 'Every plan starts with evidence — I recommend only what is medically appropriate for your skin, not what is fashionable.',
  updated_at = now()
where id = 1;

insert into doctor_profile (
  id,
  name,
  title,
  title_short,
  bio,
  credentials,
  portrait_url,
  sort_order,
  is_published,
  pull_quote
) values (
  2,
  'Dr. Bishnu Prasad Adhikari',
  'Consultant Dermatologist & Lecturer',
  'Consultant Dermatologist · MD',
  '[
    "Dr. Bishnu Prasad Adhikari is a Consultant Dermatologist at Pokhara Skin and Hair Clinic, where he provides specialist care for a wide range of skin, hair, and related conditions. He is registered with the Nepal Medical Council (NMC Reg. No. 19353).",
    "He holds an MBBS from Ryazan State I.P. Medical University and an MD in Dermatology from Manipal College of Medical Sciences (MCOMS), Kathmandu University. He is a Lecturer in the Department of Dermatology at MCOMS, Pokhara, and has published case reports in the Nepal Journal of Dermatology, Venereology & Leprology, including work on rare presentations such as Lues Maligna and acquired epidermodysplasia verruciformis."
  ]'::jsonb,
  '[
    {"label": "NMC Registration", "value": "No. 19353"},
    {"label": "MD, Dermatology", "value": "Manipal College of Medical Sciences (MCOMS), Kathmandu University"},
    {"label": "MBBS", "value": "Ryazan State I.P. Medical University, Ryazan"},
    {"label": "Lecturer", "value": "Department of Dermatology, MCOMS, Pokhara"},
    {"label": "Focus Areas", "value": "Skin diseases, venereal diseases, and related medical dermatology"}
  ]'::jsonb,
  null,
  2,
  true,
  'I start with a clear diagnosis — then treat skin and related conditions with what is medically indicated, not what is fashionable.'
)
on conflict (id) do update set
  name = excluded.name,
  title = excluded.title,
  title_short = excluded.title_short,
  bio = excluded.bio,
  credentials = excluded.credentials,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  pull_quote = excluded.pull_quote,
  updated_at = now();

select setval(
  'doctor_profile_id_seq',
  greatest(coalesce((select max(id) from doctor_profile), 1), 2)
);
