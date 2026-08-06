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
      className="bg-surface section-padding"
      aria-labelledby="journey-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="03"
            title="Our journey"
            titleId="journey-heading"
            lede="A Pokhara clinic built for clear dermatology and hair care — close to where patients already seek medical help."
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start">
          <Reveal delay={0.05}>
            <div className="space-y-5">
              <p className="font-body text-base text-muted leading-relaxed">
                {settings.name} was established to bring patient-centered skin and hair treatment to{' '}
                {address.line1} — {address.landmark}. The goal was practical: a clinic patients can
                reach easily, with honest consultation and care planned around each person’s needs —
                not a one-size menu.
              </p>
              <p className="font-body text-base text-muted leading-relaxed">
                From day one, the practice has focused on clinical dermatology alongside hair
                restoration, serving families across Pokhara and the wider Gandaki region with a
                steady, medical approach.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="clinic-panel flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
              <div className="doctor-portrait">
                <img
                  src="/images/founder/arjun-giri.png"
                  alt="Mr. Arjun Giri, Founder of Pokhara Skin and Hair Clinic"
                  className="w-full h-full object-cover object-[78%_12%]"
                  loading="lazy"
                  decoding="async"
                  width={432}
                  height={464}
                />
              </div>
              <div className="space-y-3 min-w-0">
                <p className="section-label">Founder</p>
                <h3 className="font-display text-2xl text-ink">Mr. Arjun Giri</h3>
                <p className="font-body text-base text-muted leading-relaxed">
                  Clinic leadership dedicated to bringing trusted skin and hair care to Pokhara —
                  with clinical treatment led by our board-certified dermatologist.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
