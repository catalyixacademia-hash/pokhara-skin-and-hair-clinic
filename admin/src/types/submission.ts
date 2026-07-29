export type FormType = 'booking' | 'general_query';

export type SubmissionStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Submission = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  treatment: string;
  preferred_date: string | null;
  message: string | null;
  form_type: FormType;
  status: SubmissionStatus;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  /** Soft-delete; null means active in inbox/queue. */
  deleted_at: string | null;
};

export const SUBMISSION_STATUSES: SubmissionStatus[] = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
];

export function formTypeLabel(formType: FormType): string {
  return formType === 'general_query' ? 'General enquiry' : 'Booking';
}

export function listBasePath(formType: FormType): string {
  return formType === 'general_query' ? '/enquiries' : '/bookings';
}
