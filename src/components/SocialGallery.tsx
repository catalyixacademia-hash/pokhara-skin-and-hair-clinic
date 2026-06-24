import { social } from '../data/clinic';
import { useGallery } from '../hooks/useGallery';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

export default function SocialGallery() {
  const { galleryItems } = useGallery();

  return (
    <section id="gallery" className="bg-paper section-padding border-t border-line">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <SectionHeader label="Clinic gallery" title="Inside the clinic" className="mb-0" />
          <div className="flex flex-wrap gap-4">
            <a
              href={social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted hover:text-ink touch-target flex items-center"
            >
              Instagram →
            </a>
            <a
              href={social.tiktok.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-muted hover:text-ink touch-target flex items-center"
            >
              TikTok →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {galleryItems.map((item) => (
            <figure key={item.label} className="social-item group aspect-square overflow-hidden bg-line">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <figcaption className="overlay">
                <div className="text-center p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-sans text-xs text-paper/80 uppercase">{item.tag}</p>
                  <p className="font-serif text-sm text-paper">{item.label}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
