import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useTestimonials } from '../hooks/useTestimonials';
import { maps } from '../data/clinic';

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

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {featured.map((item, i) => (
            <Reveal key={item.name} className="h-full" delay={i * 0.06}>
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

        <Reveal delay={0.12}>
          <div className="mt-10 flex justify-center">
            <a
              href={maps.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-outline inline-flex items-center gap-2"
            >
              Read Google reviews
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
