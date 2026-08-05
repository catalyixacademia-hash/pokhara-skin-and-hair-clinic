import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import { TreatmentCard, TreatmentRow } from './ui/TreatmentCard';
import Reveal from './motion/Reveal';
import TreatmentDetailSheet from './TreatmentDetailSheet';
import { useServices } from '../hooks/useServices';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { ServiceItem } from '../data/services';

type Selected = { service: ServiceItem; category: 'skin' | 'hair' };

/**
 * Cards shown before the disclosure. Phones get four so the section stays
 * roughly two screens instead of five; from `sm` up the grid is multi-column so
 * six still reads as a complete block.
 */
const SKIN_PREVIEW_MOBILE = 4;
const SKIN_PREVIEW_WIDE = 6;

function serviceAnchorId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Treatments() {
  const { skin: skinServices, hair: hairServices } = useServices();
  const [selected, setSelected] = useState<Selected | null>(null);
  const [showAllSkin, setShowAllSkin] = useState(false);
  const isWide = useMediaQuery('(min-width: 640px)');
  const previewCount = isWide ? SKIN_PREVIEW_WIDE : SKIN_PREVIEW_MOBILE;

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

  /*
   * A deep link to a collapsed skin treatment must still resolve, so expand the
   * list whenever the target sits past the preview cut-off.
   */
  useEffect(() => {
    if (showAllSkin) return;
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (!hash) return;
    const index = skinServices.findIndex((s) => serviceAnchorId(s.title) === hash);
    if (index >= previewCount) setShowAllSkin(true);
  }, [skinServices, showAllSkin, previewCount]);

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasHiddenSkin = skinServices.length > previewCount;
  const visibleSkin = showAllSkin ? skinServices : skinServices.slice(0, previewCount);
  const hiddenSkinCount = skinServices.length - previewCount;

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

        {/* Primary: skin care — image-led cards. */}
        <Reveal delay={0.05}>
          <div className="mb-14 md:mb-16">
            <div className="treatment-group__head">
              <h3 className="treatment-group__eyebrow">Skin care</h3>
              <p className="treatment-group__note">Primary specialty · led by Dr. Prakash Acharya</p>
            </div>

            <div className="treatment-grid">
              {visibleSkin.map((service) => (
                <TreatmentCard
                  key={service.title}
                  id={serviceAnchorId(service.title)}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="skin"
                  onSelect={() => setSelected({ service, category: 'skin' })}
                />
              ))}
            </div>

            {hasHiddenSkin && !showAllSkin && (
              <button
                type="button"
                className="disclosure-btn"
                aria-expanded={false}
                onClick={() => setShowAllSkin(true)}
              >
                Show {hiddenSkinCount} more skin treatment{hiddenSkinCount === 1 ? '' : 's'}
                <ChevronDownIcon />
              </button>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <button type="button" onClick={scrollToContact} className="btn-primary">
                Book a skin consultation
              </button>
              <p className="font-body text-sm text-muted">
                Assessment first — we recommend only what is medically appropriate.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Secondary: hair restoration — compact rows. */}
        <Reveal delay={0.1}>
          <div id="hair-services" className="scroll-mt-24">
            <div className="treatment-group__head">
              <h3 className="treatment-group__eyebrow treatment-group__eyebrow--secondary">
                Hair restoration
              </h3>
              <p className="treatment-group__note">Complementary care · scalp &amp; density</p>
            </div>

            <div className="treatment-grid treatment-grid--rows">
              {hairServices.map((service) => (
                <TreatmentRow
                  key={service.title}
                  id={serviceAnchorId(service.title)}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="hair"
                  onSelect={() => setSelected({ service, category: 'hair' })}
                />
              ))}
            </div>

            <p className="font-body text-sm text-muted mt-5">
              <button
                type="button"
                onClick={scrollToContact}
                className="inline-block py-1 text-secondary hover:text-accent underline underline-offset-4 bg-transparent border-none cursor-pointer px-0 font-inherit"
              >
                Request a hair restoration visit
              </button>
              {' '}— we will confirm the right protocol during your consultation.
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
