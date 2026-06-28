import { address, clinic, doctor } from '../data/clinic';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

export default function ClinicDoctor() {
  return (
    <section id="about" className="bg-surface section-padding border-t border-line">
      <Container>
        <Reveal>
          <SectionIntro
            index="03"
            title="The clinic & your dermatologist"
            lede="Medically trusted dermatology in the heart of Pokhara, opposite GMC Hospital."
          />
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <Reveal delay={0.05}>
            <div id="doctor">
              <div className="mb-6 overflow-hidden rounded-[var(--radius-sm)] border border-line aspect-[4/3] bg-paper">
                <img
                  src="/images/clinic/interior-waiting.webp"
                  alt="Pokhara Skin & Hair Clinic waiting and reception area"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mono-label mb-4">About the clinic</p>
              <p className="font-body text-muted leading-relaxed mb-4">
                {clinic.name} is located in {address.area}, {address.line1} — {address.landmark}.
                We serve patients across Pokhara and the wider Gandaki region with advanced skin care,
                hair restoration, and aesthetic dermatology.
              </p>
              <p className="font-body text-muted leading-relaxed mb-6">
                The clinic is designed for calm, private consultations and evidence-based treatment
                in a comfortable clinical environment.
              </p>
              <ul className="space-y-2">
                {address.full.map((line) => (
                  <li key={line} className="font-body text-sm text-ink flex gap-2">
                    <span className="text-accent shrink-0">—</span>
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="surface p-6 md:p-8">
              <div className="relative mb-6 overflow-hidden rounded-[var(--radius-sm)] border border-line aspect-[4/3] bg-paper">
                <img
                  src="/images/doctor/dr-prakash-acharya.png"
                  alt={doctor.portraitAlt}
                  className="w-full h-full object-cover object-[center_20%]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mono-label mb-4">{doctor.name}</p>
              <h3 className="font-display text-h3 text-ink mb-1">{doctor.title}</h3>
              <p className="font-mono text-xs text-muted mb-6">MD, Dermatology &amp; Venereology</p>

              {doctor.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="font-body text-sm text-muted leading-relaxed mb-4 last:mb-6">
                  {paragraph}
                </p>
              ))}

              <dl className="space-y-3 border-t border-line pt-6">
                {doctor.credentials.slice(0, 4).map((cred) => (
                  <div key={cred.label}>
                    <dt className="font-mono text-xs text-muted">{cred.label}</dt>
                    <dd className="font-body text-sm text-ink mt-0.5">{cred.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
