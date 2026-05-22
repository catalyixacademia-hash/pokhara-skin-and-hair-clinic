import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const heroImages = [
  'https://images.pexels.com/photos/32260065/pexels-photo-32260065.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
  'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920',
];

export default function Hero() {
  const [currentImg, setCurrentImg] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleBookClick = () => {
    const el = document.querySelector('#contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreClick = () => {
    const el = document.querySelector('#services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-[#1A1816]">
      {/* Background images */}
      {heroImages.map((img, idx) => (
        <div
          key={img}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: currentImg === idx ? 1 : 0 }}
        >
          <img
            src={img}
            alt="Dermatology clinic"
            className="w-full h-full object-cover scale-105"
            style={{
              transform: currentImg === idx ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 8s ease-out',
            }}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Cinematic overlay */}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1816]/70 via-[#1A1816]/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-[#A0896E]" />
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#C4B8A8] font-light">
                Pokhara, Nepal · Est. Medical Excellence
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="font-serif text-[clamp(2.6rem,7vw,5rem)] font-light text-[#FAF8F5] leading-[1.08] tracking-[-0.01em] mb-6"
            >
              Advanced Skin & Hair
              <br />
              <em className="font-light italic text-[#E8DDD4]">Care Rooted in</em>
              <br />
              Medical Expertise
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="font-sans text-[#C4B8A8] text-base font-light leading-relaxed mb-10 max-w-xl"
            >
              Personalized dermatology and aesthetic treatments designed for healthy skin,
              confident hair, and natural results.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-wrap items-center gap-4"
            >
              <button onClick={handleBookClick} className="btn-primary">
                Book Appointment
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button onClick={handleExploreClick} className="btn-outline">
                Explore Treatments
              </button>
            </motion.div>

            {/* Doctor credential */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="mt-12 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[#A0896E]/30 border border-[#A0896E]/40 flex items-center justify-center">
                <span className="text-[#C4B8A8] text-xs">MD</span>
              </div>
              <div>
                <span className="font-sans text-[#FAF8F5] text-xs tracking-wide">
                  Dr. Prakash Acharya
                </span>
                <span className="font-sans text-[#6B6560] text-xs ml-2">
                  Consultant Dermatologist
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-12 flex gap-2 z-10">
        {heroImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImg(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentImg === idx
                ? 'w-6 h-1 bg-[#A0896E]'
                : 'w-1 h-1 bg-[#6B6560]'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#6B6560]">
          Scroll
        </span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-[#6B6560] to-transparent"
          animate={{ scaleY: [1, 0.3, 1], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
