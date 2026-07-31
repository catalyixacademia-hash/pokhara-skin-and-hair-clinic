import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { useGallery } from '../hooks/useGallery';
import { cn } from '../utils/cn';

export default function Gallery() {
  const { items } = useGallery();

  return (
    <section id="gallery" className="bg-surface-container-low section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="03b"
            title="Inside the clinic"
            lede="A calm clinical environment opposite GMC Hospital in Nayabazar-8."
          />
        </Reveal>

        <div className="gallery-grid">
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              className={cn('gallery-grid__item', item.isTall && 'gallery-grid__item--tall')}
              delay={i * 0.04}
            >
              <figure className="gallery-card">
                <img src={item.imageUrl} alt={item.label} loading="lazy" decoding="async" />
                <figcaption>
                  {item.tag && <span className="gallery-card__tag">{item.tag}</span>}
                  <span className="gallery-card__label">{item.label}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
