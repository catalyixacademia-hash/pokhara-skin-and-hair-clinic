import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';

const standards = [
  {
    index: '01',
    title: 'Evidence-based protocols',
    body: 'Every treatment follows clinically validated dermatology standards. We do not recommend procedures without proven efficacy for your specific condition.',
  },
  {
    index: '02',
    title: 'Personalized consultation first',
    body: 'Your care begins with a thorough evaluation — skin analysis, medical history, and a treatment plan tailored to your goals, not a one-size-fits-all menu.',
  },
  {
    index: '03',
    title: 'Modern clinical technology',
    body: 'Advanced diagnostic tools and treatment technology meeting international standards of precision, safety, and patient comfort.',
  },
];

export default function CareStandards() {
  return (
    <section
      id="care-standards"
      className="bg-surface-container-low section-padding"
      aria-labelledby="care-standards-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="02"
            title="How we practice"
            titleId="care-standards-heading"
            lede="Three principles that guide every patient interaction at the clinic."
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {standards.map((item, i) => (
            <Reveal key={item.index} className="h-full" delay={i * 0.06}>
              <article className="standard-card">
                <div className="standard-card__badge">{item.index}</div>
                <h3 className="font-display text-h3 text-ink mt-5 mb-3">{item.title}</h3>
                <p className="font-body text-base text-muted leading-relaxed">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
