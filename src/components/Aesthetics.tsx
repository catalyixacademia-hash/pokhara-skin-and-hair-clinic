import { useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { aestheticServices } from '../data/services';
import { TreatmentRow } from './ui/TreatmentCard';
import TreatmentDetailSheet from './TreatmentDetailSheet';
import type { ServiceItem } from '../data/services';

export default function Aesthetics() {
  const [selected, setSelected] = useState<ServiceItem | null>(null);

  return (
    <section
      id="aesthetics"
      className="bg-surface-container-low section-padding"
      aria-labelledby="aesthetics-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="05"
            title="Aesthetic care"
            titleId="aesthetics-heading"
            lede="Natural refinement with botox, fillers, anti-aging protocols, and laser hair reduction — planned after clinical assessment."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="treatment-grid treatment-grid--rows">
            {aestheticServices.map((service) => (
              <TreatmentRow
                key={service.title}
                title={service.title}
                description={service.description}
                img={service.img}
                category="aesthetic"
                onSelect={() => setSelected(service)}
              />
            ))}
          </div>
        </Reveal>
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
