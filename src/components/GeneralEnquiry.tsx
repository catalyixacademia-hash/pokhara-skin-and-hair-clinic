import { useState } from 'react';
import { submitAppointment } from '../lib/submit-appointment';
import { openAppointmentWhatsApp } from '../lib/whatsapp';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
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
    <section id="enquiry" className="bg-surface section-padding border-t border-outline-variant">
      <Container>
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <Reveal className="lg:col-span-7 space-y-6" delay={0.05}>
            <div id="location">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                  <span className="section-label">Location</span>
                  <h3 className="font-display text-2xl text-ink mt-2">Find the clinic</h3>
                </div>
                <a
                  href={maps.openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-label text-accent inline-flex items-center gap-2 hover:gap-3 transition-all"
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

          <Reveal className="lg:col-span-5 lg:pl-12 lg:border-l border-outline-variant space-y-6" delay={0.1}>
            <div>
              <span className="section-label">Inquiries</span>
              <h3 className="font-display text-2xl text-ink mt-2 mb-2">Have a question?</h3>
              <p className="font-body text-base text-muted leading-relaxed">
                General enquiries about treatments, pricing, or hours — no appointment required.
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="field-input"
                    placeholder="Full name *"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    autoComplete="tel"
                    className="field-input"
                    placeholder="Phone *"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="field-input"
                  placeholder="Email"
                />
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  required
                  className="field-input"
                  placeholder="Topic (e.g. Acne, Hair loss, Pricing)"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="field-textarea"
                  placeholder="Describe your concern or question…"
                />

                {submitError && (
                  <p className="text-sm text-[var(--color-error)]" role="alert">
                    {submitError}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <button type="submit" disabled={submitting} className="btn-form-submit disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="font-body text-caption text-muted italic">
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
