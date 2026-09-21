-- Trash retention: hard-delete soft-deleted appointments after 30 days.
-- Also allow authenticated staff to permanently delete rows already in trash.

create index if not exists appointments_deleted_at_idx
  on appointments (deleted_at)
  where deleted_at is not null;

drop policy if exists "admin_delete_trashed_appointments" on appointments;
create policy "admin_delete_trashed_appointments" on appointments
  for delete
  using (auth.role() = 'authenticated' and deleted_at is not null);

create or replace function public.purge_expired_appointment_trash()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer := 0;
begin
  delete from public.appointments
  where deleted_at is not null
    and deleted_at < (timezone('utc', now()) - interval '30 days');
  get diagnostics removed = row_count;
  return removed;
end;
$$;

comment on function public.purge_expired_appointment_trash() is
  'Hard-deletes appointments soft-deleted more than 30 days ago.';

revoke all on function public.purge_expired_appointment_trash() from public;
grant execute on function public.purge_expired_appointment_trash() to authenticated;
grant execute on function public.purge_expired_appointment_trash() to service_role;

-- Daily purge at 03:15 UTC when pg_cron is available.
do $$
begin
  create extension if not exists pg_cron with schema extensions;
exception
  when others then
    raise notice 'pg_cron not available';
end $$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    begin
      perform cron.unschedule('purge-appointment-trash');
    exception
      when others then null;
    end;
    perform cron.schedule(
      'purge-appointment-trash',
      '15 3 * * *',
      $cron$select public.purge_expired_appointment_trash();$cron$
    );
  end if;
exception
  when others then
    raise notice 'Could not schedule pg_cron job';
end $$;
