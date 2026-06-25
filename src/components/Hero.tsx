import { useEffect, useState } from 'react';
import { doctor } from '../data/clinic';
import { useHeroSlides } from '../hooks/useHeroSlides';
import Container from './ui/Container';

export default function Hero() {
  const { heroImages } = useHeroSlides();
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    if (heroImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" aria-label="Hero">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        {heroImages.map((img, idx) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: currentImg === idx ? 1 : 0 }}
          >
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover object-center"
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div className="row-start-1 min-h-0" aria-hidden="true" />

      <div className="row-start-2 relative z-10 w-full pb-10 md:pb-16 pt-4">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-serif text-paper mb-6 md:mb-8">
              <span className="block text-display leading-[1.05] tracking-tight">
                Advanced Skin Care
              </span>
              <span className="block font-serif text-[clamp(1.375rem,3.25vw,2rem)] text-paper/80 mt-4 md:mt-5 font-normal leading-snug">
                &amp; Hair Restoration
              </span>
            </h1>

            <p className="font-sans text-paper/90 text-lg md:text-xl leading-relaxed md:leading-[1.75] mb-10 md:mb-12 max-w-xl">
              Expert dermatology and advanced skin treatments in Pokhara — with specialized
              hair restoration when you need it.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => scrollTo('#contact')}
                className="btn-primary w-full sm:w-auto bg-surface text-ink border-surface hover:bg-transparent hover:text-paper"
              >
                Book Appointment
              </button>
              <button
                type="button"
                onClick={() => scrollTo('#services')}
                className="btn-outline w-full sm:w-auto"
              >
                Explore Treatments
              </button>
            </div>

            <div className="mt-10 md:mt-12 flex items-center gap-4 pt-8 md:pt-10 border-t border-paper/20">
              <div className="w-10 h-10 rounded-full border border-paper/30 flex items-center justify-center shrink-0">
                <span className="text-paper/90 text-[10px] font-medium">MD</span>
              </div>
              <div>
                <p className="font-sans text-sm md:text-base text-paper">{doctor.name}</p>
                <p className="font-sans text-xs md:text-sm text-paper/70 mt-0.5">{doctor.title}</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <div className="absolute bottom-6 right-4 md:right-8 flex gap-2 z-10">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentImg(idx)}
            className={`touch-target rounded-full transition-all duration-300 ${
              currentImg === idx ? 'w-8 h-1.5 bg-surface' : 'w-1.5 h-1.5 bg-surface/40'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
