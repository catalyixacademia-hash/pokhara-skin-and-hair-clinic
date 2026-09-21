import Container from './ui/Container';
import Reveal from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { scrollToId } from '../lib/scroll';

const FALLBACK_EXO_PROMO = '/images/treatments/skin/exosomes-promo.webp?v=5';

const MINI_CARDS = [
  {
    title: 'Regenerate',
    body: 'Cellular repair signaling for healthier, more resilient skin.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'Restore',
    body: 'Dermatologist-led protocols tailored to South Asian skin tones.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3c4.5 2 7 5.2 7 9.2S15.5 20 12 21c-3.5-1-7-4.2-7-8.8S7.5 5 12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M9.5 12.5 11 14l3.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Renew',
    body: 'Also offered for hair restoration when clinically indicated.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 12a8 8 0 0 1 13.5-5.8M20 12a8 8 0 0 1-13.5 5.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M17.5 3.5V7h-3.5M6.5 20.5V17H10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
] as const;

/**
 * High-visibility Exosomes spotlight — first in Pokhara claim.
 * Placed under TrustStrip so it sits in the first scroll after the hero.
 */
export default function ExosomesSpotlight() {
  const { settings } = useClinicSettings();
  const promoSrc = settings.exosomesPromoUrl || FALLBACK_EXO_PROMO;

  return (
    <section
      id="exosomes"
      className="exosomes-spotlight bg-surface-warm section-padding section-sheet"
      aria-labelledby="exosomes-heading"
    >
      <Container>
        <div className="exosomes-spotlight__grid">
          <Reveal className="exosomes-spotlight__copy" direction="left">
            <p className="exosomes-spotlight__eyebrow">
              <span aria-hidden="true">★</span> 1st in Pokhara
            </p>
            <h2 id="exosomes-heading" className="exosomes-spotlight__title">
              Exosome skin rejuvenation
            </h2>
            <p className="exosomes-spotlight__lede">
              Next-generation regenerative dermatology — regenerate, restore, and renew skin
              with exosome therapy now available at Pokhara Skin &amp; Hair Clinic.
            </p>

            <Stagger className="exo-mini-cards">
              {MINI_CARDS.map((card) => (
                <StaggerItem key={card.title} as="article" className="exo-mini-card">
                  <span className="exo-mini-card__icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <div>
                    <p className="exo-mini-card__title">{card.title}</p>
                    <p className="exo-mini-card__body">{card.body}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="exosomes-spotlight__actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => scrollToId('contact')}
              >
                Book exosome consultation
              </button>
              <button
                type="button"
                className="btn-secondary-outline"
                onClick={() => scrollToId('exosome-skin-rejuvenation')}
              >
                View treatment
              </button>
            </div>
          </Reveal>

          <Reveal className="exosomes-spotlight__media-wrap" direction="right" delay={0.1}>
            <figure className="exosomes-spotlight__media">
              <img
                src={promoSrc}
                alt="Exosomes — next generation skin rejuvenation, first in Pokhara at Pokhara Skin and Hair Clinic"
                width={687}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
