import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

export default function ClinicJourney() {
  const { settings } = useClinicSettings();
  const { address } = settings;

  return (
    <section
      id="about"
      className="bg-surface-container-low section-padding"
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
          <Reveal className="lg:col-span-7" delay={0.05}>
            <div className="space-y-4 text-muted">
              <p className="font-body text-base leading-relaxed">
                {settings.name} was established to bring patient-centered skin and hair treatment to{' '}
                {address.line1} — {address.landmark}. The goal was practical: a clinic patients can
                reach easily, with honest consultation and care planned around each person’s needs —
                not a one-size menu.
              </p>
              <p className="font-body text-base leading-relaxed">
                From day one, the practice has focused on clinical dermatology alongside hair
                restoration, serving families across Pokhara and the wider Gandaki region with a
                steady, medical approach.
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.1}>
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
