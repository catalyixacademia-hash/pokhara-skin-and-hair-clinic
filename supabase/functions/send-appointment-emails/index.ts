import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import {
  buildAdminEmail,
  buildUserEmail,
  type AppointmentBooking,
} from './templates.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type BookingPayload = {
  name?: string;
  phone?: string;
  email?: string | null;
  treatment?: string;
  date?: string | null;
  message?: string | null;
  formType?: 'booking' | 'general_query';
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function normalizeBooking(payload: BookingPayload): AppointmentBooking | null {
  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const treatment = payload.treatment?.trim();

  if (!name || !phone || !treatment) return null;

  return {
    name,
    phone,
    email: payload.email?.trim() || null,
    treatment,
    date: payload.date?.trim() || null,
    message: payload.message?.trim() || null,
    formType: payload.formType === 'general_query' ? 'general_query' : 'booking',
  };
}

async function sendResendEmail(options: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload: Record<string, unknown> = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  if (options.replyTo?.length) {
    payload.reply_to = options.replyTo;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { ok: false, error: `Resend ${response.status}: ${errorBody}` };
    }

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Resend error';
    return { ok: false, error: message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY')?.trim();
  const fromEmail = Deno.env.get('RESEND_FROM_EMAIL')?.trim();
  const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL')?.trim();
  const replyToEmail = Deno.env.get('CLINIC_REPLY_TO_EMAIL')?.trim();
  const supabaseUrl = Deno.env.get('SUPABASE_URL')?.trim();
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: 'Server database configuration is incomplete.' }, 500);
  }

  let payload: BookingPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const booking = normalizeBooking(payload);
  if (!booking) {
    return jsonResponse({ error: 'Name, phone, and treatment are required' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: inserted, error: insertError } = await supabase
    .from('appointments')
    .insert({
      name: booking.name,
      phone: booking.phone,
      email: booking.email,
      treatment: booking.treatment,
      preferred_date: booking.date || null,
      message: booking.message,
      form_type: booking.formType ?? 'booking',
      status: 'pending',
    })
    .select('id')
    .single();

  if (insertError || !inserted) {
    console.error('Appointment insert failed:', insertError);
    return jsonResponse({ error: 'Could not save appointment request' }, 500);
  }

  const appointmentId = inserted.id as string;
  const replyTo = replyToEmail ? [replyToEmail] : undefined;
  const emailConfigured = Boolean(resendApiKey && fromEmail && adminEmail);
  const fromAddress = fromEmail ?? 'onboarding@resend.dev';

  let adminEmailSent = false;
  let userEmailSent = false;
  const emailErrors: string[] = [];

  if (!emailConfigured) {
    emailErrors.push('Email service is not fully configured on the server.');
  } else {
    const adminEmailContent = buildAdminEmail(booking, appointmentId);
    const adminResult = await sendResendEmail({
      apiKey: resendApiKey!,
      from: fromAddress,
      to: [adminEmail!],
      subject: adminEmailContent.subject,
      html: adminEmailContent.html,
      text: adminEmailContent.text,
      replyTo: booking.email ? [booking.email] : replyTo,
    });

    if (adminResult.ok) {
      adminEmailSent = true;
    } else {
      console.error('Admin email failed:', adminResult.error);
      emailErrors.push('Admin notification email failed.');
    }

    if (booking.email) {
      const userEmailContent = buildUserEmail(booking);
      const userResult = await sendResendEmail({
        apiKey: resendApiKey!,
        from: fromAddress,
        to: [booking.email],
        subject: userEmailContent.subject,
        html: userEmailContent.html,
        text: userEmailContent.text,
        replyTo,
      });

      if (userResult.ok) {
        userEmailSent = true;
      } else {
        console.error('User email failed:', userResult.error);
        emailErrors.push('Patient confirmation email could not be delivered.');
      }
    }
  }

  return jsonResponse({
    ok: true,
    appointmentId,
    adminEmailSent,
    userEmailSent,
    emailWarning: emailErrors.length ? emailErrors.join(' ') : undefined,
  });
});
