import { useState } from 'react';
import { submitAppointment } from '../lib/submit-appointment';
import Container from './ui/Container';
import SectionHeader from './ui/SectionHeader';

function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="section-label block mb-1.5">{children}</label>;
}

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
    <section id="enquiry" className="bg-paper section-padding border-t border-line">
      <Container>
        <div className="max-w-3xl">
          <SectionHeader
            label="Have a question?"
            title="Ask us anything"
            lede="General enquiries about treatments, pricing, or clinic hours — no appointment booking required."
            className="mb-8"
          />

          <div className="booking-form-panel">
            {submitted ? (
              <div className="text-center py-4 md:py-6">
                <h3 className="font-serif text-2xl text-ink mb-2">Enquiry received</h3>
                <p className="font-sans text-muted">
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
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <FormLabel>Full name *</FormLabel>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="premium-input"
                    />
                  </div>
                  <div>
                    <FormLabel>Phone *</FormLabel>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      autoComplete="tel"
                      className="premium-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                  <div>
                    <FormLabel>Email</FormLabel>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      className="premium-input"
                      placeholder="Optional — for a reply confirmation"
                    />
                  </div>
                  <div>
                    <FormLabel>Topic *</FormLabel>
                    <input
                      type="text"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      className="premium-input"
                      placeholder="e.g. Acne, hair loss, pricing…"
                    />
                  </div>
                </div>

                <div>
                  <FormLabel>Your question *</FormLabel>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="premium-input premium-input--compact resize-none"
                    placeholder="Describe your concern or question…"
                  />
                </div>

                {submitError && <p className="text-sm text-red-700">{submitError}</p>}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                  <button type="submit" disabled={submitting} className="btn-primary sm:w-auto disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send enquiry'}
                  </button>
                  <p className="font-sans text-xs text-muted leading-relaxed">
                    We typically reply within one business day.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
