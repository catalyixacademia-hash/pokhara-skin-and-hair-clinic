import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { aestheticServices } from '../data/services';
import TreatmentRow from './ui/TreatmentRow';
import TreatmentDetailSheet from './TreatmentDetailSheet';
import { useState } from 'react';
import type { ServiceItem } from '../data/services';

export default function Aesthetics() {
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  return (
    <section id="aesthetics" className="bg-surface section-padding border-t border-outline-variant">
      <Container>
        <Reveal>
          <SectionIntro
            index="04b"
            title="Aesthetic care"
            lede="Natural refinement with botox, fillers, anti-aging protocols, and laser hair reduction — planned after clinical assessment."
          />
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aestheticServices.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.05}>
              <button
                type="button"
                className="text-left w-full bg-transparent border-none p-0 cursor-pointer"
                onClick={() => setSelected(service)}
              >
                <TreatmentRow
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="aesthetic"
                  featured
                />
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      <TreatmentDetailSheet
        service={selected}
        category="aesthetic"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
