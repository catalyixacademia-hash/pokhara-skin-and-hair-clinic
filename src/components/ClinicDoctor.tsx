import { useClinicSettings } from '../hooks/useClinicSettings';
import { useDoctorProfile } from '../hooks/useDoctorProfile';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

export default function ClinicDoctor() {
  const { doctor } = useDoctorProfile();
  const { settings } = useClinicSettings();
  const { address } = settings;

  return (
    <section
      id="doctor"
      className="bg-surface section-padding"
      aria-labelledby="doctor-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="03"
            title="Your dermatologist"
            titleId="doctor-heading"
            lede={`Clinical care led by ${doctor.name} — NMC specialist dermatologist — opposite GMC Hospital.`}
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-20 items-start">
          <Reveal delay={0.05}>
            <div className="space-y-8">
              <div className="clinic-image-frame aspect-square md:aspect-video lg:aspect-square">
                <img
                  src="/images/clinic/interior-waiting.webp"
                  alt={`${settings.nameShort} waiting and reception area`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={1024}
                />
              </div>
              <div className="space-y-6">
                <h3 className="font-display text-2xl text-ink">In the clinic</h3>
                <p className="font-body text-base text-muted leading-relaxed">
                  Consultations take place at {settings.name} in {address.area}, {address.line1} —{' '}
                  {address.landmark}. Patients across Pokhara and the Gandaki region come here for
                  skin care, hair restoration, and aesthetic dermatology under specialist supervision.
                </p>
                <ul className="space-y-3">
                  {address.full.map((line) => (
                    <li key={line} className="font-body text-base text-muted flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="clinic-panel space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="doctor-portrait">
                  <img
                    src={doctor.portraitUrl}
                    alt={doctor.portraitAlt}
                    className="w-full h-full object-cover object-[center_20%]"
                    loading="lazy"
                    decoding="async"
                    width={432}
                    height={464}
                  />
                </div>
                <div className="space-y-2">
                  <p className="section-label">{doctor.name}</p>
                  <h3 className="font-display text-2xl text-ink">{doctor.title}</h3>
                  <p className="text-label text-secondary">{doctor.qualificationLine}</p>
                </div>
              </div>

              <div className="space-y-6 text-muted">
                {doctor.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="font-body text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                <div className="grid sm:grid-cols-2 gap-8">
                  {doctor.credentials.slice(0, 4).map((cred) => (
                    <div key={cred.label}>
                      <p className="text-label text-ink mb-2">{cred.label}</p>
                      <p className="font-body text-caption text-muted">{cred.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
