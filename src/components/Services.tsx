import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import SectionHeader from './ui/SectionHeader';
import CategoryBadge from './ui/CategoryBadge';
import { cn } from '../utils/cn';
import { useServices } from '../hooks/useServices';
import type { ServiceItem } from '../data/services';

type ServiceCardProps = {
  service: ServiceItem;
  index: number;
  variant: 'featured' | 'standard' | 'compact';
  category: 'skin' | 'hair' | 'aesthetic';
};

function ServiceCard({ service, index, variant, category }: ServiceCardProps) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const chipClass =
    category === 'skin' ? 'chip-skin' : category === 'hair' ? 'chip-hair' : 'chip-aesthetic';

  const borderClass =
    category === 'skin'
      ? 'border-l-skin'
      : category === 'hair'
        ? 'border-l-hair'
        : 'border-l border-blush';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      className={cn(
        'treatment-card group relative bg-ivory border border-blush overflow-hidden cursor-pointer',
        borderClass,
        variant === 'compact' && 'min-w-[280px] w-[85%] shrink-0 snap-start',
        variant === 'featured' && 'md:col-span-1',
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={cn(
          'img-zoom overflow-hidden bg-blush',
          variant === 'compact' ? 'aspect-[16/10]' : 'aspect-[4/3]',
        )}
      >
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className={cn('p-6', variant === 'compact' && 'p-4')}>
        <h3
          className={cn(
            'font-serif font-light text-charcoal mb-2 leading-tight',
            variant === 'compact' ? 'text-lg' : 'text-xl',
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            'font-sans text-warm-gray leading-relaxed mb-4 font-light',
            variant === 'compact' ? 'text-[11px]' : 'text-xs',
          )}
        >
          {service.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.benefits.map((b) => (
            <span key={b} className={chipClass}>
              {b}
            </span>
          ))}
        </div>

        <div className="border-t border-blush pt-4 flex items-start gap-2">
          <div className="w-1 h-1 rounded-full bg-sage mt-1.5 shrink-0" />
          <span className="font-sans text-[10px] text-warm-gray leading-relaxed italic font-light">
            {service.result}
          </span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <button
                onClick={() =>
                  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="font-sans text-[10px] tracking-[0.18em] uppercase text-bronze flex items-center gap-2 hover:gap-3 transition-all duration-300 border-none bg-transparent cursor-pointer"
              >
                Book Consultation
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M7 1l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [aestheticOpen, setAestheticOpen] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { skin: skinServices, hair: hairServices, aesthetic: aestheticServices } = useServices();

  const featuredSkin = skinServices.filter((s) => s.featured);
  const standardSkin = skinServices.filter((s) => !s.featured);

  return (
    <section id="services" className="bg-bone section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref}>
          <SectionHeader
            eyebrow="Our Treatments"
            inView={inView}
            title={
              <>
                Skin Care First,{' '}
                <em className="italic text-bronze">Precisely</em> Delivered
              </>
            }
            subtitle="Advanced dermatology is our core specialty. Hair restoration and aesthetic procedures complement our comprehensive skin care."
          />
        </div>

        {/* Skin — always visible, primary */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <CategoryBadge variant="skin" />
            <span className="font-sans text-xs text-warm-gray font-light">
              Primary specialty
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {featuredSkin.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                variant="featured"
                category="skin"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardSkin.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i + featuredSkin.length}
                variant="standard"
                category="skin"
              />
            ))}
          </div>
        </div>

        {/* Hair — secondary band */}
        <div className="bg-cream border border-blush rounded-sm p-8 lg:p-10 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <CategoryBadge variant="hair" className="mb-3" />
              <h3 className="font-serif text-2xl font-light text-charcoal mb-2">
                Hair Restoration
              </h3>
              <p className="font-sans text-warm-gray text-sm font-light max-w-lg">
                Also specializing in hair loss solutions, scalp health, and density restoration.
              </p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory -mx-2 px-2">
            {hairServices.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                variant="compact"
                category="hair"
              />
            ))}
          </div>
        </div>

        {/* Aesthetic — tertiary accordion */}
        <div className="border border-blush bg-ivory">
          <button
            type="button"
            onClick={() => setAestheticOpen(!aestheticOpen)}
            className="w-full flex items-center justify-between px-6 py-5 text-left bg-transparent border-none cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <CategoryBadge variant="aesthetic" />
              <span className="font-serif text-lg font-light text-charcoal">
                Aesthetic Procedures
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className={cn(
                'text-warm-gray transition-transform duration-300',
                aestheticOpen && 'rotate-180',
              )}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          <AnimatePresence>
            {aestheticOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-8 pt-2">
                  {aestheticServices.map((service, i) => (
                    <ServiceCard
                      key={service.title}
                      service={service}
                      index={i}
                      variant="standard"
                      category="aesthetic"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="font-sans text-warm-gray text-sm mb-5 font-light">
            Not sure which treatment is right for you?
          </p>
          <button
            onClick={() =>
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-primary"
          >
            Book a Free Consultation
          </button>
        </motion.div>
      </div>
    </section>
  );
}
