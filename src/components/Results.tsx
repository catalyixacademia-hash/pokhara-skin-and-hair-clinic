import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useResults } from '../hooks/useResults';

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

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  return (
    <div
      ref={containerRef}
      className="comparison-slider relative w-full aspect-[4/5] select-none"
      onMouseDown={() => {
        isDragging.current = true;
      }}
      onMouseUp={() => {
        isDragging.current = false;
      }}
      onMouseLeave={() => {
        isDragging.current = false;
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before */}
      <div className="absolute inset-0">
        <img
          src={before}
          alt="Before treatment"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-[#1A1816]/70 px-3 py-1">
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#C4B8A8]">
            Before
          </span>
        </div>
      </div>

      {/* After */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={after}
          alt="After treatment"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-[#A0896E]/80 px-3 py-1">
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#FAF8F5]">
            After
          </span>
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[#FAF8F5] shadow-lg cursor-col-resize"
        style={{ left: `${position}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#FAF8F5] shadow-xl flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 7h-2M13 7h-2M5 4l-2 3 2 3M9 4l2 3-2 3"
              stroke="#2C2C2C"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

type ResultCardProps = {
  result: (typeof skinResults)[0];
  index: number;
  compact?: boolean;
};

function ResultCard({ result, index, compact = false }: ResultCardProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className={compact ? 'max-w-md' : 'group border-l-skin pl-4'}
    >
      <CompareSlider before={result.before} after={result.after} />
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-light text-[#2C2C2C]">{result.label}</h3>
          <p className="font-sans text-[10px] text-[#A0896E] tracking-wide mt-0.5">
            {result.duration}
          </p>
        </div>
        <button
          onClick={() =>
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="font-sans text-[10px] tracking-[0.15em] uppercase text-[#6B6560] hover:text-[#A0896E] transition-colors duration-300 flex items-center gap-1.5 border-none bg-transparent cursor-pointer"
        >
          Book Similar
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M1 6h10M6 1l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

export default function Results() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { skinResults, hairResults } = useResults();

  return (
    <section id="results" className="bg-ivory section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Patient Results
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1]"
            >
              Real Results,{' '}
              <em className="italic text-[#A0896E]">Authentic</em> Stories
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-sans text-[10px] tracking-[0.1em] text-[#A0896E] italic max-w-xs text-right hidden lg:block"
            >
              Results vary based on skin type and treatment plan. All images represent genuine patient outcomes.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 mb-12">
          {skinResults.map((result, i) => (
            <ResultCard key={result.label} result={result} index={i} />
          ))}
        </div>

        <div className="border-t border-blush pt-10">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-hair-accent mb-6">
            Hair Restoration Results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl">
            {hairResults.map((result, i) => (
              <ResultCard key={result.label} result={result} index={i} compact />
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 text-center font-sans text-[10px] text-[#A0896E] italic tracking-wide lg:hidden"
        >
          Results vary based on skin type and treatment plan.
        </motion.p>
      </div>
    </section>
  );
}
