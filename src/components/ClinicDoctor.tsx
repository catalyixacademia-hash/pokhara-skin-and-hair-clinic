import { doctor as staticDoctor } from '../data/clinic';
import {
  useDoctorProfiles,
  type DoctorProfileView,
} from '../hooks/useDoctorProfile';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

function nmcChipLabel(doctor: DoctorProfileView): string {
  const nmcCred = doctor.credentials.find((c) => /nmc/i.test(c.label));
  if (nmcCred) return nmcCred.value;
  if (doctor.qualificationLine.includes('NMC')) return doctor.qualificationLine;
  return `NMC Reg. No. ${staticDoctor.nmcNumber} · Specialist (${staticDoctor.nmcSpecialty})`;
}

function DoctorProfileCard({
  doctor,
  delay,
}: {
  doctor: DoctorProfileView;
  delay: number;
}) {
  const nmcLabel = nmcChipLabel(doctor);
  const credentialChips = doctor.credentials
    .filter((c) => !/nmc/i.test(c.label))
    .slice(0, 4);

  return (
    <article className="doctor-card">
      <Reveal delay={delay} direction="up">
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

      <Reveal delay={delay + 0.05} direction="up">
        <div className="doctor-card__body space-y-6">
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

          {doctor.pullQuote ? (
            <blockquote className="doctor-pullquote">&ldquo;{doctor.pullQuote}&rdquo;</blockquote>
          ) : null}

          <div className="space-y-4 text-muted">
            {doctor.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="font-body text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </article>
  );
}

export default function ClinicDoctor() {
  const { doctors } = useDoctorProfiles();
  const { settings } = useClinicSettings();

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
            title="Your dermatologists"
            titleId="doctor-heading"
            lede={`Specialist-led dermatology at ${settings.nameShort} — opposite GMC Hospital in Nayabazar-8.`}
          />
        </Reveal>

        <div className="doctor-grid">
          {doctors.map((profile, index) => (
            <DoctorProfileCard
              key={profile.name}
              doctor={profile}
              delay={0.05 + index * 0.08}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
