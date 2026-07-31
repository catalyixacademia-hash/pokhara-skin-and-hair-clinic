import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import TreatmentRow from './ui/TreatmentRow';
import Reveal from './motion/Reveal';
import TreatmentDetailSheet from './TreatmentDetailSheet';
import { useServices } from '../hooks/useServices';
import type { ServiceItem } from '../data/services';

type Selected = { service: ServiceItem; category: 'skin' | 'hair' };

function serviceAnchorId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Treatments() {
  const { skin: skinServices, hair: hairServices } = useServices();
  const [selected, setSelected] = useState<Selected | null>(null);

  const allByAnchor = useMemo(() => {
    const map = new Map<string, Selected>();
    for (const s of skinServices) {
      map.set(serviceAnchorId(s.title), { service: s, category: 'skin' });
    }
    for (const s of hairServices) {
      map.set(serviceAnchorId(s.title), { service: s, category: 'hair' });
    }
    return map;
  }, [skinServices, hairServices]);

  const openFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (!hash || hash === 'services' || hash === 'hair-services') return;
    const match = allByAnchor.get(hash);
    if (match) setSelected(match);
  }, [allByAnchor]);

  useEffect(() => {
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [openFromHash]);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-surface section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="01"
            title="Treatments"
            lede="Skin care is our core specialty. Hair restoration and aesthetic procedures complement comprehensive dermatology."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="space-y-8 mb-12">
            <h3 className="category-heading">Skin care — primary specialty</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinServices.map((service) => (
                <button
                  key={service.title}
                  type="button"
                  id={serviceAnchorId(service.title)}
                  className="text-left w-full bg-transparent border-none p-0 cursor-pointer scroll-mt-28"
                  onClick={() => setSelected({ service, category: 'skin' })}
                >
                  <TreatmentRow
                    title={service.title}
                    description={service.description}
                    img={service.img}
                    category="skin"
                    featured
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button type="button" onClick={scrollToContact} className="btn-primary">
                Book a skin consultation
              </button>
              <button
                type="button"
                onClick={() =>
                  document.querySelector('#hair-services')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="font-body text-base text-muted hover:text-accent underline-offset-4 hover:underline bg-transparent border-none cursor-pointer text-left touch-target"
              >
                See hair restoration ↓
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div id="hair-services" className="space-y-8 scroll-mt-24">
            <h3 className="category-heading">Hair restoration — complementary care</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairServices.map((service) => (
                <button
                  key={service.title}
                  type="button"
                  id={serviceAnchorId(service.title)}
                  className="text-left w-full bg-transparent border-none p-0 cursor-pointer scroll-mt-28"
                  onClick={() => setSelected({ service, category: 'hair' })}
                >
                  <TreatmentRow
                    title={service.title}
                    description={service.description}
                    img={service.img}
                    category="hair"
                    featured
                  />
                </button>
              ))}
            </div>
            <p className="font-body text-sm text-muted">
              <button
                type="button"
                onClick={scrollToContact}
                className="text-secondary hover:text-accent underline-offset-4 hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit"
              >
                Request a hair restoration visit
              </button>
              {' '}
              — we will confirm the right protocol during your consultation.
            </p>
          </div>
        </Reveal>
      </Container>

      <TreatmentDetailSheet
        service={selected?.service ?? null}
        category={selected?.category ?? 'skin'}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
