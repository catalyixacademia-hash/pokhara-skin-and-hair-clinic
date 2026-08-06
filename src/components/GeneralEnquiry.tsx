import { useState } from 'react';
import { submitAppointment } from '../lib/submit-appointment';
import { openAppointmentWhatsApp } from '../lib/whatsapp';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import FormField from './ui/FormField';
import Reveal from './motion/Reveal';

export default function GeneralEnquiry() {
  const { settings } = useClinicSettings();
  const { address, maps } = settings;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    topic: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [userEmailSent, setUserEmailSent] = useState(false);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      treatment: formData.topic,
      message: formData.message,
      formType: 'general_query' as const,
    };
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
    setTimeout(() => {
      setSubmitted(false);
      setUserEmailSent(false);
      setEmailWarning(null);
    }, 8000);
    setFormData({ name: '', phone: '', email: '', topic: '', message: '' });
  };

  return (
    <section
      id="enquiry"
      className="bg-surface-container-low section-padding"
      aria-labelledby="enquiry-heading"
    >
      <Container>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <Reveal className="lg:col-span-7 space-y-6" delay={0.05}>
            <div id="location">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <span className="section-label">Location</span>
                  <h2 id="enquiry-heading" className="font-display text-h3 text-ink mt-2">
                    Find the clinic
                  </h2>
                </div>
                <a
                  href={maps.openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-11 text-label text-accent hover:underline underline-offset-4"
                >
                  Open in Google Maps
                  <span aria-hidden="true">↗</span>
                </a>
              </div>

              <div className="map-frame h-[280px] sm:h-[380px] lg:h-[450px] bg-surface-container">
                <iframe
                  src={maps.embedUrl}
                  title="Pokhara Skin and Hair Clinic location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <p className="font-body text-base text-muted mt-4">
                {address.line1} · {address.area} · Opposite GMC Hospital Gate · Pokhara, Nepal
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:pl-10 xl:pl-12 lg:border-l border-outline-variant space-y-6" delay={0.1}>
            <div>
              <span className="section-label">Inquiries</span>
              <h2 className="font-display text-h3 text-ink mt-2 mb-2">Have a question?</h2>
              <p className="font-body text-base text-muted leading-relaxed">
                General enquiries about treatments, pricing, or hours — no appointment required.
                To book a visit, use the{' '}
                <button
                  type="button"
                  onClick={() =>
                    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-accent underline underline-offset-4 bg-transparent border-none p-0 cursor-pointer font-inherit"
                >
                  appointment form
                </button>{' '}
                above.
              </p>
            </div>

            {submitted ? (
              <div className="py-4">
                <h3 className="font-display text-h3 text-ink mb-2">Enquiry received</h3>
                <p className="font-body text-muted">
                  Thank you. Our care team will review your message and contact you within 24 hours.
                  <span className="block mt-2">
                    WhatsApp opened with your details — tap Send to message the clinic.
                  </span>
                  {userEmailSent && (
                    <span className="block mt-2">A confirmation email has been sent to your inbox.</span>
                  )}
                  {emailWarning && !userEmailSent && (
                    <span className="block mt-2 text-sm">
                      Your enquiry is saved. We could not send a confirmation email right now, but the
                      clinic has your details.
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/*
                  These fields were previously placeholder-only, which fails
                  WCAG 3.3.2 — the label vanishes the moment the visitor types.
                */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormField label="Full name" htmlFor="enquiry-name" required>
                    <input
                      id="enquiry-name"
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
                  <FormField label="Phone" htmlFor="enquiry-phone" required>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      inputMode="tel"
                      className="field-input"
                      placeholder="98XXXXXXXX"
                    />
                  </FormField>
                </div>

                <FormField label="Email" htmlFor="enquiry-email" hint="Optional — for a written reply.">
                  <input
                    id="enquiry-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className="field-input"
                    placeholder="you@example.com"
                  />
                </FormField>

                <FormField label="Topic" htmlFor="enquiry-topic" required>
                  <input
                    id="enquiry-topic"
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    className="field-input"
                    placeholder="e.g. Acne, Hair loss, Pricing"
                  />
                </FormField>

                <FormField label="Your question" htmlFor="enquiry-message" required>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="field-textarea"
                    placeholder="Describe your concern or question…"
                  />
                </FormField>

                {submitError && (
                  <p className="form-error" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <button type="submit" disabled={submitting} className="btn-form-submit">
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="font-body text-caption text-muted">
                    We typically reply within one business day.
                  </p>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
