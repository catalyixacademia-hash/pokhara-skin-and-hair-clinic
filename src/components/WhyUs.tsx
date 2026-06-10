import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { doctor } from '../data/clinic';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="14" r="11"/>
        <path d="M14 9v5l3 3"/>
      </svg>
    ),
    title: 'Personalized Consultation',
    body: 'Every patient is unique. We begin with a thorough evaluation before recommending any treatment, ensuring your plan is built specifically for your skin and goals.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="22" height="18" rx="2"/>
        <path d="M3 11h22M9 5V3M19 5V3"/>
        <circle cx="9" cy="17" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="14" cy="17" r="1.5" fill="currentColor" stroke="none"/>
        <circle cx="19" cy="17" r="1.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
    title: 'Advanced Technology',
    body: 'The clinic is equipped with modern diagnostic and treatment technology, ensuring that every procedure meets international standards of precision and safety.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>
      </svg>
    ),
    title: 'Evidence-Based Treatments',
    body: 'All protocols are grounded in peer-reviewed clinical research. We do not offer treatments that lack proven efficacy, regardless of trend or marketing.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 14l3 3 7-7"/>
        <circle cx="14" cy="14" r="11"/>
      </svg>
    ),
    title: 'Safe Clinical Procedures',
    body: 'Patient safety is our primary commitment. Every procedure is performed under strict clinical protocols with careful monitoring and aftercare guidance.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="10" r="4"/>
        <path d="M6 24c0-4.4 3.6-8 8-8s8 3.6 8 8"/>
      </svg>
    ),
    title: 'Experienced Dermatology Care',
    body: 'Led by a qualified MD Dermatologist with extensive clinical and aesthetic experience, ensuring you receive expert medical care at every visit.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="22" height="16" rx="2"/>
        <path d="M3 10h22M8 6V4M20 6V4M8 17l2 2 4-4"/>
      </svg>
    ),
    title: 'Comfortable Clinical Environment',
    body: 'Our clinic is designed to be calm, private, and welcoming. We understand that feeling at ease is essential to a positive treatment experience.',
  },
];

type FeatureCardProps = {
  feature: (typeof features)[0];
  index: number;
};

function FeatureCard({ feature, index }: FeatureCardProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1 }}
      className="bg-[#2C2C2C] p-8 group hover:bg-[#333330] transition-colors duration-300"
    >
      <div className="text-[#A0896E] mb-5 group-hover:text-[#C4B8A8] transition-colors duration-300">
        {feature.icon}
      </div>
      <h3 className="font-serif text-xl font-light text-[#FAF8F5] mb-3 leading-tight">
        {feature.title}
      </h3>
      <p className="font-sans text-[#6B6560] text-xs leading-[1.8] font-light">
        {feature.body}
      </p>
    </motion.div>
  );
}

export default function WhyUs() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="bg-[#2C2C2C] section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-px bg-[#A0896E]" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#FAF8F5] leading-[1.1] max-w-xl"
          >
            The Standard of Care{' '}
            <em className="italic text-[#C4B8A8]">You Deserve</em>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#3A3A3A]">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center max-w-2xl mx-auto"
        >
          <div className="font-serif text-4xl text-[#3A3A3A] mb-4">"</div>
          <p className="font-serif text-[clamp(1.1rem,2.5vw,1.5rem)] font-light italic text-[#C4B8A8] leading-relaxed mb-6">
            Advanced dermatology and aesthetic care with medically trusted expertise and modern treatment technology.
          </p>
          <div className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#A0896E]">
            {doctor.name}, MD · {doctor.title}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
