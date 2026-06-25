import { doctor } from '../data/clinic';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

const philosophy = [
  {
    title: 'Patient-first approach',
    body: 'Every treatment begins with a thorough understanding of the individual. Accurate diagnosis is the foundation of effective care.',
  },
  {
    title: 'Evidence-based medicine',
    body: 'All protocols are grounded in peer-reviewed science, not trends. Your safety and results are non-negotiable.',
  },
  {
    title: 'Natural aesthetic results',
    body: 'The goal is to restore and enhance authentically — results that feel true to who you are.',
  },
];

export default function Doctor() {
  return (
    <section id="doctor" className="bg-accent-soft section-padding border-t border-line">
      <Container>
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="img-zoom aspect-[3/4] overflow-hidden bg-line mb-6">
              <img
                src="https://images.pexels.com/photos/7659876/pexels-photo-7659876.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
                alt={doctor.portraitAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="border-l-2 border-accent pl-4 mb-6">
              <h3 className="font-serif text-2xl text-ink mb-1">{doctor.name}</h3>
              <p className="font-sans text-sm text-muted">{doctor.titleShort}</p>
            </div>

            <dl className="space-y-3">
              {doctor.credentials.map((c) => (
                <div key={c.label} className="grid grid-cols-[6rem_1fr] gap-2 text-sm">
                  <dt className="font-sans text-muted">{c.label}</dt>
                  <dd className="font-sans text-ink">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-3">
            <SectionHeader
              label="Meet the doctor"
              title="Medically guided aesthetic care"
              className="mb-6"
            />

            {doctor.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="font-sans text-muted text-base leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}

            <div className="space-y-4 my-8">
              {philosophy.map((p) => (
                <div key={p.title} className="border border-line p-5 bg-surface">
                  <h4 className="font-serif text-lg text-ink mb-2">{p.title}</h4>
                  <p className="font-sans text-sm text-muted leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              Schedule a consultation
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
