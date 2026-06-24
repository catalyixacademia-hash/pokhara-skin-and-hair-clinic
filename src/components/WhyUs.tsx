import { clinic } from '../data/clinic';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

const features = [
  {
    title: 'Personalized consultation',
    body: 'Every patient is unique. We begin with a thorough evaluation before recommending any treatment.',
  },
  {
    title: 'Advanced technology',
    body: 'Modern diagnostic and treatment technology meeting international standards of precision and safety.',
  },
  {
    title: 'Evidence-based treatments',
    body: 'Protocols grounded in clinical research — no treatments without proven efficacy.',
  },
  {
    title: 'Safe clinical procedures',
    body: 'Strict clinical protocols with careful monitoring and aftercare guidance.',
  },
  {
    title: 'Experienced dermatology care',
    body: 'Led by a qualified MD dermatologist with extensive clinical and aesthetic experience.',
  },
  {
    title: 'Comfortable environment',
    body: 'A calm, private, and welcoming clinic designed for a positive treatment experience.',
  },
];

export default function WhyUs() {
  return (
    <section className="bg-ink section-padding">
      <Container>
        <SectionHeader
          label="Why choose us"
          title="The standard of care you deserve"
          inverted
          className="mb-10"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {features.map((feature) => (
            <div key={feature.title} className="bg-ink p-6 md:p-8">
              <h3 className="font-serif text-xl text-paper mb-3">{feature.title}</h3>
              <p className="font-sans text-sm text-paper/70 leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>

        <blockquote className="mt-12 max-w-2xl mx-auto text-center">
          <p className="font-serif text-lg md:text-xl text-paper/90 leading-relaxed mb-4">
            &ldquo;{clinic.tagline}&rdquo;
          </p>
          <footer className="font-sans text-sm text-paper/60">
            Pokhara Skin and Hair Clinic
          </footer>
        </blockquote>
      </Container>
    </section>
  );
}
