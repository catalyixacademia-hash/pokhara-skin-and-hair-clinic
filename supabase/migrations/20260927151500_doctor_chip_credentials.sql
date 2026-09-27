-- Align public chips: MD Specialist + MBBS for Prakash; Certification-style
-- rows for Bishnu.

update doctor_profile
set
  credentials = '[
    {"label":"NMC Registration","value":"NMC Reg. No. 12549"},
    {"label":"MD Specialist (Dermatology)","value":"Nepal Medical Council specialist"},
    {"label":"MBBS","value":"Tribhuvan University, Maharajgunj Medical Campus (2011)"},
    {"label":"Qualification","value":"MD, Dermatology — Kathmandu University (2020)"},
    {"label":"Certification","value":"Board Certified Dermatologist"},
    {"label":"Specialization","value":"Clinical & Aesthetic Dermatology"},
    {"label":"Focus Areas","value":"Melasma & pigmentation, acne & scars, anti-aging, hair loss, regenerative dermatology"}
  ]'::jsonb,
  updated_at = now()
where id = 1
   or name ilike '%Prakash Acharya%';

update doctor_profile
set
  credentials = '[
    {"label":"NMC Registration","value":"NMC Reg. No. 19353"},
    {"label":"MD Specialist (Dermatology)","value":"Nepal Medical Council specialist"},
    {"label":"MBBS","value":"Ryazan State I.P. Medical University, Ryazan"},
    {"label":"Qualification","value":"MD, Dermatology — Manipal College of Medical Sciences (MCOMS), Kathmandu University"},
    {"label":"Certification","value":"Consultant Dermatologist"},
    {"label":"Specialization","value":"Medical Dermatology"},
    {"label":"Lecturer","value":"Department of Dermatology, MCOMS, Pokhara"},
    {"label":"Focus Areas","value":"Skin diseases, venereal diseases, and related medical dermatology"}
  ]'::jsonb,
  updated_at = now()
where id = 2
   or name ilike '%Bishnu Prasad Adhikari%';
