import { social } from '../data/clinic';
import type { AppointmentFormData } from './submit-appointment';

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function buildWhatsAppHref(phoneDigits: string, text: string): string {
  const digits = digitsOnly(phoneDigits);
  if (!digits) return '#';
  const normalized = digits.startsWith('977') ? digits : `977${digits}`;
  const base = `https://wa.me/${normalized}`;
  if (!text.trim()) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}

function formatPreferredDate(value: string): string {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatAppointmentWhatsAppMessage(data: AppointmentFormData): string {
  const formType = data.formType ?? 'booking';
  const isEnquiry = formType === 'general_query';
  const title = isEnquiry
    ? 'General enquiry — Pokhara Skin and Hair Clinic'
    : 'Appointment request — Pokhara Skin and Hair Clinic';

  const lines = [title, '', `Name: ${data.name.trim()}`, `Phone: ${data.phone.trim()}`];

  if (data.email?.trim()) {
    lines.push(`Email: ${data.email.trim()}`);
  }

  lines.push(
    isEnquiry
      ? `Topic: ${data.treatment.trim()}`
      : `Treatment: ${data.treatment.trim()}`,
  );

  if (!isEnquiry && data.date?.trim()) {
    lines.push(`Preferred date: ${formatPreferredDate(data.date.trim())}`);
  }

  if (data.message?.trim()) {
    lines.push(`Message: ${data.message.trim()}`);
  }

  return lines.join('\n');
}

/** Opens a prefilled chat to the floating WhatsApp number (984515246). */
export function openAppointmentWhatsApp(data: AppointmentFormData): void {
  const message = formatAppointmentWhatsAppMessage(data);
  const href = buildWhatsAppHref(social.whatsappFloat.number, message);
  window.open(href, '_blank', 'noopener,noreferrer');
}
