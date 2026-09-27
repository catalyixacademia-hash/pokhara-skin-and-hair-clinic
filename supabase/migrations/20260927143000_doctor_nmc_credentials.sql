-- Normalize public/admin doctor chips: "NMC Reg. No. {n}" and a separate
-- Specialist (Dermatology) row for Dr. Prakash.

update doctor_profile
set
  credentials = (
    select coalesce(jsonb_agg(elem order by ord), '[]'::jsonb)
    from (
      select 0 as ord, '{"label":"NMC Registration","value":"NMC Reg. No. 12549"}'::jsonb as elem
      union all
      select 1, '{"label":"Specialist (Dermatology)","value":"Nepal Medical Council specialist"}'::jsonb
      union all
      select 10 + ordinality::int, value
      from jsonb_array_elements(coalesce(credentials, '[]'::jsonb)) with ordinality
      where coalesce(value->>'label', '') !~* 'nmc'
        and coalesce(value->>'label', '') !~* '^specialist\s*\('
    ) normalized
  ),
  updated_at = now()
where id = 1
   or name ilike '%Prakash Acharya%';

update doctor_profile
set
  credentials = (
    select coalesce(jsonb_agg(elem order by ord), '[]'::jsonb)
    from (
      select 0 as ord, '{"label":"NMC Registration","value":"NMC Reg. No. 19353"}'::jsonb as elem
      union all
      select 10 + ordinality::int, value
      from jsonb_array_elements(coalesce(credentials, '[]'::jsonb)) with ordinality
      where coalesce(value->>'label', '') !~* 'nmc'
        and coalesce(value->>'value', '') !~* '^no\.\s*19353'
    ) normalized
  ),
  updated_at = now()
where id = 2
   or name ilike '%Bishnu Prasad Adhikari%';
