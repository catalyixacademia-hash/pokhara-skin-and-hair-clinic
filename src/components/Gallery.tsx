import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useGallery } from '../hooks/useGallery';
import { cn } from '../utils/cn';

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

export default function Gallery() {
  const { items } = useGallery();

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

        {/*
          Horizontal rail on phones, grid from `sm` up. `tabIndex` makes the
          scroll container keyboard-reachable, which browsers require for any
          scrollable region that holds no focusable children.
        */}
        <div
          className="gallery-grid"
          role="group"
          aria-label="Clinic photographs"
          tabIndex={0}
        >
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              className={cn('gallery-grid__item', item.isTall && 'gallery-grid__item--tall')}
              delay={Math.min(i, 5) * 0.04}
            >
              <figure className="gallery-card">
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
            </Reveal>
          ))}
        </div>

        <p className="gallery-hint">
          <SwipeIcon />
          Swipe to see more
        </p>
      </Container>
    </section>
  );
}
