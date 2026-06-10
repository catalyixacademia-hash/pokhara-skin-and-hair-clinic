import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const trustItems = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="9"/>
        <path d="M11 7v4l3 2"/>
      </svg>
    ),
    label: 'Board Certified Dermatologist',
    sub: 'MD Qualified Expert',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="18" height="14" rx="2"/>
        <path d="M2 9h18"/>
        <circle cx="7" cy="14" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="11" cy="14" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="15" cy="14" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    label: 'Modern Skin Analysis',
    sub: 'Skin diagnostics · Hair care',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>
        <circle cx="12" cy="9" r="2.5"/>
      </svg>
    ),
    label: 'Personalized Treatments',
    sub: 'Individual Care Plans',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <path d="M5 7H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/>
        <rect x="7" y="2" width="8" height="7" rx="1"/>
      </svg>
    ),
    label: 'Evidence-Based Medicine',
    sub: 'Safe Clinical Procedures',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 2C6 2 2 6 2 11s4 9 9 9 9-4 9-9"/>
        <path d="M16 2l4 4-7 7-4-2-5 5"/>
      </svg>
    ),
    label: 'Hair Restoration',
    sub: 'PRP · GFC · Exosome',
    compact: true,
  },
];

export default function TrustBar() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section ref={ref} className="bg-cream border-b border-blush py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col items-center text-center px-4 lg:border-r last:border-r-0 border-blush group"
            >
              <div className="text-bronze mb-3 group-hover:text-charcoal transition-colors duration-300">
                {item.icon}
              </div>
              <span
                className={`font-sans tracking-[0.08em] text-charcoal uppercase mb-0.5 ${
                  'compact' in item && item.compact
                    ? 'text-[10px] font-normal text-warm-gray'
                    : 'text-[11px] font-medium'
                }`}
              >
                {item.label}
              </span>
              <span className="font-sans text-[10px] text-sage tracking-wide">
                {item.sub}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
