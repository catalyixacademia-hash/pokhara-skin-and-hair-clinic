import { doctor as staticDoctor } from '../data/clinic';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { useDoctorProfile } from '../hooks/useDoctorProfile';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

const PULL_QUOTE =
  'Every plan starts with evidence — I recommend only what is medically appropriate for your skin, not what is fashionable.';

function nmcChipLabel(doctor: {
  qualificationLine: string;
  credentials: { label: string; value: string }[];
}): string {
  const nmcCred = doctor.credentials.find((c) => /nmc/i.test(c.label));
  if (nmcCred) return nmcCred.value;
  if (doctor.qualificationLine.includes('NMC')) return doctor.qualificationLine;
  return `NMC Reg. No. ${staticDoctor.nmcNumber} · Specialist (${staticDoctor.nmcSpecialty})`;
}

export default function ClinicDoctor() {
  const { doctor } = useDoctorProfile();
  const { settings } = useClinicSettings();

  const nmcLabel = nmcChipLabel(doctor);
  const credentialChips = doctor.credentials
    .filter((c) => !/nmc/i.test(c.label))
    .slice(0, 4);

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
            lede={`Specialist-led dermatology at ${settings.nameShort} — opposite GMC Hospital in Nayabazar-8.`}
          />
        </Reveal>

        <div className="doctor-hero">
          <Reveal delay={0.05} direction="left">
            <div className="doctor-portrait-lg">
              <img
                src={doctor.portraitUrl}
                alt={doctor.portraitAlt}
                loading="lazy"
                decoding="async"
                width={432}
                height={540}
              />
            </div>
          </Reveal>

          <Reveal delay={0.1} direction="right">
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-display text-ink">{doctor.name}</h3>
                <p className="font-body text-body-lg text-muted mt-2">{doctor.title}</p>
              </div>

              <div className="doctor-chips">
                <span className="doctor-chip">{nmcLabel}</span>
                {credentialChips.map((cred) => (
                  <span key={cred.label} className="doctor-chip">
                    {cred.label}
                  </span>
                ))}
              </div>

              <blockquote className="doctor-pullquote">&ldquo;{PULL_QUOTE}&rdquo;</blockquote>

              <div className="space-y-4 text-muted">
                {doctor.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="font-body text-base leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
