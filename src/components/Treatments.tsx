import { useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import TreatmentRow from './ui/TreatmentRow';
import Reveal from './motion/Reveal';
import { useServices } from '../hooks/useServices';
import { cn } from '../utils/cn';

export default function Treatments() {
  const [aestheticOpen, setAestheticOpen] = useState(false);
  const { skin: skinServices, hair: hairServices, aesthetic: aestheticServices } = useServices();

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-surface section-padding border-t border-line">
      <Container>
        <Reveal>
          <SectionIntro
            index="01"
            title="Treatments"
            lede="Skin care is our core specialty. Hair restoration and aesthetic procedures complement comprehensive dermatology."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mb-12">
            <p className="mono-label mb-6">Skin care — primary specialty</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinServices.map((service) => (
                <TreatmentRow
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="skin"
                  featured
                  onSelect={scrollToContact}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="pt-8 border-t border-line">
            <p className="mono-label text-hair-accent mb-6">Hair restoration — complementary care</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairServices.map((service) => (
                <TreatmentRow
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="hair"
                  featured
                  onSelect={scrollToContact}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="pt-8 mt-8 border-t border-line">
            <button
              type="button"
              onClick={() => setAestheticOpen(!aestheticOpen)}
              className="flex items-center justify-between w-full text-left touch-target py-2"
              aria-expanded={aestheticOpen}
            >
              <span className="mono-label">Aesthetic procedures</span>
              <span className="font-mono text-sm text-muted" aria-hidden>
                {aestheticOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-out',
                aestheticOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {aestheticServices.map((service) => (
                    <TreatmentRow
                      key={service.title}
                      title={service.title}
                      description={service.description}
                      img={service.img}
                      category="aesthetic"
                      featured
                      onSelect={scrollToContact}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 pt-8 border-t border-line">
            <button type="button" onClick={scrollToContact} className="btn-primary w-full sm:w-auto">
              Request a consultation
            </button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
