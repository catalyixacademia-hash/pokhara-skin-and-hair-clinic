import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  address,
  formatPhoneDisplay,
  getPhone,
  hours,
  phones,
  phoneHref,
} from '../data/clinic';
import { isPastDate, todayISODate } from '../lib/dates';
import { submitAppointment } from '../lib/submit-appointment';
import { openAppointmentWhatsApp, buildWhatsAppHref } from '../lib/whatsapp';
import { getClinicOpenStatus } from '../lib/open-status';
import { useTreatmentOptions } from '../hooks/useTreatmentOptions';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import FormField from './ui/FormField';
import DatePicker from './ui/DatePicker';
import TreatmentSelect from './ui/TreatmentSelect';
import Reveal from './motion/Reveal';
import { cn } from '../utils/cn';

type FormMode = 'booking' | 'ask';

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
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<FormMode>('booking');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [openStatus, setOpenStatus] = useState(() => getClinicOpenStatus());
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

  useEffect(() => {
    const syncMode = () => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (hash === 'enquiry') setMode('ask');
      if (hash === 'contact') setMode('booking');
    };
    syncMode();
    window.addEventListener('hashchange', syncMode);
    return () => window.removeEventListener('hashchange', syncMode);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setOpenStatus(getClinicOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

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

    if (mode === 'booking' && formData.date && isPastDate(formData.date, todayISODate())) {
      setDateError('Please choose today or a future date.');
      setSubmitError('Preferred date cannot be in the past.');
      setSubmitting(false);
      return;
    }

    const payload =
      mode === 'booking'
        ? { ...formData, formType: 'booking' as const }
        : {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            treatment: formData.treatment,
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
    setDateError(null);
    setTimeout(() => {
      setSubmitted(false);
      setUserEmailSent(false);
      setEmailWarning(null);
    }, 8000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  const waHref = buildWhatsAppHref(
    settings.social.whatsappFloatNumber,
    'Hello, I just submitted a request on the website.',
  );

  const switchMode = (next: FormMode) => {
    setMode(next);
    history.replaceState(null, '', next === 'ask' ? '#enquiry' : '#contact');
  };

  return (
    <>
      <section id="contact" className="bg-surface section-padding" aria-labelledby="contact-heading">
        <span id="enquiry" className="sr-only" />
        <Container>
          <Reveal>
            <SectionIntro
              index="10"
              title={mode === 'booking' ? 'Book your visit' : 'Ask a question'}
              titleId="contact-heading"
              lede={
                mode === 'booking'
                  ? 'Request an appointment and we will confirm by phone or WhatsApp within 24 hours.'
                  : 'General enquiries about treatments, pricing, or hours — no appointment required.'
              }
            />
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16">
            <Reveal delay={0.05} direction="left">
              <div className="form-card">
                <LayoutGroup>
                  <div className="form-mode-toggle" role="tablist" aria-label="Form type">
                    {(['booking', 'ask'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        role="tab"
                        aria-selected={mode === m}
                        className={cn(
                          'form-mode-toggle__btn',
                          mode === m && 'form-mode-toggle__btn--active',
                        )}
                        onClick={() => switchMode(m)}
                      >
                        {mode === m && !prefersReducedMotion && (
                          <motion.span
                            layoutId="form-mode-pill"
                            className="form-mode-toggle__pill"
                            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                          />
                        )}
                        {mode === m && prefersReducedMotion && (
                          <span className="form-mode-toggle__pill" />
                        )}
                        {m === 'booking' ? 'Book a visit' : 'Ask a question'}
                      </button>
                    ))}
                  </div>
                </LayoutGroup>

                {submitted ? (
                  <div className="form-success" role="status" aria-live="polite">
                    <div className="success-check" aria-hidden="true">
                      ✓
                    </div>
                    <h3 className="font-display text-h3 text-ink">
                      {mode === 'booking' ? 'Request received' : 'Enquiry received'}
                    </h3>
                    <p className="font-body text-muted">
                      We&apos;ll call you within 24 hours.
                      <span className="block mt-2">
                        WhatsApp opened with your details — tap Send to message the clinic.
                      </span>
                      {userEmailSent && (
                        <span className="block mt-2">
                          A confirmation email has been sent to your inbox.
                        </span>
                      )}
                      {emailWarning && !userEmailSent && (
                        <span className="block mt-2 text-sm">
                          Your request is saved. We could not send a confirmation email right now,
                          but the clinic has your details.
                        </span>
                      )}
                    </p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-whatsapp mt-4 inline-flex"
                    >
                      Open WhatsApp again
                    </a>
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

                    {mode === 'booking' ? (
                      <>
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
                      </>
                    ) : (
                      <FormField label="Topic" htmlFor="visit-topic" required>
                        <input
                          id="visit-topic"
                          type="text"
                          name="treatment"
                          value={formData.treatment}
                          onChange={handleChange}
                          required
                          className="field-input"
                          placeholder="e.g. Acne, Hair loss, Pricing"
                        />
                      </FormField>
                    )}

                    <FormField
                      label={mode === 'booking' ? 'Your message or concern' : 'Your question'}
                      htmlFor="visit-message"
                      required={mode === 'ask'}
                    >
                      <textarea
                        id="visit-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required={mode === 'ask'}
                        rows={4}
                        className="field-textarea"
                        placeholder={
                          mode === 'booking'
                            ? 'Tell us about your skin or hair concern…'
                            : 'Describe your concern or question…'
                        }
                      />
                    </FormField>

                    {submitError && (
                      <p className="form-error" role="alert">
                        {submitError}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <button type="submit" disabled={submitting} className="btn-primary">
                        {submitting
                          ? mode === 'booking'
                            ? 'Submitting…'
                            : 'Sending…'
                          : mode === 'booking'
                            ? 'Request appointment'
                            : 'Send enquiry'}
                      </button>
                      <p className="font-body text-caption text-muted">
                        {mode === 'booking'
                          ? 'No payment required. We confirm every request by phone or WhatsApp.'
                          : 'We typically reply within one business day.'}
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal className="space-y-8 md:space-y-10" delay={0.1} direction="right">
              <div className="info-panel">
                <h3 className="font-display text-h3 text-ink mb-4">Contact</h3>
                <p className="font-body text-base text-muted mb-4">
                  {address.line1}
                  <br />
                  Opposite of GMC Hospital
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
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="font-display text-h3 text-ink">Opening hours</h3>
                  <span
                    className={cn(
                      'open-badge',
                      !openStatus.open && 'open-badge--closed',
                    )}
                  >
                    <span className="open-badge__dot" aria-hidden="true" />
                    {openStatus.label}
                  </span>
                </div>
                <p className="font-body text-base text-ink font-semibold">
                  Every day · {hours.daily}
                </p>
                <p className="font-body text-caption text-muted mt-2">{hours.saturdayNote}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section
        id="location"
        className="bg-surface-container-low section-padding-sm"
        aria-labelledby="location-heading"
      >
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <span className="section-label">Location</span>
              <h2 id="location-heading" className="font-display text-h3 text-ink mt-2">
                Find the clinic
              </h2>
            </div>
            <a
              href={settings.maps.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-11 text-label text-accent hover:underline underline-offset-4"
            >
              Open in Google Maps
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="map-facade">
            {mapLoaded ? (
              <iframe
                src={settings.maps.embedUrl}
                title="Pokhara Skin and Hair Clinic location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className="map-facade__btn"
                onClick={() => setMapLoaded(true)}
              >
                <span className="text-h3 font-display">Open interactive map</span>
                <span className="text-sm opacity-80">Loads Google Maps when you tap</span>
              </button>
            )}
          </div>

          <p className="font-body text-base text-muted mt-4">
            {address.line1} · {address.area} · Pokhara, Nepal
          </p>
        </Container>
      </section>
    </>
  );
}
