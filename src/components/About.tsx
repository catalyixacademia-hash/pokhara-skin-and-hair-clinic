import { address, clinic } from '../data/clinic';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

const stats = [
  { value: '5000+', label: 'Patients treated' },
  { value: '15+', label: 'Procedures' },
  { value: '10+', label: 'Years experience' },
  { value: '98%', label: 'Satisfaction' },
];

export default function About() {
  return (
    <section id="about" className="bg-paper section-padding">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          <div>
            <SectionHeader
              label="About the clinic"
              title="Where medical precision meets aesthetic care"
              className="mb-8"
            />

            <p className="font-sans text-muted text-base leading-relaxed mb-5">
              {clinic.name} was founded to bring internationally standard dermatology and aesthetic
              medicine to Pokhara. Under Dr. Prakash Acharya, every consultation is approached with
              clinical rigour and genuine human care.
            </p>
            <p className="font-sans text-muted text-base leading-relaxed mb-8">
              Great skin comes from evidence-based medicine, not shortcuts. Each patient receives a
              personalized plan built on accurate diagnosis, modern technology, and proven treatments.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => document.querySelector('#doctor')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Meet our doctor
              </button>
              <button
                type="button"
                onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary"
              >
                View treatments
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="img-zoom aspect-[4/5] overflow-hidden bg-line">
              <img
                src="https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=640"
                alt="Doctor consulting patient"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-4 p-4 border border-line bg-paper md:absolute md:-bottom-6 md:right-0 md:max-w-xs md:shadow-sm">
              <p className="section-label mb-1">Located at</p>
              <p className="font-serif text-ink">{address.line1}</p>
              <p className="font-sans text-sm text-muted mt-1">{address.landmark}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="stat-number mb-1">{stat.value}</div>
              <p className="font-sans text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
