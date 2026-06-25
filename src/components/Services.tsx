import { useState } from 'react';
import SectionHeader from './ui/SectionHeader';
import CategoryBadge from './ui/CategoryBadge';
import Container from './ui/Container';
import { cn } from '../utils/cn';
import { useServices } from '../hooks/useServices';
import type { ServiceItem } from '../data/services';

type ServiceCardProps = {
  service: ServiceItem;
  variant: 'featured' | 'standard' | 'compact';
  category: 'skin' | 'hair' | 'aesthetic';
};

function ServiceCard({ service, variant, category }: ServiceCardProps) {
  const chipClass =
    category === 'skin' ? 'chip-skin' : category === 'hair' ? 'chip-hair' : 'chip-aesthetic';

  const borderClass =
    category === 'skin'
      ? 'border-l-skin'
      : category === 'hair'
        ? 'border-l-hair'
        : 'border-l border-line';

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'treatment-card overflow-hidden min-w-[72vw] sm:min-w-[260px] max-w-[300px] shrink-0 snap-start flex flex-col',
          borderClass,
        )}
      >
        <div className="img-zoom bg-accent-soft aspect-[5/3] max-h-36">
          <img
            src={service.img}
            alt={service.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-serif text-ink text-base mb-1.5 leading-snug">{service.title}</h3>
          <p className="font-sans text-muted text-sm leading-relaxed line-clamp-2 mb-3 flex-1">
            {service.description}
          </p>
          <button
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary w-full text-sm mt-auto"
          >
            Learn more →
          </button>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        'treatment-card overflow-hidden flex flex-col h-full',
        borderClass,
      )}
    >
      <div className="img-zoom bg-accent-soft aspect-[4/3] shrink-0">
        <img src={service.img} alt={service.title} className="w-full h-full object-cover" loading="lazy" />
      </div>

      <div className="flex flex-col flex-1 p-5 md:p-6">
        <div className="flex-1">
          <h3 className="font-serif text-ink text-xl mb-2 leading-tight">
            {service.title}
          </h3>
          <p className="font-sans text-muted text-sm leading-relaxed mb-4">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {service.benefits.map((b) => (
              <span key={b} className={chipClass}>
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-line shrink-0">
          <p className="font-sans text-sm text-muted mb-4 min-h-[3rem] line-clamp-2">{service.result}</p>
          <button
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary w-full text-sm"
          >
            Book consultation →
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const [aestheticOpen, setAestheticOpen] = useState(false);
  const { skin: skinServices, hair: hairServices, aesthetic: aestheticServices } = useServices();

  const featuredSkin = skinServices.filter((s) => s.featured);
  const standardSkin = skinServices.filter((s) => !s.featured);

  return (
    <section id="services" className="bg-accent-soft section-padding border-t border-line">
      <Container>
        <SectionHeader
          label="Treatments"
          title="Skin care first, precisely delivered"
          lede="Advanced dermatology is our core specialty. Hair restoration and aesthetic procedures complement comprehensive skin care."
        />

        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <CategoryBadge variant="skin" />
            <span className="font-sans text-sm text-muted">Primary specialty</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5 items-stretch">
            {featuredSkin.map((service) => (
              <ServiceCard key={service.title} service={service} variant="featured" category="skin" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {standardSkin.map((service) => (
              <ServiceCard key={service.title} service={service} variant="standard" category="skin" />
            ))}
          </div>
        </div>

        <div className="bg-surface border border-line rounded-sm p-5 md:p-6 mb-10">
          <CategoryBadge variant="hair" className="mb-2 block" />
          <h3 className="font-serif text-xl text-ink mb-2">Hair restoration</h3>
          <p className="font-sans text-muted text-sm max-w-lg mb-5">
            Hair loss solutions, scalp health, and density restoration.
          </p>

          <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scroll-pl-4 -mx-4 px-4">
            {hairServices.map((service) => (
              <ServiceCard key={service.title} service={service} variant="compact" category="hair" />
            ))}
          </div>
        </div>

        <div className="border border-line bg-surface">
          <button
            type="button"
            onClick={() => setAestheticOpen(!aestheticOpen)}
            className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left bg-transparent border-none cursor-pointer touch-target"
          >
            <div className="flex items-center gap-3">
              <CategoryBadge variant="aesthetic" />
              <span className="font-serif text-lg text-ink">Aesthetic procedures</span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className={cn('text-muted transition-transform', aestheticOpen && 'rotate-180')}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>

          {aestheticOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 pb-8 md:px-6 items-stretch">
              {aestheticServices.map((service) => (
                <ServiceCard key={service.title} service={service} variant="standard" category="aesthetic" />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="font-sans text-muted text-sm mb-4">Not sure which treatment is right for you?</p>
          <button
            type="button"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Book a consultation
          </button>
        </div>
      </Container>
    </section>
  );
}
