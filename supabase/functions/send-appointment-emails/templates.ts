export type FormType = 'booking' | 'general_query';

export type AppointmentBooking = {
  name: string;
  phone: string;
  email?: string | null;
  treatment: string;
  date?: string | null;
  message?: string | null;
  formType?: FormType;
};

const BRAND = {
  name: 'Pokhara Skin & Hair Clinic',
  tagline: 'Advanced dermatology & hair restoration',
  address: 'Nayabazar-8, Pokhara',
  landmark: 'Opposite GMC Hospital Gate',
  phone: '+977 970-6929329',
  appointmentsPhone: '+977 984-5815246',
  hours: 'Daily 8:00 AM – 7:00 PM',
  siteUrl: 'https://pokhara-skin-and-hair-clinic.vercel.app',
  whatsappUrl: 'https://wa.me/9779706929329',
  doctor: 'Dr. Prakash Acharya, MD',
} as const;

const C = {
  paper: '#FBFBFA',
  ink: '#1C1C1A',
  muted: '#5C5C57',
  line: '#E8E8E4',
  accent: '#7A4E3B',
  accentSoft: '#F4EFEB',
  adminBg: '#1C1C1A',
  adminCard: '#262624',
  adminBorder: '#3A3A36',
  adminMuted: '#A8A8A2',
} as const;

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Flexible — we will suggest times';
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName;
}

function hasMessage(booking: AppointmentBooking): boolean {
  return Boolean(booking.message?.trim());
}

function formLabel(formType: FormType): string {
  return formType === 'general_query' ? 'General enquiry' : 'Appointment request';
}

function userDetailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid ${C.line};background:${C.paper};color:${C.muted};font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:14px 18px;border-bottom:1px solid ${C.line};background:${C.paper};color:${C.ink};font-size:15px;line-height:1.5;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function adminDetailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid ${C.adminBorder};color:${C.adminMuted};font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid ${C.adminBorder};color:${C.paper};font-size:15px;line-height:1.5;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

function patientMessageBlock(message: string, variant: 'user' | 'admin'): string {
  const text = escapeHtml(message.trim());
  if (variant === 'user') {
    return `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 8px;">
        <tr>
          <td style="padding:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};font-weight:600;">Your message to the clinic</td>
        </tr>
        <tr>
          <td style="padding:20px 22px;background:${C.accentSoft};border-left:4px solid ${C.accent};border-radius:0 8px 8px 0;">
            <p style="margin:0;font-size:15px;line-height:1.75;color:${C.ink};font-style:italic;">&ldquo;${text}&rdquo;</p>
          </td>
        </tr>
      </table>`;
  }

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 8px;">
      <tr>
        <td style="padding:0 0 10px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C4B8A8;font-weight:600;">Patient query / concern</td>
      </tr>
      <tr>
        <td style="padding:22px 24px;background:${C.adminBg};border:1px solid ${C.accent};border-radius:8px;">
          <p style="margin:0;font-size:16px;line-height:1.75;color:${C.paper};">&ldquo;${text}&rdquo;</p>
        </td>
      </tr>
    </table>`;
}

function emptyMessageNote(variant: 'user' | 'admin'): string {
  if (variant === 'user') {
    return `<p style="margin:20px 0 0;font-size:13px;color:${C.muted};">No additional message was provided.</p>`;
  }
  return `<p style="margin:16px 0 0;font-size:13px;color:${C.adminMuted};">No patient message was included with this request.</p>`;
}

function userNextSteps(): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
      <tr><td style="padding:0 0 14px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};font-weight:600;">What happens next</td></tr>
      <tr>
        <td>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.accentSoft};border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:16px 18px;border-bottom:1px solid ${C.line};">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.accent};">1 · Review</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};">Our team reviews your request and preferred treatment.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;border-bottom:1px solid ${C.line};">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.accent};">2 · Contact</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};">We call or message you within 24 hours to confirm details.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 18px;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:${C.accent};">3 · Visit</p>
                <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};">Visit the clinic at your confirmed appointment time.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}

function userFooter(): string {
  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;border-top:1px solid ${C.line};">
      <tr>
        <td style="padding:24px 0 8px;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.accent};">Visit us</p>
          <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:${C.ink};">${BRAND.name}</p>
          <p style="margin:0 0 4px;font-size:13px;color:${C.muted};">${BRAND.address} · ${BRAND.landmark}</p>
          <p style="margin:0 0 4px;font-size:13px;color:${C.muted};">${BRAND.phone} · ${BRAND.hours}</p>
          <p style="margin:0;font-size:13px;color:${C.muted};">${BRAND.doctor}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0 24px;">
          <a href="${BRAND.siteUrl}" style="display:inline-block;margin-right:10px;padding:12px 20px;background:${C.ink};color:${C.paper};text-decoration:none;font-size:13px;font-weight:600;border-radius:4px;">Visit website</a>
          <a href="${BRAND.whatsappUrl}" style="display:inline-block;padding:12px 20px;border:1px solid ${C.line};color:${C.ink};text-decoration:none;font-size:13px;font-weight:600;border-radius:4px;">WhatsApp us</a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 8px;">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#8A8A84;">Reply to this email if you need to update your request. We look forward to caring for you.</p>
        </td>
      </tr>
    </table>`;
}

export function buildUserEmail(booking: AppointmentBooking): { subject: string; html: string; text: string } {
  const formType = booking.formType ?? 'booking';
  const preferredDate = formatDate(booking.date);
  const greeting = firstName(booking.name);
  const messageSection = hasMessage(booking)
    ? patientMessageBlock(booking.message!, 'user')
    : emptyMessageNote('user');

  const subject =
    formType === 'general_query'
      ? `We received your enquiry — ${BRAND.name}`
      : `Your appointment request is received — ${BRAND.name}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.accentSoft};font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${C.accentSoft};padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:${C.paper};border:1px solid ${C.line};border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(28,28,26,0.06);">
        <tr>
          <td style="height:5px;background:linear-gradient(90deg,${C.accent} 0%,#9A6B55 100%);font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:36px 32px 24px;">
            <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${C.accent};font-weight:600;">${escapeHtml(BRAND.name)}</p>
            <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:32px;font-weight:400;line-height:1.15;color:${C.ink};">Thank you, ${escapeHtml(greeting)}</h1>
            <table role="presentation" cellspacing="0" cellpadding="0">
              <tr>
                <td style="padding:8px 14px;background:${C.accentSoft};border:1px solid ${C.line};border-radius:999px;font-size:12px;font-weight:600;color:${C.accent};letter-spacing:0.04em;">
                  ✓ ${escapeHtml(formLabel(formType))} received
                </td>
              </tr>
            </table>
            <p style="margin:20px 0 0;font-size:16px;line-height:1.75;color:${C.muted};">
              We have received your ${formType === 'general_query' ? 'enquiry' : 'appointment request'}. Our care team will review everything below and contact you within <strong style="color:${C.ink};">24 hours</strong>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            ${userNextSteps()}
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};font-weight:600;">${formType === 'booking' ? 'Booking details' : 'Your details'}</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${C.line};border-radius:8px;overflow:hidden;">
              ${userDetailRow('Full name', booking.name)}
              ${userDetailRow('Phone', booking.phone)}
              ${userDetailRow('Email', booking.email?.trim() || 'Not provided')}
              ${formType === 'booking' ? userDetailRow('Treatment', booking.treatment) : ''}
              ${formType === 'booking' ? userDetailRow('Preferred date', preferredDate) : userDetailRow('Topic', booking.treatment)}
            </table>
            ${messageSection}
            ${userFooter()}
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-size:11px;color:#8A8A84;text-align:center;">${escapeHtml(BRAND.name)} · ${escapeHtml(BRAND.address)}</p>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Thank you, ${greeting}

Your ${formType === 'general_query' ? 'enquiry' : 'appointment request'} has been received at ${BRAND.name}. We will contact you within 24 hours.

DETAILS
- Name: ${booking.name}
- Phone: ${booking.phone}
- Email: ${booking.email?.trim() || 'Not provided'}
- Treatment/Topic: ${booking.treatment}
- Preferred date: ${preferredDate}
${hasMessage(booking) ? `\nYOUR MESSAGE\n${booking.message}\n` : ''}
CLINIC
${BRAND.address}
${BRAND.phone}
${BRAND.hours}
${BRAND.siteUrl}`;

  return { subject, html, text };
}

export function buildAdminEmail(
  booking: AppointmentBooking,
  appointmentId: string,
): { subject: string; html: string; text: string } {
  const formType = booking.formType ?? 'booking';
  const preferredDate = formatDate(booking.date);
  const submittedAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kathmandu',
  });
  const messageSection = hasMessage(booking)
    ? patientMessageBlock(booking.message!, 'admin')
    : emptyMessageNote('admin');

  const subject =
    formType === 'general_query'
      ? `New patient enquiry — ${booking.name}`
      : `New booking — ${booking.name} · ${booking.treatment}`;

  const phoneDigits = booking.phone.replace(/\D/g, '');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#121211;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#121211;padding:40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${C.adminCard};border:1px solid ${C.adminBorder};border-radius:12px;overflow:hidden;">
        <tr>
          <td style="padding:28px 28px 22px;background:${C.adminBg};border-bottom:3px solid ${C.accent};">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#C4B8A8;font-weight:600;">Clinic inbox · ${escapeHtml(formLabel(formType))}</p>
                  <h1 style="margin:0;font-size:26px;font-weight:600;color:${C.paper};line-height:1.2;">
                    ${formType === 'general_query' ? 'New patient enquiry' : 'New appointment request'}
                  </h1>
                </td>
                <td align="right" valign="top">
                  <span style="display:inline-block;padding:8px 12px;background:${C.accent};color:${C.paper};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;border-radius:4px;">Action needed</span>
                </td>
              </tr>
            </table>
            <p style="margin:14px 0 0;font-size:13px;color:${C.adminMuted};">${escapeHtml(submittedAt)} (Nepal) · Ref <span style="color:${C.paper};font-family:monospace;">${escapeHtml(appointmentId.slice(0, 8))}</span></p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:22px;background:${C.adminBg};border:1px solid ${C.adminBorder};border-radius:8px;">
              <tr>
                <td style="padding:20px 22px;">
                  <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${C.accent};">Patient</p>
                  <p style="margin:0;font-size:24px;font-weight:600;color:${C.paper};">${escapeHtml(booking.name)}</p>
                  ${formType === 'booking' ? `<p style="margin:10px 0 0;font-size:15px;color:#C4B8A8;">Requested: <strong style="color:${C.paper};">${escapeHtml(booking.treatment)}</strong></p>` : ''}
                </td>
              </tr>
            </table>

            <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C4B8A8;font-weight:600;">Submission details</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${C.adminBorder};border-radius:8px;overflow:hidden;margin-bottom:8px;">
              ${adminDetailRow('Phone', booking.phone)}
              ${adminDetailRow('Email', booking.email?.trim() || 'Not provided')}
              ${formType === 'booking' ? adminDetailRow('Treatment', booking.treatment) : adminDetailRow('Topic / interest', booking.treatment)}
              ${formType === 'booking' ? adminDetailRow('Preferred date', preferredDate) : ''}
              ${adminDetailRow('Status', 'Pending review')}
              ${adminDetailRow('Reference', appointmentId)}
            </table>

            ${messageSection}

            <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:28px;">
              <tr>
                <td style="padding-right:8px;">
                  <a href="tel:${escapeHtml(phoneDigits)}" style="display:inline-block;padding:14px 20px;background:${C.accent};color:${C.paper};text-decoration:none;font-size:13px;font-weight:700;border-radius:6px;">Call patient</a>
                </td>
                ${booking.email ? `<td style="padding-right:8px;"><a href="mailto:${escapeHtml(booking.email)}" style="display:inline-block;padding:14px 20px;border:1px solid ${C.adminMuted};color:${C.paper};text-decoration:none;font-size:13px;font-weight:700;border-radius:6px;">Email patient</a></td>` : ''}
                <td>
                  <a href="${BRAND.whatsappUrl}" style="display:inline-block;padding:14px 20px;border:1px solid ${C.adminBorder};color:${C.paper};text-decoration:none;font-size:13px;font-weight:700;border-radius:6px;">WhatsApp</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 24px;border-top:1px solid ${C.adminBorder};background:${C.adminBg};">
            <p style="margin:0;font-size:12px;line-height:1.6;color:${C.adminMuted};">Open the admin appointments inbox to confirm, reschedule, or mark this request as completed.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `NEW ${formType === 'general_query' ? 'ENQUIRY' : 'BOOKING'}
Submitted: ${submittedAt} (Nepal)
Reference: ${appointmentId}

PATIENT: ${booking.name}
Phone: ${booking.phone}
Email: ${booking.email?.trim() || 'Not provided'}
Treatment/Topic: ${booking.treatment}
Preferred date: ${preferredDate}
${hasMessage(booking) ? `\nPATIENT MESSAGE\n${booking.message}\n` : 'No patient message included.\n'}
Status: Pending review`;

  return { subject, html, text };
}
