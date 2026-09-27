import { doctor as staticDoctor, doctors as staticDoctors } from '../data/clinic';
import {
  useDoctorProfiles,
  type DoctorProfileView,
} from '../hooks/useDoctorProfile';
import { useClinicSettings } from '../hooks/useClinicSettings';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

function matchStaticDoctor(name: string) {
  const trimmed = name.trim().toLowerCase();
  const exact = staticDoctors.find((entry) => entry.name.toLowerCase() === trimmed);
  if (exact) return exact;
  if (trimmed.includes('bishnu')) return staticDoctors[1];
  return staticDoctors[0];
}

function doctorChipLabels(doctor: DoctorProfileView): string[] {
  const fallback = matchStaticDoctor(doctor.name);
  const nmcCred = doctor.credentials.find((c) => /nmc/i.test(c.label));
  const nmcSource = [nmcCred?.value, doctor.qualificationLine].filter(Boolean).join(' ');
  const labels: string[] = [];

  const nmcNumber = nmcSource.match(/(\d{4,})/)?.[1] ?? fallback.nmcNumber;
  labels.push(`NMC Reg. No. ${nmcNumber}`);

  const specialistMatch = nmcSource.match(/Specialist\s*\(\s*([^)]+?)\s*\)/i);
  const specialistCred = doctor.credentials.find((c) => /specialist\s*\(/i.test(c.label));
  if (specialistMatch || specialistCred || fallback.name === staticDoctor.name) {
    const specialty = specialistMatch?.[1]?.trim() ?? fallback.nmcSpecialty;
    labels.push(`Specialist (${specialty})`);
  }

  const seen = new Set(labels.map((label) => label.toLowerCase()));
  for (const cred of doctor.credentials) {
    if (/nmc/i.test(cred.label) || /specialist\s*\(/i.test(cred.label)) continue;
    if (seen.has(cred.label.toLowerCase())) continue;
    labels.push(cred.label);
    seen.add(cred.label.toLowerCase());
    if (labels.length >= 6) break;
  }

  return labels;
}

function DoctorProfileCard({
  doctor,
  delay,
}: {
  doctor: DoctorProfileView;
  delay: number;
}) {
  const chips = doctorChipLabels(doctor);

  return (
    <article className="doctor-card">
      <Reveal delay={delay} direction="up">
        <div
          className={
            /bishnu/i.test(doctor.name)
              ? 'doctor-portrait-lg doctor-portrait-lg--pullback'
              : 'doctor-portrait-lg'
          }
        >
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
            <h3 className="doctor-card__name font-display text-ink">{doctor.name}</h3>
            <p className="font-body text-base text-muted mt-1.5">{doctor.title}</p>
          </div>

          <div className="doctor-chips">
            {chips.map((chip) => (
              <span key={chip} className="doctor-chip">
                {chip}
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
