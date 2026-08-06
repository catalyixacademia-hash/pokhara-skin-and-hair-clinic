import { useState } from 'react';
import {
  address,
  clinicHours,
  formatPhoneDisplay,
  getPhone,
  hours,
  phones,
  phoneHref,
} from '../data/clinic';
import { isPastDate, todayISODate } from '../lib/dates';
import { submitAppointment } from '../lib/submit-appointment';
import { openAppointmentWhatsApp } from '../lib/whatsapp';
import { useTreatmentOptions } from '../hooks/useTreatmentOptions';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import FormField from './ui/FormField';
import DatePicker from './ui/DatePicker';
import TreatmentSelect from './ui/TreatmentSelect';
import Reveal from './motion/Reveal';

function CallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Visit() {
  const { treatmentGroups, loading: treatmentsLoading } = useTreatmentOptions();
  const { settings } = useClinicSettings();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [userEmailSent, setUserEmailSent] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const minDate = todayISODate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
    if (date && isPastDate(date, minDate)) {
      setDateError('Please choose today or a future date.');
      return;
    }
    setDateError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    if (formData.date && isPastDate(formData.date, todayISODate())) {
      setDateError('Please choose today or a future date.');
      setSubmitError('Preferred date cannot be in the past.');
      setSubmitting(false);
      return;
    }

    const payload = { ...formData, formType: 'booking' as const };
    const result = await submitAppointment(payload);

    if (!result.ok) {
      setSubmitError(result.error);
      setSubmitting(false);
      return;
    }

    openAppointmentWhatsApp(payload, settings.social.whatsappFloatNumber);
    setUserEmailSent(Boolean(result.userEmailSent));
    setEmailWarning(result.emailWarning ?? null);
    setSubmitted(true);
    setSubmitting(false);
    setDateError(null);
    setTimeout(() => {
      setSubmitted(false);
      setUserEmailSent(false);
      setEmailWarning(null);
    }, 8000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  return (
    <section id="contact" className="bg-surface-container-low section-padding" aria-labelledby="contact-heading">
      <Container>
        <Reveal>
          <SectionIntro
            index="10"
            title="Book your visit"
            titleId="contact-heading"
            lede="Request an appointment and we will confirm by phone or WhatsApp within 24 hours."
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-20">
          <Reveal delay={0.05}>
            <div className="form-card">
              {submitted ? (
                <div className="form-success" role="status" aria-live="polite">
                  <h3 className="font-display text-h3 text-ink">Request received</h3>
                  <p className="font-body text-muted">
                    Thank you. We will contact you within 24 hours to confirm your appointment.
                    <span className="block mt-2">
                      WhatsApp opened with your details — tap Send to message the clinic.
                    </span>
                    {userEmailSent && (
                      <span className="block mt-2">A confirmation email has been sent to your inbox.</span>
                    )}
                    {emailWarning && !userEmailSent && (
                      <span className="block mt-2 text-sm">
                        Your request is saved. We could not send a confirmation email right now, but the
                        clinic has your details.
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Full name" htmlFor="visit-name" required>
                      <input
                        id="visit-name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="field-input"
                        placeholder="Your name"
                      />
                    </FormField>
                    <FormField label="Phone" htmlFor="visit-phone" required>
                      <input
                        id="visit-phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        autoComplete="tel"
                        className="field-input"
                        placeholder={formatPhoneDisplay(getPhone('appointments').number)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Email" htmlFor="visit-email">
                      <input
                        id="visit-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="field-input"
                        placeholder="For confirmation email"
                      />
                    </FormField>
                    <FormField
                      label="Treatment"
                      htmlFor="treatment"
                      required
                      hint="Grouped by specialty — we will confirm during your call."
                    >
                      <TreatmentSelect
                        name="treatment"
                        value={formData.treatment}
                        onChange={handleChange}
                        groups={treatmentGroups}
                        loading={treatmentsLoading}
                      />
                    </FormField>
                  </div>

                  <FormField
                    label="Preferred date"
                    htmlFor="visit-date"
                    hint="Today or a future date only."
                    error={dateError ?? undefined}
                  >
                    <DatePicker
                      id="visit-date"
                      name="date"
                      value={formData.date}
                      onChange={handleDateChange}
                      minDate={minDate}
                    />
                  </FormField>

                  <FormField label="Your message or concern" htmlFor="visit-message">
                    <textarea
                      id="visit-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="field-textarea"
                      placeholder="Tell us about your skin or hair concern…"
                    />
                  </FormField>

                  {submitError && (
                    <p className="form-error" role="alert">
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <button type="submit" disabled={submitting} className="btn-primary">
                      {submitting ? 'Submitting…' : 'Request appointment'}
                    </button>
                    <p className="font-body text-caption text-muted">
                      No payment required. We confirm every request by phone or WhatsApp.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal className="space-y-8 md:space-y-10" delay={0.1}>
            <div className="info-panel">
              <h3 className="font-display text-h3 text-ink mb-4">Contact</h3>
              <p className="font-body text-base text-muted mb-4">
                {address.line1}
                <br />
                {address.landmark}
              </p>
              <ul className="contact-list">
                {phones.map((phone) => (
                  <li key={phone.role}>
                    <a href={phoneHref(phone.number)} className="contact-list__link">
                      <span className="contact-list__icon" aria-hidden="true">
                        <CallIcon />
                      </span>
                      <span className="min-w-0">
                        <span className="contact-list__number">
                          {formatPhoneDisplay(phone.number)}
                        </span>
                        <span className="contact-list__role">{phone.label}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="info-panel">
              <h3 className="font-display text-h3 text-ink mb-4">Opening hours</h3>
              <div>
                {clinicHours.map((h) => (
                  <div key={h.day} className="hours-row">
                    <span className="font-body text-base text-muted">{h.day}</span>
                    <span className="text-label text-ink">{h.time}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-caption text-accent mt-4">{hours.saturdayNote}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
