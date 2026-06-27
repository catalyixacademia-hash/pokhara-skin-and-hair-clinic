import { useState } from 'react';
import { submitAppointment } from '../lib/submit-appointment';
import { address, landmarks, maps } from '../data/clinic';
import Container from './ui/Container';
import FormField from './ui/FormField';
import Reveal from './motion/Reveal';

export default function GeneralEnquiry() {
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

    const result = await submitAppointment({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      treatment: formData.topic,
      message: formData.message,
      formType: 'general_query',
    });

    if (!result.ok) {
      setSubmitError(result.error);
      setSubmitting(false);
      return;
    }

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
    <section id="enquiry" className="bg-accent-soft section-padding border-t border-line">
      <Container>
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Left Column: Map & Location */}
          <Reveal className="lg:col-span-2 space-y-6" delay={0.05}>
            <div id="location" className="h-full">
              <p className="mono-label mb-3">Location</p>
              <h3 className="font-display text-h2 text-ink mb-2">Find the clinic</h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                {address.line1} · {address.area}
                <br />
                Opposite GMC Hospital Gate · Pokhara, Nepal
              </p>

              <div className="map-frame aspect-[4/3] -mx-4 sm:mx-0 mb-6 shadow-sm">
                <iframe
                  src={maps.embedUrl}
                  title="Pokhara Skin and Hair Clinic location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <ul className="space-y-2 mb-6">
                {landmarks.map((landmark) => (
                  <li key={landmark} className="font-body text-sm text-muted flex gap-2">
                    <span className="text-accent shrink-0">—</span>
                    {landmark}
                  </li>
                ))}
              </ul>

              <a
                href={maps.openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center text-sm w-full sm:w-auto text-center justify-center"
              >
                Open in Google Maps →
              </a>
            </div>
          </Reveal>

          {/* Right Column: General Enquiry Form */}
          <Reveal className="lg:col-span-3" delay={0.10}>
            <div>
              <p className="mono-label mb-3">Inquiries</p>
              <h3 className="font-display text-h2 text-ink mb-2">Have a question?</h3>
              <p className="font-body text-sm text-muted leading-relaxed mb-6">
                General enquiries about treatments, pricing, or hours — no appointment required.
              </p>

              <div className="booking-form-panel">
                {submitted ? (
                  <div className="py-4">
                    <h3 className="font-display text-h3 text-ink mb-2">Enquiry received</h3>
                    <p className="font-body text-muted">
                      Thank you. Our care team will review your message and contact you within 24 hours.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="field-input"
                        />
                      </FormField>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField label="Email" htmlFor="enquiry-email">
                        <input
                          id="enquiry-email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                          className="field-input"
                          placeholder="Optional"
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
                          placeholder="e.g. Acne, hair loss, pricing"
                        />
                      </FormField>
                    </div>

                    <FormField label="Your question" htmlFor="enquiry-message" required>
                      <textarea
                        id="enquiry-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="field-textarea"
                        placeholder="Describe your concern or question…"
                      />
                    </FormField>

                    {submitError && (
                      <p className="text-sm text-[var(--color-error)]" role="alert">
                        {submitError}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                      <button type="submit" disabled={submitting} className="btn-primary sm:w-auto disabled:opacity-60">
                        {submitting ? 'Sending…' : 'Send enquiry'}
                      </button>
                      <p className="font-body text-xs text-muted">We typically reply within one business day.</p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
