import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import { TreatmentCard } from './ui/TreatmentCard';
import Reveal from './motion/Reveal';
import TreatmentDetailSheet from './TreatmentDetailSheet';
import { useServices } from '../hooks/useServices';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { ServiceItem } from '../data/services';
import { scrollToId } from '../lib/scroll';
import { cn } from '../utils/cn';

type Category = 'skin' | 'hair' | 'aesthetic';
type Selected = { service: ServiceItem; category: Category };

const TABS: { id: Category; label: string; panelId: string }[] = [
  { id: 'skin', label: 'Skin', panelId: 'services' },
  { id: 'hair', label: 'Hair', panelId: 'hair-services' },
  { id: 'aesthetic', label: 'Aesthetic', panelId: 'aesthetics' },
];

const PANEL_NOTES: Record<Category, string> = {
  skin: 'Primary specialty · led by Dr. Prakash Acharya',
  hair: 'Complementary care · scalp & density',
  aesthetic: 'Natural refinement after clinical assessment',
};

function serviceAnchorId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function Treatments() {
  const { skin: skinServices, hair: hairServices, aesthetic: aestheticServices } = useServices();
  const [selected, setSelected] = useState<Selected | null>(null);
  const [tab, setTab] = useState<Category>('skin');
  const isWide = useMediaQuery('(min-width: 640px)');
  const prefersReducedMotion = useReducedMotion();

  const lists: Record<Category, ServiceItem[]> = useMemo(
    () => ({
      skin: skinServices,
      hair: hairServices,
      aesthetic: aestheticServices,
    }),
    [skinServices, hairServices, aestheticServices],
  );

  const allByAnchor = useMemo(() => {
    const map = new Map<string, Selected>();
    (Object.keys(lists) as Category[]).forEach((category) => {
      for (const s of lists[category]) {
        map.set(serviceAnchorId(s.title), { service: s, category });
      }
    });
    return map;
  }, [lists]);

  const selectTabFromHash = useCallback(() => {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (hash === 'hair-services') {
      setTab('hair');
      return;
    }
    if (hash === 'aesthetics') {
      setTab('aesthetic');
      return;
    }
    if (hash === 'services') {
      setTab('skin');
      return;
    }
    const match = allByAnchor.get(hash);
    if (match) {
      setTab(match.category);
      setSelected(match);
    }
  }, [allByAnchor]);

  useEffect(() => {
    selectTabFromHash();
    window.addEventListener('hashchange', selectTabFromHash);
    return () => window.removeEventListener('hashchange', selectTabFromHash);
  }, [selectTabFromHash]);

  const onTabChange = (next: Category) => {
    setTab(next);
    const panel = TABS.find((t) => t.id === next)?.panelId;
    if (panel) {
      history.replaceState(null, '', `#${panel}`);
    }
  };

  const scrollToContact = () => {
    scrollToId('#contact', { immediate: Boolean(prefersReducedMotion) });
  };

  const renderBento = (list: ServiceItem[], category: Category) => {
    const featured = list.find((s) => s.featured) ?? list[0];
    const rest = list.filter((s) => s !== featured);

    const cards = (
      <>
        {featured && (
          <div className={cn(isWide && 'treatment-bento__feature')}>
            <TreatmentCard
              id={serviceAnchorId(featured.title)}
              title={featured.title}
              description={featured.description}
              img={featured.img}
              category={category}
              layoutId={`treatment-img-${serviceAnchorId(featured.title)}`}
              onSelect={() => setSelected({ service: featured, category })}
            />
          </div>
        )}
        {rest.map((service) => (
          <TreatmentCard
            key={service.title}
            id={serviceAnchorId(service.title)}
            title={service.title}
            description={service.description}
            img={service.img}
            category={category}
            layoutId={`treatment-img-${serviceAnchorId(service.title)}`}
            onSelect={() => setSelected({ service, category })}
          />
        ))}
      </>
    );

    if (!isWide) {
      return <div className="treatment-snap">{cards}</div>;
    }

    return <div className="treatment-bento">{cards}</div>;
  };

  const panelMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35 },
      };

  return (
    <section id="services" className="bg-surface section-padding" aria-labelledby="services-heading">
      <Container>
        <Reveal>
          <SectionIntro
            index="01"
            title="Treatments"
            titleId="services-heading"
            lede="Skin care is our core specialty. Hair restoration and aesthetic procedures complement comprehensive dermatology."
          />
        </Reveal>

        <LayoutGroup>
          <div className="treatment-tabs" role="tablist" aria-label="Treatment categories">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={t.panelId}
                className={cn('treatment-tab', tab === t.id && 'treatment-tab--active')}
                onClick={() => onTabChange(t.id)}
              >
                {tab === t.id && !prefersReducedMotion && (
                  <motion.span
                    layoutId="treatment-tab-pill"
                    className="treatment-tab__pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                )}
                {tab === t.id && prefersReducedMotion && <span className="treatment-tab__pill" />}
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {TABS.map((t) =>
              tab === t.id ? (
                <motion.div
                  key={t.id}
                  id={t.panelId === 'services' ? 'services-panel' : t.panelId}
                  className={t.id !== 'skin' ? 'scroll-mt-24' : undefined}
                  role="tabpanel"
                  aria-labelledby={`tab-${t.id}`}
                  {...panelMotion}
                >
                  <p className="treatment-group__note mb-5">{PANEL_NOTES[t.id]}</p>
                  {renderBento(lists[t.id], t.id)}
                  {t.id === 'skin' && (
                    <Reveal delay={0.08}>
                      <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <button type="button" onClick={scrollToContact} className="btn-primary">
                          Book a skin consultation
                        </button>
                        <p className="font-body text-sm text-muted">
                          Assessment first — we recommend only what is medically appropriate.
                        </p>
                      </div>
                    </Reveal>
                  )}
                </motion.div>
              ) : null,
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* Keep hair/aesthetics anchors resolvable when those tabs are inactive */}
        {tab !== 'hair' && <div id="hair-services" className="sr-only" aria-hidden="true" />}
        {tab !== 'aesthetic' && <div id="aesthetics" className="sr-only" aria-hidden="true" />}
      </Container>

      <TreatmentDetailSheet
        service={selected?.service ?? null}
        category={selected?.category ?? 'skin'}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        layoutId={
          selected ? `treatment-img-${serviceAnchorId(selected.service.title)}` : undefined
        }
      />
    </section>
  );
}
