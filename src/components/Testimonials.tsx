import { useEffect, useState } from 'react';
import { useTestimonials } from '../hooks/useTestimonials';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

function useVisibleCount() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setCount(3);
      else if (window.matchMedia('(min-width: 768px)').matches) setCount(2);
      else setCount(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-accent">
          <path d="M5 1l1.2 2.5L9 3.9 7 5.8l.5 2.7L5 7.1 2.5 8.5 3 5.8 1 3.9l2.8-.4z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { testimonials } = useTestimonials();
  const visibleCount = useVisibleCount();
  const [activeIndex, setActiveIndex] = useState(0);

  const maxIndex = Math.max(0, testimonials.length - visibleCount);
  const visible = testimonials.slice(activeIndex, activeIndex + visibleCount);

  useEffect(() => {
    setActiveIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  return (
    <section className="bg-accent-soft section-padding">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <SectionHeader
            label="Patient stories"
            title="Trusted by patients across Gandaki"
            className="mb-0"
          />
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
              disabled={activeIndex === 0}
              className="touch-target border border-line flex items-center justify-center text-muted hover:text-ink hover:border-ink disabled:opacity-30"
              aria-label="Previous testimonials"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex(Math.min(maxIndex, activeIndex + 1))}
              disabled={activeIndex >= maxIndex}
              className="touch-target border border-line flex items-center justify-center text-muted hover:text-ink hover:border-ink disabled:opacity-30"
              aria-label="Next testimonials"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((t) => (
            <article key={`${t.name}-${activeIndex}`} className="testimonial-card p-6 flex flex-col">
              <p className="font-sans text-muted text-base leading-relaxed flex-1 mb-6">&ldquo;{t.quote}&rdquo;</p>
              <div className="border-t border-line pt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent-soft border border-line flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm text-accent">{t.initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-sans text-sm font-medium text-ink truncate">{t.name}</span>
                    <StarRating count={t.rating} />
                  </div>
                  <p className="font-sans text-xs text-muted truncate">
                    {t.location} · {t.treatment}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {maxIndex > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`touch-target rounded-full transition-all ${
                  i === activeIndex ? 'w-6 h-1.5 bg-accent' : 'w-1.5 h-1.5 bg-line'
                }`}
                aria-label={`Go to testimonial set ${i + 1}`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
