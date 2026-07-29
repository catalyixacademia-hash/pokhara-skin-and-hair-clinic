import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { aestheticServices } from '../data/services';
import { useResults } from '../hooks/useResults';

const aestheticConcerns = aestheticServices.map((s) => ({
  title: s.title,
  description: s.description,
}));

export default function Outcomes() {
  const { results, fromDb } = useResults();

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="results" className="bg-surface-container-highest section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="04"
            title={fromDb && results.length ? 'Patient results' : 'Aesthetic concerns we address'}
            lede={
              fromDb && results.length
                ? 'Selected clinical outcomes from our dermatology practice. Individual results vary.'
                : 'Cosmetic dermatology focused on natural refinement — botox, fillers, anti-aging, and laser hair reduction. Before-and-after photography is published when available.'
            }
          />
        </Reveal>

        {fromDb && results.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {results.map((result, i) => (
              <Reveal key={result.id} delay={i * 0.05}>
                <article className="result-card">
                  <div className="result-card__pair">
                    <figure className="result-card__shot">
                      <img
                        src={result.beforeUrl}
                        alt={`${result.label} — before`}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>Before</figcaption>
                    </figure>
                    <figure className="result-card__shot">
                      <img
                        src={result.afterUrl}
                        alt={`${result.label} — after`}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>After</figcaption>
                    </figure>
                  </div>
                  <div className="result-card__meta">
                    <h3 className="font-display text-lg text-ink">{result.label}</h3>
                    {result.duration && (
                      <p className="font-body text-caption text-muted">{result.duration}</p>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {aestheticConcerns.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <article className="space-y-3">
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="font-body text-base text-muted leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button type="button" onClick={scrollToContact} className="btn-primary">
              Book a consultation
            </button>
            <p className="font-body text-sm text-muted max-w-md">
              We will assess your goals in clinic and recommend only what is medically appropriate.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
