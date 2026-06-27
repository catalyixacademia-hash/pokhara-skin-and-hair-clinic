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
    <section className="bg-paper section-padding-sm border-t border-line">
      <Container>
        <Reveal>
          <SectionIntro
            index="02"
            title="How we practice"
            lede="Three principles that guide every patient interaction at the clinic."
          />
        </Reveal>

        <div>
          {standards.map((item, i) => (
            <Reveal key={item.index} delay={i * 0.06}>
              <article className="standard-item">
                <span className="standard-index">{item.index}</span>
                <div>
                  <h3 className="font-display text-h3 text-ink mb-2">{item.title}</h3>
                  <p className="font-body text-sm text-muted leading-relaxed max-w-xl">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
