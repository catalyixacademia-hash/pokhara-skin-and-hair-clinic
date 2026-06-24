-- Add form type and staff-only internal notes to appointments

alter table appointments
  add column if not exists form_type text not null default 'booking'
    check (form_type in ('booking', 'general_query'));

alter table appointments
  add column if not exists internal_notes text;

update appointments set form_type = 'booking' where form_type is null;
