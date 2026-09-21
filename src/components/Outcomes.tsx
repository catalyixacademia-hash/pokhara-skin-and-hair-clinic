import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';
import { fallbackResults } from '../data/results';
import { useResults } from '../hooks/useResults';
import { scrollToId } from '../lib/scroll';

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  label: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function BeforeAfterSlider({ beforeUrl, afterUrl, label }: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const sliderRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const demoRanRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const updateFromClientX = useCallback((clientX: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(pct, 0, 100));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || demoRanRef.current) return;

    const el = sliderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || demoRanRef.current) return;

        demoRanRef.current = true;
        observer.disconnect();

        const sequence = [
          { value: 30, delay: 0 },
          { value: 70, delay: 600 },
          { value: 50, delay: 1200 },
        ];

        sequence.forEach(({ value, delay }) => {
          window.setTimeout(() => setPosition(value), delay);
        });
      },
      { threshold: 0.45 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };

    const onPointerUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [updateFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 5;
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        setPosition((p) => clamp(p - step, 0, 100));
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        setPosition((p) => clamp(p + step, 0, 100));
        break;
      case 'Home':
        e.preventDefault();
        setPosition(0);
        break;
      case 'End':
        e.preventDefault();
        setPosition(100);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={sliderRef}
      className="ba-slider"
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} — before and after comparison`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => {
        draggingRef.current = true;
        sliderRef.current?.setPointerCapture(e.pointerId);
        updateFromClientX(e.clientX);
      }}
    >
      <img
        src={beforeUrl}
        alt={`${label} — before`}
        className="ba-slider__img"
        draggable={false}
        loading="lazy"
        decoding="async"
      />
      <div className="ba-slider__after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img
          src={afterUrl}
          alt={`${label} — after`}
          className="ba-slider__img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
      <span className="ba-slider__label ba-slider__label--before">Before</span>
      <span className="ba-slider__label ba-slider__label--after">After</span>
      <div
        className="ba-slider__handle"
        style={{ left: `${position}%` }}
        aria-hidden="true"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <span className="ba-slider__knob">↔</span>
      </div>
    </div>
  );
}

export default function Outcomes() {
  const { results, fromDb } = useResults();
  const display = fromDb && results.length > 0 ? results : fallbackResults;

  return (
    <section
      id="results"
      className="bg-surface-warm section-padding"
      aria-labelledby="results-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="04"
            title="Patient results"
            titleId="results-heading"
            lede="Illustrative before-and-after images. Individual results vary."
          />
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-10 items-stretch">
          {display.map((result) => (
            <StaggerItem key={result.id} as="article" className="result-card h-full">
              <BeforeAfterSlider
                beforeUrl={result.beforeUrl}
                afterUrl={result.afterUrl}
                label={result.label}
              />
              <div className="result-card__meta">
                <h3 className="font-display text-ink">{result.label}</h3>
                <p className="font-body text-caption text-muted">
                  Illustrative images · individual results vary
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button type="button" onClick={() => scrollToId('contact')} className="btn-primary">
              Book a consultation
            </button>
            <p className="font-body text-sm text-muted max-w-md">
              Illustrative images · individual results vary. We assess your goals in clinic and
              recommend only what is medically appropriate.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
