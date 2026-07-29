-- Soft-delete for appointments + staff may only change status / internal_notes / deleted_at / updated_at.
-- Public booking/enquiry inserts remain allowed (anon INSERT + edge function service role).
-- Hard DELETE is removed for authenticated staff; use deleted_at instead.

-- ---------------------------------------------------------------------------
-- Schema
-- ---------------------------------------------------------------------------

alter table appointments
  add column if not exists deleted_at timestamptz;

comment on column appointments.deleted_at is
  'Soft-delete timestamp. Null = active inbox row. Staff hide via UPDATE, not hard DELETE.';

comment on table appointments is
  'Patient submissions. Public/edge INSERT only. Staff UPDATE limited to status, internal_notes, deleted_at, updated_at. Patient fields are immutable after insert.';

-- Light insert validation (edge function already trims/requires these; keeps direct inserts sane)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'appointments_name_not_blank'
  ) then
    alter table appointments
      add constraint appointments_name_not_blank check (char_length(trim(name)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'appointments_phone_not_blank'
  ) then
    alter table appointments
      add constraint appointments_phone_not_blank check (char_length(trim(phone)) > 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'appointments_treatment_not_blank'
  ) then
    alter table appointments
      add constraint appointments_treatment_not_blank check (char_length(trim(treatment)) > 0);
  end if;
end $$;

create index if not exists appointments_active_created_idx
  on appointments (created_at desc)
  where deleted_at is null;

create index if not exists appointments_active_status_form_idx
  on appointments (status, form_type, created_at desc)
  where deleted_at is null;

create index if not exists appointments_active_preferred_date_idx
  on appointments (preferred_date)
  where deleted_at is null and preferred_date is not null;

-- ---------------------------------------------------------------------------
-- Immutability trigger (patient fields)
-- ---------------------------------------------------------------------------

create or replace function appointments_restrict_staff_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if old.id is distinct from new.id
     or old.name is distinct from new.name
     or old.phone is distinct from new.phone
     or old.email is distinct from new.email
     or old.treatment is distinct from new.treatment
     or old.preferred_date is distinct from new.preferred_date
     or old.message is distinct from new.message
     or old.form_type is distinct from new.form_type
     or old.created_at is distinct from new.created_at
  then
    raise exception 'Patient-submitted appointment fields are immutable'
      using errcode = '42501';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists appointments_restrict_staff_update on appointments;
create trigger appointments_restrict_staff_update
  before update on appointments
  for each row
  execute function appointments_restrict_staff_update();

-- ---------------------------------------------------------------------------
-- RLS: replace broad admin ALL with select + update (no hard delete)
-- ---------------------------------------------------------------------------

drop policy if exists "admin_all_appointments" on appointments;

drop policy if exists "admin_select_appointments" on appointments;
create policy "admin_select_appointments" on appointments
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin_update_appointments" on appointments;
create policy "admin_update_appointments" on appointments
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- public_insert_appointments already exists from init schema — leave it intact.
-- Authenticated INSERT is not required for staff workflows.
-- No DELETE policy: hard delete blocked for authenticated role; soft-delete via deleted_at.
