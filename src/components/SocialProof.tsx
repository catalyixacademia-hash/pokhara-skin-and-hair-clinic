import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useTestimonials } from '../hooks/useTestimonials';

export default function SocialProof() {
  const { testimonials } = useTestimonials();
  const featured = testimonials.slice(0, 3);

  return (
    <section className="bg-surface section-padding border-t border-line">
      <Container>
        <Reveal>
          <SectionIntro
            index="05"
            title="Patient experiences"
            lede="Selected feedback from patients who visited the clinic."
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.06}>
              <blockquote className="quote-block">
                <p className="font-body text-sm text-muted leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer>
                  <cite className="font-display text-sm text-ink not-italic block">
                    {item.name}
                  </cite>
                  <p className="font-mono text-xs text-muted mt-1">
                    {item.location} · {item.treatment}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
