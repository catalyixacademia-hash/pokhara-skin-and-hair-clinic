import { useState } from 'react';
import {
  address,
  clinicHours,
  formatPhoneDisplay,
  getPhone,
  hours,
  phones,
  phoneHref,
  social,
} from '../data/clinic';
import { submitAppointment } from '../lib/submit-appointment';
import { openAppointmentWhatsApp } from '../lib/whatsapp';
import { useTreatmentOptions } from '../hooks/useTreatmentOptions';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import FormField from './ui/FormField';
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
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const payload = { ...formData, formType: 'booking' as const };
    const result = await submitAppointment(payload);

    if (!result.ok) {
      setSubmitError(result.error);
      setSubmitting(false);
      return;
    }

    openAppointmentWhatsApp(payload);
    setUserEmailSent(Boolean(result.userEmailSent));
    setEmailWarning(result.emailWarning ?? null);
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => {
      setSubmitted(false);
      setUserEmailSent(false);
      setEmailWarning(null);
    }, 8000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  return (
    <section id="contact" className="bg-surface-container-low section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="06"
            title="Visit the clinic"
            lede="Request an appointment or find us opposite GMC Hospital, Nayabazar-8."
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-20">
          <Reveal delay={0.05}>
            <div className="form-card">
              {submitted ? (
                <div className="py-4">
                  <h3 className="font-display text-h3 text-ink mb-2">Request received</h3>
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

                  <FormField label="Preferred date" htmlFor="visit-date">
                    <input
                      id="visit-date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="field-input"
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
                    <p className="text-sm text-[var(--color-error)]" role="alert">
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-form-submit flex-1 disabled:opacity-60"
                    >
                      {submitting ? 'Submitting…' : 'Request appointment'}
                    </button>
                    <a
                      href={social.whatsapp.urlWithMessage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp flex-1 text-center"
                    >
                      WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal className="space-y-12" delay={0.1}>
            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink">Contact</h3>
              <p className="font-body text-base text-muted">
                {address.line1}
                <br />
                {address.landmark}
              </p>
              <div className="space-y-2">
                {phones.map((phone) => (
                  <a
                    key={phone.role}
                    href={phoneHref(phone.number)}
                    className="flex items-center gap-3 font-body text-base text-muted hover:text-accent"
                  >
                    <span className="text-accent">
                      <CallIcon />
                    </span>
                    {formatPhoneDisplay(phone.number)} · {phone.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-display text-xl text-ink">Hours</h3>
              <div>
                {clinicHours.map((h) => (
                  <div key={h.day} className="hours-row">
                    <span className="font-body text-base text-muted">{h.day}</span>
                    <span className="text-label text-ink">{h.time}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-caption text-accent">{hours.saturdayNote}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
