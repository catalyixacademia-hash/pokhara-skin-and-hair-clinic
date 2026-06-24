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
}): Promise<void> {
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
    throw new Error(`Resend API error (${response.status}): ${errorBody}`);
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

  if (!resendApiKey || !fromEmail || !adminEmail || !supabaseUrl || !serviceRoleKey) {
    return jsonResponse(
      {
        error:
          'Server email configuration is incomplete. Set RESEND_API_KEY, RESEND_FROM_EMAIL, ADMIN_NOTIFICATION_EMAIL, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY.',
      },
      500,
    );
  }

  const fromAddress = `Pokhara Skin & Hair Clinic <${fromEmail}>`;

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

  try {
    const adminEmailContent = buildAdminEmail(booking, appointmentId);
    await sendResendEmail({
      apiKey: resendApiKey,
      from: fromAddress,
      to: [adminEmail],
      subject: adminEmailContent.subject,
      html: adminEmailContent.html,
      text: adminEmailContent.text,
      replyTo: booking.email ? [booking.email] : replyTo,
    });

    let userEmailSent = false;
    if (booking.email) {
      const userEmailContent = buildUserEmail(booking);
      await sendResendEmail({
        apiKey: resendApiKey,
        from: fromAddress,
        to: [booking.email],
        subject: userEmailContent.subject,
        html: userEmailContent.html,
        text: userEmailContent.text,
        replyTo,
      });
      userEmailSent = true;
    }

    return jsonResponse({
      ok: true,
      appointmentId,
      userEmailSent,
      adminEmailSent: true,
    });
  } catch (error) {
    console.error('Email send failed:', error);
    return jsonResponse(
      {
        error: 'Appointment saved but confirmation emails could not be sent. Please call the clinic.',
        appointmentId,
      },
      502,
    );
  }
});
