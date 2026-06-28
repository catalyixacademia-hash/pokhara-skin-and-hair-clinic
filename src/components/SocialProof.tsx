import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useTestimonials } from '../hooks/useTestimonials';

export default function SocialProof() {
  const { testimonials } = useTestimonials();
  const featured = testimonials.slice(0, 3);

  return (
    <section className="bg-surface section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="05"
            title="Patient experiences"
            lede="Selected feedback from patients who visited the clinic."
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.06}>
              <blockquote className="testimonial-card">
                <p className="testimonial-card__quote">&ldquo;{item.quote}&rdquo;</p>
                <footer>
                  <cite className="text-label text-ink not-italic block">{item.name}</cite>
                  <p className="font-body text-caption text-muted mt-1 not-italic">
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
