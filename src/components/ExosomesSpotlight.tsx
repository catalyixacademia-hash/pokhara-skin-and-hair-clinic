import { motion, useReducedMotion } from 'framer-motion';
import Container from './ui/Container';
import { easeOut } from './motion/variants';

/**
 * High-visibility Exosomes spotlight — first in Pokhara claim.
 * Placed under TrustStrip so it sits in the first scroll after the hero.
 */
export default function ExosomesSpotlight() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  };

  const copyMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: -14 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.95, ease: easeOut },
      };

  const mediaMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 14, scale: 0.985 },
        whileInView: { opacity: 1, x: 0, scale: 1 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 1.05, ease: easeOut, delay: 0.18 },
      };

  return (
    <section
      id="exosomes"
      className="exosomes-spotlight"
      aria-labelledby="exosomes-heading"
    >
      <Container>
        <div className="exosomes-spotlight__grid">
          <motion.div className="exosomes-spotlight__copy" {...copyMotion}>
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
            <ul className="exosomes-spotlight__points">
              <li>Cellular repair signaling for healthier skin</li>
              <li>Dermatologist-led protocols for South Asian skin</li>
              <li>Also offered for hair restoration when clinically indicated</li>
            </ul>
            <div className="exosomes-spotlight__actions">
              <button type="button" className="btn-primary" onClick={() => scrollTo('#contact')}>
                Book exosome consultation
              </button>
              <button
                type="button"
                className="btn-secondary-outline"
                onClick={() => scrollTo('#exosome-skin-rejuvenation')}
              >
                View treatment
              </button>
            </div>
          </motion.div>

          <motion.figure className="exosomes-spotlight__media" {...mediaMotion}>
            <img
              src="/images/treatments/skin/exosomes-promo.webp?v=4"
              alt="Exosomes — next generation skin rejuvenation, first in Pokhara at Pokhara Skin and Hair Clinic"
              width={687}
              height={1024}
              loading="lazy"
              decoding="async"
            />
          </motion.figure>
        </div>
      </Container>
    </section>
  );
}
