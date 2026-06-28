import { motion, useReducedMotion } from 'framer-motion';
import {
  address,
  clinic,
  doctor,
  formatPhoneDisplay,
  getPhone,
  hours,
  phoneHref,
} from '../data/clinic';
import Container from './ui/Container';

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
    <section className="hero-section" aria-label="Hero">
      {/* Background Image & Grid Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/clinic-hero.png"
          alt=""
          className="w-full h-full object-cover object-[center_30%] lg:object-center"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/25 md:via-paper/70 md:to-transparent" />
      </div>

      <Container className="relative z-10 flex flex-col justify-end min-h-full py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1fr_minmax(280px,340px)] gap-12 lg:gap-16 items-start">
          <div className="max-w-xl">
            <motion.p
              className="mono-label mb-6"
              {...stagger}
              transition={{ ...stagger.transition, delay: 0 }}
            >
              Nayabazar-8 · Pokhara, Nepal
            </motion.p>

            <motion.h1
              className="font-display text-display text-ink mb-6"
              {...stagger}
              transition={{ ...stagger.transition, delay: 0.08 }}
            >
              Advanced dermatology for skin that deserves clinical care.
            </motion.h1>

            <motion.p
              className="font-body text-lg text-muted leading-relaxed mb-10 max-w-lg"
              {...stagger}
              transition={{ ...stagger.transition, delay: 0.16 }}
            >
              Board-certified skin treatments in Pokhara — with specialized hair restoration
              when you need it. Led by {doctor.name}, {doctor.titleShort}.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
              {...stagger}
              transition={{ ...stagger.transition, delay: 0.24 }}
            >
              <button type="button" onClick={() => scrollTo('#contact')} className="btn-primary w-full sm:w-auto">
                Book appointment
              </button>
              <button type="button" onClick={() => scrollTo('#services')} className="btn-outline-frost w-full sm:w-auto">
                View treatments
              </button>
            </motion.div>
          </div>

          <motion.aside
            className="clinic-meta-panel"
            aria-label="Clinic information"
            {...stagger}
            transition={{ ...stagger.transition, delay: 0.32 }}
          >
            <dl>
              <dt>Hours</dt>
              <dd>{hours.daily}</dd>
              <dd className="text-[0.75rem]">{hours.saturdayNote}</dd>

              <dt>Location</dt>
              <dd>{address.line1}</dd>
              <dd>{address.landmark}</dd>

              <dt>Appointments</dt>
              <dd>
                <a href={phoneHref(getPhone('appointments').number)} className="text-accent hover:underline">
                  {formatPhoneDisplay(getPhone('appointments').number)}
                </a>
              </dd>

              <dt>Clinic</dt>
              <dd>{clinic.nameShort}</dd>
            </dl>
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
