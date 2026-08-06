import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useResults } from '../hooks/useResults';
import { fallbackResults } from '../data/results';

export default function Outcomes() {
  const { results, fromDb } = useResults();
  const display = fromDb && results.length > 0 ? results : fallbackResults;
  const isLive = fromDb && results.length > 0;

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="results"
      className="bg-surface-container-highest section-padding"
      aria-labelledby="results-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="05"
            title="Patient results"
            titleId="results-heading"
            lede={
              isLive
                ? 'Selected clinical outcomes from our dermatology practice. Individual results vary.'
                : 'Representative photography of conditions we treat. Published before-and-after cases appear here when available. Individual results vary.'
            }
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 items-stretch">
          {display.map((result, i) => (
            <Reveal key={result.id} className="h-full" delay={i * 0.05}>
              <article className="result-card h-full">
                <div className="result-card__pair">
                  <figure className="result-card__shot">
                    <img
                      src={result.beforeUrl}
                      alt={`${result.label} — before`}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={800}
                    />
                    <figcaption>Before</figcaption>
                  </figure>
                  <figure className="result-card__shot">
                    <img
                      src={result.afterUrl}
                      alt={`${result.label} — after`}
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={800}
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
