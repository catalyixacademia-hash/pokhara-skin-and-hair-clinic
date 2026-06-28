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

function debugLog(
  hypothesisId: string,
  location: string,
  message: string,
  data: Record<string, unknown>,
) {
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/124d4274-1c5e-4cd7-ab06-5635de242abe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5ad3ba' },
    body: JSON.stringify({
      sessionId: '5ad3ba',
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

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
    debugLog('H3', 'submit-appointment.ts:config', 'Supabase not configured', {
      configured: false,
    });
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

  debugLog('H1', 'submit-appointment.ts:invoke', 'Invoking edge function', {
    formType: requestBody.formType,
    hasEmail: Boolean(requestBody.email),
    hasDate: Boolean(requestBody.date),
    treatmentLength: requestBody.treatment?.length ?? 0,
  });

  const { data, error } = await supabase.functions.invoke('send-appointment-emails', {
    body: requestBody,
  });

  if (error) {
    const serverError = await readFunctionError(error);
    debugLog('H1', 'submit-appointment.ts:error', 'Edge function invoke failed', {
      message: error.message,
      serverError,
      status: error.context?.status ?? null,
    });
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

  debugLog('H2', 'submit-appointment.ts:response', 'Edge function response', {
    ok: payload?.ok ?? false,
    hasAppointmentId: Boolean(payload?.appointmentId),
    userEmailSent: payload?.userEmailSent ?? false,
    hasEmailWarning: Boolean(payload?.emailWarning),
    error: payload?.error ?? null,
  });

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
