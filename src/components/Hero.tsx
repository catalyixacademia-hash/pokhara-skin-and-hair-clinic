import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { address, clinic, hours } from '../data/clinic';
import { scrollToId } from '../lib/scroll';
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
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const scrollTo = (id: string) => {
    scrollToId(id, { immediate: Boolean(prefersReducedMotion) });
  };

  const reduceMotion = Boolean(prefersReducedMotion);
  const entranceEase = [0.22, 1, 0.36, 1] as const;

  const eyebrowMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: entranceEase, delay: 0.2 },
      };
  const titleMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.85, ease: entranceEase, delay: 0.35 },
      };
  const ledeMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, ease: entranceEase, delay: 0.55 },
      };
  const ctaMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.65, ease: entranceEase, delay: 0.72 },
      };
  const infoCardMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: entranceEase, delay: 0.9 },
      };

  return (
    <section ref={sectionRef} className="hero-section" aria-labelledby="hero-heading">
      <motion.div
        className="hero-media absolute z-0"
        style={reduceMotion ? undefined : { y: mediaY, scale: mediaScale }}
      >
        {/*
          Same reception photo at every breakpoint. Desktop gets the 1920 JPEG;
          smaller viewports get a WebP derived from that same frame (not a
          different clinic shot). JPEG remains the no-WebP fallback.
        */}
        <picture>
          <source
            media="(min-width: 1024px)"
            srcSet="/images/hero/clinic-hero@1920.jpg?v=9"
            width={1920}
            height={1080}
          />
          <source
            srcSet="/images/hero/clinic-hero.webp?v=9"
            type="image/webp"
            width={1280}
            height={720}
          />
          <img
            src="/images/hero/clinic-hero.jpg?v=9"
            alt={`${clinic.nameShort} reception — Nayabazar-8, opposite GMC Hospital, Pokhara`}
            className="hero-bg-image"
            width={1280}
            height={720}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-grain" aria-hidden="true" />
      </motion.div>

      <Container className="hero-shell">
        <div className="hero-bottom-band">
          <div className="hero-main-card">
            <motion.div className="hero-eyebrow" {...eyebrowMotion}>
              <p className="hero-brand">{clinic.nameShort}</p>
              <p className="hero-cert-bar">
                <ShieldIcon />
                <span>Board certified dermatology</span>
              </p>
              <p className="hero-ne" lang="ne">
                नमस्ते — welcome
              </p>
            </motion.div>

            <motion.h1 id="hero-heading" className="hero-main-card__title" {...titleMotion}>
              Dermatologist-led skin &amp; hair care in{' '}
              <em className="hero-em">Pokhara</em>
            </motion.h1>

            <motion.p className="hero-main-card__lede" {...ledeMotion}>
              Evidence-based dermatology, hair restoration, and aesthetic treatment — opposite of GMC
              Hospital, Nayabazar-8.
            </motion.p>

            <motion.div className="hero-cta-row" {...ctaMotion}>
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
            </motion.div>
          </div>

          {/* Desktop / tablet info card */}
          <motion.aside
            className="hero-info-card hero-info-card--desktop"
            aria-label="Clinic hours and location"
            {...infoCardMotion}
          >
            <div className="hero-info-card__row">
              <span className="hero-info-card__icon hero-info-card__icon--accent">
                <PinIcon />
              </span>
              <div className="hero-info-card__body">
                <p className="hero-info-card__label">Location</p>
                <p className="hero-info-card__value">{address.line1}</p>
                <p className="hero-info-card__note">Opposite of GMC</p>
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

          {/* Mobile compact hours line — keeps the photo subject visible */}
          <motion.p
            className="hero-mobile-meta"
            aria-label="Clinic hours and location"
            {...infoCardMotion}
          >
            <span className="hero-mobile-meta__dot" aria-hidden="true" />
            Open today · 8AM–7PM · Opposite of GMC
          </motion.p>
        </div>

        {!reduceMotion && (
          <div className="hero-scroll-hint" aria-hidden="true">
            <span className="hero-scroll-hint__line" />
          </div>
        )}
      </Container>
    </section>
  );
}
