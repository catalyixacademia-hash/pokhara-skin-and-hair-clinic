import { getSupabase, isSupabaseConfigured } from './supabase';

export type AppointmentFormData = {
  name: string;
  phone: string;
  email: string;
  treatment: string;
  date: string;
  message: string;
  formType?: 'booking' | 'general_query';
};

export type SubmitAppointmentResult =
  | { ok: true; appointmentId?: string; userEmailSent?: boolean; emailWarning?: string }
  | { ok: false; error: string };

async function readFunctionError(error: {
  message?: string;
  context?: Response;
}): Promise<string | null> {
  if (!error.context) return null;
  try {
    const body = (await error.context.json()) as { error?: string };
    return body.error ?? null;
  } catch {
    return null;
  }
}

export async function submitAppointment(
  formData: AppointmentFormData,
): Promise<SubmitAppointmentResult> {
  const supabase = getSupabase();
  if (!supabase || !isSupabaseConfigured) {
    return {
      ok: false,
      error: 'Online booking is not configured yet. Please call or WhatsApp the clinic directly.',
    };
  }

  const requestBody = {
    name: formData.name,
    phone: formData.phone,
    email: formData.email || null,
    treatment: formData.treatment,
    date: formData.date || null,
    message: formData.message || null,
    formType: formData.formType ?? 'booking',
  };

  const { data, error } = await supabase.functions.invoke('send-appointment-emails', {
    body: requestBody,
  });

  if (error) {
    const serverError = await readFunctionError(error);
    console.error('Appointment submission failed:', error, serverError);
    return {
      ok: false,
      error: serverError ?? 'Could not submit your request. Please call the clinic directly.',
    };
  }

  const payload = data as {
    ok?: boolean;
    error?: string;
    appointmentId?: string;
    userEmailSent?: boolean;
    emailWarning?: string;
  } | null;

  if (!payload?.ok) {
    return {
      ok: false,
      error: payload?.error ?? 'Could not submit your request. Please call the clinic directly.',
    };
  }

  return {
    ok: true,
    appointmentId: payload.appointmentId,
    userEmailSent: payload.userEmailSent,
    emailWarning: payload.emailWarning,
  };
}
