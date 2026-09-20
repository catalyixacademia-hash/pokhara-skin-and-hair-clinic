import { useState } from 'react';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { cn } from '../utils/cn';

const JOURNEY_STEPS = [
  {
    num: '1',
    title: 'Easy to reach',
    body: 'Opposite of GMC Hospital in Nayabazar-8 — add a dermatology visit without a long detour.',
  },
  {
    num: '2',
    title: 'Consultation first',
    body: 'Honest assessment, clear explanation, and a plan built around your skin or hair goals.',
  },
  {
    num: '3',
    title: 'Specialist-led care',
    body: 'Clinical dermatology and hair restoration under board-certified specialist supervision.',
  },
] as const;

export default function ClinicJourney() {
  const { settings } = useClinicSettings();
  const { address } = settings;
  const [expanded, setExpanded] = useState(false);

  const intro = `${settings.name} brings patient-centered skin and hair treatment to ${address.line1} — ${address.landmark}. We focus on honest consultation and care planned around each person's needs, not a one-size menu. From day one, the practice has served families across Pokhara and the Gandaki region with steady, medical dermatology alongside hair restoration when appropriate.`;

  const extraParagraphs = [
    `Sitting opposite GMC Hospital means patients already travelling for medical care can add a dermatology visit without a long detour — same neighbourhood, clearer next steps for skin concerns, hair loss, and aesthetic treatment when it is clinically appropriate.`,
    `Clinic operations and patient experience are guided by founder Mr. Arjun Giri. Consultations and procedures are led by our board-certified dermatologist, so every plan stays grounded in specialist judgment — from first assessment through follow-up.`,
    `Whether you are visiting for acne, pigmentation, hair restoration, or a routine skin check, we aim for the same standard: clear explanation, realistic expectations, and care that respects both medical need and how you want to feel in your own skin.`,
  ];

  return (
    <section
      id="about"
      className="bg-surface-warm section-padding"
      aria-labelledby="journey-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="09"
            title="Our journey"
            titleId="journey-heading"
            lede="A Pokhara clinic built for clear dermatology and hair care — close to where patients already seek medical help."
            className="mb-6 md:mb-8 lg:mb-10"
          />
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-start">
          <Reveal className="lg:col-span-7" delay={0.05} direction="left">
            <p className="font-body text-base text-muted leading-relaxed">{intro}</p>

            <ol className="journey-timeline list-none p-0 m-0">
              {JOURNEY_STEPS.map((step) => (
                <li key={step.num} className="journey-step">
                  <span className="journey-step__num" aria-hidden="true">
                    {step.num}
                  </span>
                  <div>
                    <h3 className="font-display text-h3 text-ink mb-1">{step.title}</h3>
                    <p className="font-body text-base text-muted leading-relaxed">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div
              id="journey-story"
              className={cn(
                'grid transition-[grid-template-rows] duration-500 ease-out',
                expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 pt-4 text-muted">
                  {extraParagraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)} className="font-body text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="disclosure-btn mt-4"
              aria-expanded={expanded}
              aria-controls="journey-story"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? 'Show less' : 'Read our story'}
            </button>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.1} direction="right">
            <figure className="founder-card">
              <div className="founder-portrait">
                <img
                  src="/images/founder/arjun-giri.png"
                  alt="Mr. Arjun Giri, Founder of Pokhara Skin and Hair Clinic"
                  className="w-full h-full object-cover object-[78%_12%]"
                  loading="lazy"
                  decoding="async"
                  width={480}
                  height={600}
                />
              </div>
              <figcaption className="founder-card__caption">
                <p className="section-label">Founder</p>
                <h3 className="font-display text-2xl text-ink mt-1">Mr. Arjun Giri</h3>
                <p className="font-body text-base text-muted leading-relaxed mt-2.5">
                  Clinic leadership dedicated to bringing trusted skin and hair care to Pokhara —
                  with clinical treatment led by our board-certified dermatologist.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
