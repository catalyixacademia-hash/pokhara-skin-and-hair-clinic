import { useCallback, useEffect, useMemo, useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';
import { useGallery } from '../hooks/useGallery';
import { cn } from '../utils/cn';
import type { GalleryItem } from '../data/gallery';

function isHeroCrop(url: string): boolean {
  return url.toLowerCase().includes('clinic-hero');
}

function SwipeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h16m0 0-5-5m5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type LightboxProps = {
  item: GalleryItem;
  onClose: () => void;
};

function GalleryLightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="gallery-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
      onClick={onClose}
    >
      <button
        type="button"
        className="gallery-lightbox__close"
        aria-label="Close gallery image"
        onClick={onClose}
      >
        ×
      </button>
      <img
        className="gallery-lightbox__img"
        src={item.imageUrl}
        alt={item.label}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function Gallery() {
  const { items } = useGallery();
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = useMemo(
    () => items.filter((item) => !isHeroCrop(item.imageUrl)),
    [items],
  );

  const closeLightbox = useCallback(() => setLightboxItem(null), []);

  return (
    <section
      id="gallery"
      className="bg-surface section-padding"
      aria-labelledby="gallery-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="06"
            title="Inside the clinic"
            titleId="gallery-heading"
            lede="A calm clinical environment opposite GMC Hospital in Nayabazar-8."
          />
        </Reveal>

        <Stagger className="gallery-grid" role="group" aria-label="Clinic photographs" tabIndex={0}>
          {filteredItems.map((item) => (
            <StaggerItem
              key={item.id}
              className={cn('gallery-grid__item', item.isTall && 'gallery-grid__item--tall')}
            >
              <figure className="gallery-card">
                <button
                  type="button"
                  className="absolute inset-0 z-10 border-0 p-0 cursor-pointer bg-transparent"
                  onClick={() => setLightboxItem(item)}
                  aria-label={`View ${item.label}`}
                />
                <img
                  src={item.imageUrl}
                  alt={item.label}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={750}
                />
                <figcaption>
                  {item.tag && <span className="gallery-card__tag">{item.tag}</span>}
                  <span className="gallery-card__label">{item.label}</span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="gallery-hint">
          <SwipeIcon />
          Swipe to see more
        </p>
      </Container>

      {lightboxItem && <GalleryLightbox item={lightboxItem} onClose={closeLightbox} />}
    </section>
  );
}
