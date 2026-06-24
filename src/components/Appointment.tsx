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
import { useTreatmentOptions } from '../hooks/useTreatmentOptions';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

function FormLabel({ children }: { children: React.ReactNode }) {
  return <label className="section-label block mb-2">{children}</label>;
}

export default function Appointment() {
  const { treatmentOptions } = useTreatmentOptions();
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitAppointment({ ...formData, formType: 'booking' });

    if (!result.ok) {
      setSubmitError(result.error);
      setSubmitting(false);
      return;
    }

    setUserEmailSent(Boolean(result.userEmailSent));
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => {
      setSubmitted(false);
      setUserEmailSent(false);
    }, 6000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  return (
    <section id="contact" className="bg-accent-soft section-padding border-t border-line">
      <Container>
        <SectionHeader label="Book a visit" title="Request an appointment" className="mb-10" />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="bg-paper border border-line p-8 md:p-10 text-center">
                <h3 className="font-serif text-2xl text-ink mb-2">Request received</h3>
                <p className="font-sans text-muted">
                  Thank you. We will contact you within 24 hours to confirm your appointment.
                  {userEmailSent && (
                    <span className="block mt-2">A confirmation email has been sent to your inbox.</span>
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Full name *</FormLabel>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="premium-input" />
                  </div>
                  <div>
                    <FormLabel>Phone *</FormLabel>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="premium-input" placeholder={formatPhoneDisplay(getPhone('appointments').number)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel>Email</FormLabel>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="premium-input" placeholder="For your confirmation email" />
                  </div>
                  <div>
                    <FormLabel>Treatment *</FormLabel>
                    <select name="treatment" value={formData.treatment} onChange={handleChange} required className="premium-select">
                      <option value="">Select a treatment</option>
                      {treatmentOptions.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <FormLabel>Preferred date</FormLabel>
                  <input type="date" name="date" value={formData.date} onChange={handleChange} className="premium-input" />
                </div>

                <div>
                  <FormLabel>Your message or concern</FormLabel>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="premium-input resize-none" placeholder="Tell us about your skin or hair concern, questions, or preferred timing…" />
                </div>

                {submitError && <p className="text-sm text-red-700">{submitError}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
                    {submitting ? 'Submitting…' : 'Request appointment'}
                  </button>
                  <a href={social.whatsapp.urlWithMessage} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 justify-center">
                    WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>

          <aside className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="font-serif text-xl text-ink mb-4">Contact</h3>
              <p className="font-sans text-sm text-muted mb-1">{address.line1}</p>
              <p className="font-sans text-sm text-muted mb-4">{address.landmark}</p>
              <div className="space-y-2">
                {phones.map((phone) => (
                  <a key={phone.role} href={phoneHref(phone.number)} className="block font-sans text-sm text-ink hover:text-accent">
                    {formatPhoneDisplay(phone.number)} · {phone.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl text-ink mb-4">Hours</h3>
              <div className="space-y-2">
                {clinicHours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm border-b border-line py-2">
                    <span className="text-muted">{h.day}</span>
                    <span className="text-ink">{h.time}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-sm text-muted mt-3">{hours.saturdayNote}</p>
            </div>

            <div className="bg-ink p-6 text-paper">
              <h4 className="font-serif text-lg mb-2">Need help now?</h4>
              <p className="font-sans text-sm text-paper/70 mb-4">Message us on WhatsApp for quick booking.</p>
              <a href={social.whatsapp.url} target="_blank" rel="noopener noreferrer" className="btn-bronze w-full justify-center">
                Chat on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
