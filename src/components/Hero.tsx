import { motion, useReducedMotion } from 'framer-motion';
import { address, clinic, hours } from '../data/clinic';
import Container from './ui/Container';

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const stagger = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-media absolute inset-0 z-0">
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/images/hero/clinic-hero@1920.jpg?v=5"
            width={1920}
            height={1080}
          />
          {/*
            Below 1024px the 44KB WebP is served instead of the 130KB PNG. The
            PNG stays as the final fallback for browsers without WebP support.
          */}
          <source
            srcSet="/images/hero/clinic-hero.webp?v=5"
            type="image/webp"
            width={1024}
            height={576}
          />
          <img
            src="/images/hero/clinic-hero.png?v=5"
            alt={`${clinic.nameShort} exterior — Nayabazar-8, opposite GMC Hospital, Pokhara`}
            className="hero-bg-image h-full w-full"
            width={1024}
            height={576}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      <Container className="hero-shell">
        <div className="hero-bottom-band">
          <motion.div
            className="hero-main-card"
            {...stagger}
            transition={{ ...stagger.transition, delay: 0 }}
          >
            <div className="hero-eyebrow">
              <p className="hero-brand">{clinic.nameShort}</p>
              <p className="hero-cert-bar">
                <ShieldIcon />
                <span>Board certified dermatology</span>
              </p>
            </div>

            <h1 id="hero-heading" className="hero-main-card__title">
              Dermatologist-led skin &amp; hair care in Pokhara
            </h1>

            <p className="hero-main-card__lede">
              Evidence-based dermatology, hair restoration, and aesthetic treatment — opposite of GMC
              Hospital, Nayabazar-8.
            </p>

            <div className="hero-cta-row">
              <button type="button" onClick={() => scrollTo('#contact')} className="btn-primary">
                Book appointment
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#services')}
                className="btn-secondary-outline"
              >
                View treatments
              </button>
            </div>
          </motion.div>

          <motion.aside
            className="hero-info-card"
            aria-label="Clinic hours and location"
            {...stagger}
            transition={{ ...stagger.transition, delay: 0.12 }}
          >
            <div className="hero-info-card__row">
              <span className="hero-info-card__icon hero-info-card__icon--accent">
                <PinIcon />
              </span>
              <div className="hero-info-card__body">
                <p className="hero-info-card__label">Location</p>
                <p className="hero-info-card__value">{address.line1}</p>
                <p className="hero-info-card__note">{address.landmark}</p>
              </div>
            </div>

            <div className="hero-info-card__divider" aria-hidden="true" />

            <div className="hero-info-card__row">
              <span className="hero-info-card__icon hero-info-card__icon--warm">
                <ClockIcon />
              </span>
              <div className="hero-info-card__body">
                <p className="hero-info-card__label">Opening hours</p>
                <p className="hero-info-card__value">{hours.summary}</p>
                <p className="hero-info-card__note">{hours.saturdayNote}</p>
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
