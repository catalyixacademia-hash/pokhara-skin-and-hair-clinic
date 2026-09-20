import { useCallback, useEffect, useRef, useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useTestimonials } from '../hooks/useTestimonials';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { cn } from '../utils/cn';

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD = 48;

export default function SocialProof() {
  const { testimonials } = useTestimonials();
  const { settings } = useClinicSettings();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartX = useRef<number | null>(null);
  const count = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (paused || count <= 1) return;
    const timer = window.setInterval(goNext, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [paused, count, goNext]);

  const active = testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      className="proof-dark section-padding"
      aria-labelledby="testimonials-heading"
      aria-roledescription="carousel"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="07"
            title="Patient experiences"
            titleId="testimonials-heading"
            lede="Selected feedback from patients who visited the clinic."
            inverted
          />
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="proof-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onPointerDown={(e) => {
              pointerStartX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (pointerStartX.current === null) return;
              const delta = e.clientX - pointerStartX.current;
              pointerStartX.current = null;
              if (Math.abs(delta) < SWIPE_THRESHOLD) return;
              if (delta < 0) goNext();
              else goPrev();
            }}
          >
            {active && (
              <blockquote>
                <p className="proof-quote">&ldquo;{active.quote}&rdquo;</p>
                <footer className="proof-meta">
                  <cite className="not-italic">{active.name}</cite>
                  <span aria-hidden="true"> · </span>
                  {active.location}
                  {active.treatment ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {active.treatment}
                    </>
                  ) : null}
                </footer>
              </blockquote>
            )}

            {count > 1 && (
              <div className="proof-dots" role="tablist" aria-label="Testimonial slides">
                {testimonials.map((item, i) => (
                  <button
                    key={item.name}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Show testimonial from ${item.name}`}
                    className={cn('proof-dot', i === activeIndex && 'proof-dot--active')}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex justify-center">
            <a
              href={settings.maps.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary-outline inline-flex items-center gap-2 border-white/30 text-paper hover:bg-white/10"
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
