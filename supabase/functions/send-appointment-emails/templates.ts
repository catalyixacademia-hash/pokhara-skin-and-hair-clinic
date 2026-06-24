export type AppointmentBooking = {
  name: string;
  phone: string;
  email?: string | null;
  treatment: string;
  date?: string | null;
  message?: string | null;
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value: string | null | undefined): string {
  if (!value) return 'Not specified';
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #E8E8E4;color:#5C5C57;font-size:13px;width:38%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 0;border-bottom:1px solid #E8E8E4;color:#1C1C1A;font-size:14px;font-weight:500;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}

const CLINIC_NAME = 'Pokhara Skin & Hair Clinic';
const CLINIC_ADDRESS = 'Nayabazar-8, Pokhara · Opposite GMC Hospital Gate';
const CLINIC_PHONE = '+977 970-6929329';
const CLINIC_HOURS = 'Daily 8:00 AM – 7:00 PM';

export function buildUserEmail(booking: AppointmentBooking): { subject: string; html: string; text: string } {
  const subject = `Appointment request received — ${CLINIC_NAME}`;
  const preferredDate = formatDate(booking.date);
  const concern = booking.message?.trim() || 'Not provided';

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F4EFEB;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4EFEB;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FBFBFA;border:1px solid #E8E8E4;">
        <tr>
          <td style="padding:36px 32px 28px;border-bottom:1px solid #E8E8E4;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7A4E3B;">Appointment confirmation</p>
            <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:400;line-height:1.2;color:#1C1C1A;">Thank you, ${escapeHtml(booking.name)}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#5C5C57;">
              We have received your appointment request. Our team will review your details and contact you within <strong style="color:#1C1C1A;">24 hours</strong> to confirm your visit.
            </p>
            <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7A4E3B;">Your request details</p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
              ${detailRow('Full name', booking.name)}
              ${detailRow('Phone', booking.phone)}
              ${detailRow('Email', booking.email?.trim() || 'Not provided')}
              ${detailRow('Treatment', booking.treatment)}
              ${detailRow('Preferred date', preferredDate)}
              ${detailRow('Your concern', concern)}
            </table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4EFEB;border:1px solid #E8E8E4;">
              <tr>
                <td style="padding:20px 22px;">
                  <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7A4E3B;">Clinic information</p>
                  <p style="margin:0 0 4px;font-size:14px;color:#1C1C1A;font-weight:600;">${CLINIC_NAME}</p>
                  <p style="margin:0 0 4px;font-size:13px;color:#5C5C57;">${CLINIC_ADDRESS}</p>
                  <p style="margin:0 0 4px;font-size:13px;color:#5C5C57;">${CLINIC_PHONE}</p>
                  <p style="margin:0;font-size:13px;color:#5C5C57;">${CLINIC_HOURS}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 28px;border-top:1px solid #E8E8E4;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#8A8A84;">
              If you need to update your request, reply to this email or call us directly.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `Thank you, ${booking.name}

We have received your appointment request at ${CLINIC_NAME}. Our team will contact you within 24 hours to confirm your visit.

YOUR REQUEST DETAILS
- Name: ${booking.name}
- Phone: ${booking.phone}
- Email: ${booking.email?.trim() || 'Not provided'}
- Treatment: ${booking.treatment}
- Preferred date: ${preferredDate}
- Your concern: ${concern}

CLINIC INFORMATION
${CLINIC_ADDRESS}
${CLINIC_PHONE}
${CLINIC_HOURS}`;

  return { subject, html, text };
}

export function buildAdminEmail(
  booking: AppointmentBooking,
  appointmentId: string,
): { subject: string; html: string; text: string } {
  const subject = `New booking request — ${booking.name} · ${booking.treatment}`;
  const preferredDate = formatDate(booking.date);
  const concern = booking.message?.trim() || 'Not provided';
  const submittedAt = new Date().toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kathmandu',
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#1C1C1A;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#1C1C1A;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#262624;border:1px solid #3A3A36;">
        <tr>
          <td style="padding:24px 28px;background:#1C1C1A;border-bottom:3px solid #7A4E3B;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C4B8A8;">Admin notification</p>
            <h1 style="margin:0;font-size:22px;font-weight:600;color:#FBFBFA;">New appointment request</h1>
            <p style="margin:8px 0 0;font-size:13px;color:#A8A8A2;">Submitted ${escapeHtml(submittedAt)} (Nepal time) · ID ${escapeHtml(appointmentId)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:20px;">
              <tr>
                <td style="padding:14px 16px;background:#1C1C1A;border:1px solid #3A3A36;">
                  <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#7A4E3B;">Patient</p>
                  <p style="margin:0;font-size:20px;font-weight:600;color:#FBFBFA;">${escapeHtml(booking.name)}</p>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
              ${adminRow('Phone', booking.phone)}
              ${adminRow('Email', booking.email?.trim() || 'Not provided')}
              ${adminRow('Treatment requested', booking.treatment)}
              ${adminRow('Preferred date', preferredDate)}
              ${adminRow('Patient concern', concern)}
              ${adminRow('Status', 'Pending review')}
            </table>
            <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top:24px;">
              <tr>
                <td style="padding-right:10px;">
                  <a href="tel:${escapeHtml(booking.phone)}" style="display:inline-block;padding:12px 18px;background:#7A4E3B;color:#FBFBFA;text-decoration:none;font-size:13px;font-weight:600;">Call patient</a>
                </td>
                <td>
                  ${booking.email ? `<a href="mailto:${escapeHtml(booking.email)}" style="display:inline-block;padding:12px 18px;border:1px solid #5C5C57;color:#FBFBFA;text-decoration:none;font-size:13px;font-weight:600;">Email patient</a>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 28px 24px;border-top:1px solid #3A3A36;">
            <p style="margin:0;font-size:12px;color:#8A8A84;">Review and update status in the admin appointments inbox.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `NEW APPOINTMENT REQUEST
Submitted: ${submittedAt} (Nepal time)
ID: ${appointmentId}

PATIENT: ${booking.name}
Phone: ${booking.phone}
Email: ${booking.email?.trim() || 'Not provided'}
Treatment: ${booking.treatment}
Preferred date: ${preferredDate}
Concern: ${concern}
Status: Pending review`;

  return { subject, html, text };
}

function adminRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #3A3A36;color:#A8A8A2;font-size:12px;width:36%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:11px 0;border-bottom:1px solid #3A3A36;color:#FBFBFA;font-size:14px;font-weight:500;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>`;
}
