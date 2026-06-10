import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { social } from '../data/clinic';
import { useGallery } from '../hooks/useGallery';

type GalleryItemProps = {
  item: { img: string; label: string; tag: string; tall: boolean };
  index: number;
};

function GalleryItem({ item, index }: GalleryItemProps) {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.96 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
      className={`social-item group cursor-pointer ${item.tall ? 'md:row-span-2' : ''}`}
    >
      <div
        className={`w-full overflow-hidden relative ${item.tall ? 'aspect-[1/2]' : 'aspect-square'}`}
      >
        <img
          src={item.img}
          alt={item.label}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="overlay absolute inset-0 bg-[rgba(26,24,22,0)] group-hover:bg-[rgba(26,24,22,0.45)] transition-all duration-400 flex items-center justify-center">
          <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#E8DDD4] block mb-1">
              {item.tag}
            </span>
            <span className="font-serif text-sm text-[#FAF8F5] font-light">{item.label}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialGallery() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { galleryItems } = useGallery();

  return (
    <section id="gallery" className="bg-bone section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Clinic Gallery
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1]"
            >
              Inside the{' '}
              <em className="italic text-[#A0896E]">Clinic</em>
            </motion.h2>

            <div className="flex flex-wrap items-center gap-4">
              <motion.a
                href={social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#6B6560] hover:text-[#A0896E] transition-colors duration-300 flex items-center gap-2"
              >
                Follow on Instagram
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M7 1l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
              <motion.a
                href={social.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#6B6560] hover:text-[#A0896E] transition-colors duration-300 flex items-center gap-2"
              >
                Follow on TikTok
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 7h12M7 1l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleryItems.map((item, i) => (
            <GalleryItem key={item.label} item={item} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 10 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href={social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A0896E"
              strokeWidth="1.5"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1" fill="#A0896E" stroke="none" />
            </svg>
            <span className="font-sans text-[11px] tracking-[0.2em] text-[#A0896E]">
              {social.instagram.handle}
            </span>
          </a>
          <a
            href={social.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#A0896E">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            <span className="font-sans text-[11px] tracking-[0.2em] text-[#A0896E]">
              {social.tiktok.handle}
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
