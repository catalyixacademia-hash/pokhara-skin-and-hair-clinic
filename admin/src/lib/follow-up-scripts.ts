import type { Submission, SubmissionStatus } from '@/types/submission';
import { formatPreferredDate } from '@/lib/contact-links';

export type FollowUpScriptKind = 'default' | 'confirm' | 'missed' | 'completed';

export function followUpWhatsAppMessage(
  row: Pick<Submission, 'name' | 'form_type' | 'treatment' | 'preferred_date' | 'status'>,
  kind: FollowUpScriptKind = 'default',
): string {
  const first = row.name.trim().split(/\s+/)[0] || row.name;
  const kindLabel = row.form_type === 'booking' ? 'appointment request' : 'enquiry';
  const dateLine =
    row.form_type === 'booking' && row.preferred_date
      ? ` Preferred date on file: ${formatPreferredDate(row.preferred_date)}.`
      : '';

  switch (kind) {
    case 'confirm':
      return `Hello ${first}, this is Pokhara Skin & Hair Clinic. We would like to confirm your ${kindLabel} for ${row.treatment}.${dateLine} Please reply to confirm your visit.`;
    case 'missed':
      return `Hello ${first}, this is Pokhara Skin & Hair Clinic. We tried reaching you about your ${kindLabel} (${row.treatment}). Please reply here or call us when convenient.`;
    case 'completed':
      return `Hello ${first}, thank you for visiting Pokhara Skin & Hair Clinic for ${row.treatment}. If you have any aftercare questions, reply here anytime.`;
    case 'default': {
      if (row.status === 'confirmed') {
        return followUpWhatsAppMessage(row, 'confirm');
      }
      if (row.status === 'completed') {
        return followUpWhatsAppMessage(row, 'completed');
      }
      return `Hello ${first}, this is Pokhara Skin & Hair Clinic regarding your ${kindLabel} for ${row.treatment}.${dateLine}`;
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function scriptLabel(kind: FollowUpScriptKind): string {
  switch (kind) {
    case 'default':
      return 'General';
    case 'confirm':
      return 'Confirm slot';
    case 'missed':
      return 'Missed call';
    case 'completed':
      return 'After visit';
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function defaultScriptForStatus(status: SubmissionStatus): FollowUpScriptKind {
  switch (status) {
    case 'confirmed':
      return 'confirm';
    case 'completed':
      return 'completed';
    case 'pending':
    case 'cancelled':
      return 'default';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
