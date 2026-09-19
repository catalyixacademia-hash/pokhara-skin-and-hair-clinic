import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useResults } from '../hooks/useResults';
import { fallbackResults } from '../data/results';

export default function Outcomes() {
  const { results, fromDb } = useResults();
  // Clinic photography shipped in the repo; CMS rows win only when staff publish cases.
  const display = fromDb && results.length > 0 ? results : fallbackResults;

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
            index="04"
            title="Patient results"
            titleId="results-heading"
            lede="Selected clinical photography from our Pokhara practice. Individual results vary."
          />
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 items-stretch">
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
                      width={824}
                      height={1024}
                    />
                    <figcaption>Before</figcaption>
                  </figure>
                  <figure className="result-card__shot">
                    <img
                      src={result.afterUrl}
                      alt={`${result.label} — after`}
                      loading="lazy"
                      decoding="async"
                      width={824}
                      height={1024}
                    />
                    <figcaption>After</figcaption>
                  </figure>
                </div>
                <div className="result-card__meta">
                  <h3 className="font-display text-ink">{result.label}</h3>
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
