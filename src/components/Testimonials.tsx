import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Priya S.',
    location: 'Pokhara',
    treatment: 'Acne & Pigmentation Treatment',
    rating: 5,
    quote: 'After years of struggling with hormonal acne, I finally found a clinic that approached my skin medically rather than cosmetically. Dr. Acharya created a treatment plan that addressed the root cause. Three months later, my skin is clearer than it has been in a decade.',
    initial: 'P',
  },
  {
    name: 'Rohan M.',
    location: 'Pokhara',
    treatment: 'PRP Hair Restoration',
    rating: 5,
    quote: 'I was skeptical about PRP therapy but the consultation was thorough and honest — Dr. Acharya explained exactly what to expect and what not to expect. Four sessions in, my hair density has noticeably improved. The professionalism here is unlike any clinic I have visited.',
    initial: 'R',
  },
  {
    name: 'Sunita T.',
    location: 'Kaski',
    treatment: 'Chemical Peel & Skin Rejuvenation',
    rating: 5,
    quote: 'The clinic feels different from the moment you walk in. Clean, calm, and clinical in the best way. My skin tone is significantly more even after the peel series, and the team was genuinely attentive throughout every session.',
    initial: 'S',
  },
  {
    name: 'Aarav K.',
    location: 'Pokhara',
    treatment: 'GFC Hair Therapy',
    rating: 5,
    quote: 'GFC therapy at Pokhara Skin and Hair Clinic genuinely changed how I feel about my hair. I came in feeling resigned about my hairline. Three months after treatment, I feel confident again. The expertise here is real.',
    initial: 'A',
  },
  {
    name: 'Manjula R.',
    location: 'Lekhnath',
    treatment: 'Laser Pigmentation Treatment',
    rating: 5,
    quote: 'I travelled from Lekhnath specifically for this clinic after reading about Dr. Acharya. Worth every kilometer. The laser treatment for my pigmentation was precise, painless, and the results were visible within two weeks.',
    initial: 'M',
  },
  {
    name: 'Deepa B.',
    location: 'Pokhara',
    treatment: 'Botox & Filler Consultation',
    rating: 5,
    quote: 'What I appreciated most was the honest, no-pressure consultation. Dr. Acharya advised me against a treatment I thought I wanted and suggested an alternative that has given me genuinely natural results. That kind of integrity is rare.',
    initial: 'D',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" fill="#A0896E">
          <path d="M5 1l1.2 2.5L9 3.9 7 5.8l.5 2.7L5 7.1 2.5 8.5 3 5.8 1 3.9l2.8-.4z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleCount = 3;

  const visibleTestimonials = testimonials.slice(activeIndex, activeIndex + visibleCount);

  return (
    <section className="bg-[#F2EDE6] section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Patient Stories
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1]"
            >
              Voices of{' '}
              <em className="italic text-[#A0896E]">Trust</em>
            </motion.h2>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: inView ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex gap-2"
            >
              <button
                onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="w-10 h-10 border border-[#C4B8A8] flex items-center justify-center text-[#6B6560] hover:border-[#2C2C2C] hover:text-[#2C2C2C] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 1L3 7l6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={() => setActiveIndex(Math.min(testimonials.length - visibleCount, activeIndex + 1))}
                disabled={activeIndex >= testimonials.length - visibleCount}
                className="w-10 h-10 border border-[#C4B8A8] flex items-center justify-center text-[#6B6560] hover:border-[#2C2C2C] hover:text-[#2C2C2C] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((t, i) => {
              return (
                <motion.div
                  key={t.name + activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="testimonial-card bg-[#FAF8F5] p-8 flex flex-col"
                >
                  {/* Quote mark */}
                  <div className="font-serif text-5xl text-[#E8DDD4] leading-none mb-4 font-light">"</div>

                  <p className="font-sans text-[#6B6560] text-sm leading-[1.9] font-light flex-1 mb-6">
                    {t.quote}
                  </p>

                  <div className="border-t border-[#E8DDD4] pt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EDE8DF] border border-[#E8DDD4] flex items-center justify-center shrink-0">
                        <span className="font-serif text-sm text-[#A0896E]">{t.initial}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-sans text-xs font-medium text-[#2C2C2C]">{t.name}</span>
                          <StarRating count={t.rating} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[9px] tracking-wide text-[#A0896E] uppercase">{t.location}</span>
                          <span className="text-[#C4B8A8]">·</span>
                          <span className="font-sans text-[9px] text-[#6B6560] italic">{t.treatment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-1.5 mt-10">
          {Array.from({ length: testimonials.length - visibleCount + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-5 h-1.5 bg-[#A0896E]' : 'w-1.5 h-1.5 bg-[#C4B8A8]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
