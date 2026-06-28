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
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero/clinic-hero.png"
          alt=""
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
        />
        <div className="hero-overlay-bottom" aria-hidden="true" />
      </div>

      <Container className="relative z-10 flex min-h-[calc(100dvh-var(--nav-height))] flex-col">
        <div className="flex-1 min-h-[8rem] sm:min-h-[10rem] lg:min-h-[14rem]" aria-hidden="true" />

        <div className="grid gap-4 pb-6 pt-4 md:pb-10 md:pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:items-end lg:gap-5">
          <motion.div
            className="hero-content-panel max-w-2xl"
            {...stagger}
            transition={{ ...stagger.transition, delay: 0 }}
          >
            <p className="mono-label mb-3">Nayabazar-8 · Pokhara, Nepal</p>

            <h1 className="font-display text-h1 text-ink mb-3 leading-tight">
              Advanced dermatology for skin that deserves clinical care.
            </h1>

            <p className="font-body text-sm md:text-base text-muted leading-relaxed mb-5 max-w-lg">
              Board-certified skin treatments in Pokhara — with specialized hair restoration when
              you need it. Led by {doctor.name}, {doctor.titleShort}.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => scrollTo('#contact')} className="btn-primary w-full sm:w-auto">
                Book appointment
              </button>
              <button type="button" onClick={() => scrollTo('#services')} className="btn-outline-frost w-full sm:w-auto">
                View treatments
              </button>
            </div>
          </motion.div>

          <motion.aside
            className="clinic-meta-panel w-full lg:justify-self-end"
            aria-label="Clinic information"
            {...stagger}
            transition={{ ...stagger.transition, delay: 0.1 }}
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
