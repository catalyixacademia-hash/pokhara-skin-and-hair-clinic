import { doctors as staticDoctors } from '../data/clinic';
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

const CHIP_PRIORITY = [
  'MBBS',
  'Qualification',
  'Certification',
  'Specialization',
  'Lecturer',
  'Focus Areas',
] as const;

function doctorChipLabels(doctor: DoctorProfileView): string[] {
  const fallback = matchStaticDoctor(doctor.name);
  const mergedCredentials = [...doctor.credentials];
  for (const cred of fallback.credentials) {
    const exists = mergedCredentials.some((c) => c.label.toLowerCase() === cred.label.toLowerCase());
    if (!exists) mergedCredentials.push({ label: cred.label, value: cred.value });
  }

  const nmcCred = mergedCredentials.find((c) => /nmc/i.test(c.label));
  const nmcSource = [nmcCred?.value, doctor.qualificationLine].filter(Boolean).join(' ');
  const labels: string[] = [];

  const nmcNumber = nmcSource.match(/(\d{4,})/)?.[1] ?? fallback.nmcNumber;
  labels.push(`NMC Reg. No. ${nmcNumber}`);

  const specialistMatch = nmcSource.match(/Specialist\s*\(\s*([^)]+?)\s*\)/i);
  const specialty = specialistMatch?.[1]?.trim() ?? fallback.nmcSpecialty;
  labels.push(`MD Specialist (${specialty})`);

  const seen = new Set(labels.map((label) => label.toLowerCase()));
  const byLabel = new Map(
    mergedCredentials.map((cred) => [cred.label.toLowerCase(), cred.label] as const),
  );

  for (const preferred of CHIP_PRIORITY) {
    const found =
      byLabel.get(preferred.toLowerCase()) ??
      (preferred === 'MBBS' ? byLabel.get('md, mbbs') : undefined);
    if (!found) continue;
    const display = /^md,\s*mbbs$/i.test(found) ? 'MBBS' : found;
    if (seen.has(display.toLowerCase()) || seen.has(found.toLowerCase())) continue;
    labels.push(display);
    seen.add(display.toLowerCase());
    seen.add(found.toLowerCase());
    seen.add('mbbs');
    seen.add('md, mbbs');
  }

  for (const cred of mergedCredentials) {
    if (/nmc/i.test(cred.label) || /specialist\s*\(/i.test(cred.label)) continue;
    if (/^md,\s*dermatology$/i.test(cred.label)) continue;
    if (/^md,\s*mbbs$/i.test(cred.label)) continue;
    if (/^(clinic|location)$/i.test(cred.label)) continue;
    if (seen.has(cred.label.toLowerCase())) continue;
    labels.push(cred.label);
    seen.add(cred.label.toLowerCase());
    if (labels.length >= 8) break;
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
