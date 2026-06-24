import { useState, useRef, useCallback } from 'react';
import { useResults } from '../hooks/useResults';
import type { ResultItem } from '../hooks/useResults';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

function CompareSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(5, Math.min(95, x)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="comparison-slider relative w-full aspect-[4/5] select-none"
      onMouseDown={() => { isDragging.current = true; }}
      onMouseUp={() => { isDragging.current = false; }}
      onMouseLeave={() => { isDragging.current = false; }}
      onMouseMove={(e) => { if (isDragging.current) handleMove(e.clientX); }}
      onTouchStart={() => { isDragging.current = true; }}
      onTouchEnd={() => { isDragging.current = false; }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      <div className="absolute inset-0">
        <img src={before} alt="Before treatment" className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-3 left-3 bg-ink/80 text-paper text-xs px-2 py-1">Before</span>
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <img src={after} alt="After treatment" className="w-full h-full object-cover" loading="lazy" />
        <span className="absolute top-3 right-3 bg-accent text-paper text-xs px-2 py-1">After</span>
      </div>
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-paper"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-paper border border-line shadow flex items-center justify-center touch-target">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h-2M13 7h-2M5 4l-2 3 2 3M9 4l2 3-2 3" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ result, compact = false }: { result: ResultItem; compact?: boolean }) {
  return (
    <article className={compact ? 'max-w-md' : 'border-l-skin pl-4'}>
      <CompareSlider before={result.before} after={result.after} />
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg text-ink">{result.label}</h3>
          <p className="font-sans text-sm text-muted mt-0.5">{result.duration}</p>
        </div>
        <button
          type="button"
          onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-sans text-sm text-accent hover:text-ink border-none bg-transparent cursor-pointer touch-target text-left sm:text-right"
        >
          Book similar →
        </button>
      </div>
    </article>
  );
}

export default function Results() {
  const { skinResults, hairResults } = useResults();

  return (
    <section id="results" className="bg-paper section-padding border-t border-line">
      <Container>
        <SectionHeader
          label="Patient results"
          title="Real outcomes, authentic stories"
          lede="Results vary by skin type and treatment plan. Images represent genuine patient outcomes."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {skinResults.map((result) => (
            <ResultCard key={result.label} result={result} />
          ))}
        </div>

        <div className="border-t border-line pt-10">
          <p className="category-hair mb-6">Hair restoration results</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {hairResults.map((result) => (
              <ResultCard key={result.label} result={result} compact />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
