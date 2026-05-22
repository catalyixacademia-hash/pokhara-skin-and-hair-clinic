import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const categories = [
  { id: 'skin', label: 'Skin Treatments' },
  { id: 'hair', label: 'Hair Restoration' },
  { id: 'aesthetic', label: 'Aesthetic Procedures' },
];

const skinServices = [
  {
    title: 'Acne & Pigmentation',
    description: 'Comprehensive medical treatment for acne, post-acne marks, and all forms of hyperpigmentation using clinically proven protocols.',
    benefits: ['Reduces breakouts', 'Fades dark spots', 'Clears skin tone'],
    result: 'Visibly clearer skin within 4 to 8 weeks',
    img: 'https://images.pexels.com/photos/3985361/pexels-photo-3985361.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Chemical Peels',
    description: 'Medical-grade peels tailored to your skin type, targeting texture, tone, and radiance with precision-controlled exfoliation.',
    benefits: ['Refines texture', 'Brightens complexion', 'Minimizes pores'],
    result: 'Smoother, luminous skin in 1 to 3 sessions',
    img: 'https://images.pexels.com/photos/4586728/pexels-photo-4586728.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Microneedling',
    description: 'Precision collagen induction therapy that stimulates natural skin regeneration for firmer, smoother, and more youthful-looking skin.',
    benefits: ['Boosts collagen', 'Reduces scars', 'Improves elasticity'],
    result: 'Firmer, rejuvenated skin within 4 to 6 weeks',
    img: 'https://images.pexels.com/photos/32260064/pexels-photo-32260064.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Laser Procedures',
    description: 'Advanced laser technology for skin resurfacing, pigmentation correction, and targeted skin renewal with minimal downtime.',
    benefits: ['Targets pigmentation', 'Resurfaces skin', 'Long-lasting results'],
    result: 'Clinically significant improvement after each session',
    img: 'https://images.pexels.com/photos/3985332/pexels-photo-3985332.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'HydraFacial & Rejuvenation',
    description: 'Multi-step medical facial treatment combining deep cleansing, exfoliation, extraction, and hydration for instantly radiant skin.',
    benefits: ['Deep cleansing', 'Instant radiance', 'Zero downtime'],
    result: 'Visibly refreshed skin after first treatment',
    img: 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Skin Analysis Consultation',
    description: 'Comprehensive digital skin analysis to understand your unique skin needs and create a personalized treatment roadmap.',
    benefits: ['Accurate diagnosis', 'Customized plan', 'Measurable progress'],
    result: 'Clear treatment plan in a single consultation',
    img: 'https://images.pexels.com/photos/4586732/pexels-photo-4586732.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
];

const hairServices = [
  {
    title: 'PRP Therapy',
    description: 'Platelet-Rich Plasma therapy using your own blood growth factors to stimulate dormant hair follicles and promote natural regrowth.',
    benefits: ['Activates follicles', 'Thickens hair', 'Natural process'],
    result: 'Noticeable density improvement in 3 to 6 months',
    img: 'https://images.pexels.com/photos/36963686/pexels-photo-36963686.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'GFC Therapy',
    description: 'Growth Factor Concentrate therapy, a next-generation advancement over PRP with a higher concentration of targeted growth factors.',
    benefits: ['Higher efficacy', 'Concentrated factors', 'Faster results'],
    result: 'Enhanced hair density within 2 to 4 months',
    img: 'https://images.pexels.com/photos/29648642/pexels-photo-29648642.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Exosome Therapy',
    description: 'Cutting-edge regenerative treatment using exosomes to signal cellular repair and accelerate hair follicle regeneration at the root.',
    benefits: ['Regenerative medicine', 'Cellular renewal', 'Minimal sessions'],
    result: 'Visible improvement within 6 to 10 weeks',
    img: 'https://images.pexels.com/photos/7320791/pexels-photo-7320791.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Hair Fall Consultation',
    description: 'Complete trichological evaluation including scalp health assessment, hormonal analysis review, and dietary guidance for hair loss.',
    benefits: ['Root cause diagnosis', 'Scalp health', 'Treatment roadmap'],
    result: 'Targeted treatment plan from first visit',
    img: 'https://images.pexels.com/photos/23349910/pexels-photo-23349910.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Hair Density Restoration',
    description: 'Multi-modal treatment combining medical therapy, nutritional support, and clinical procedures to restore optimal hair density.',
    benefits: ['Multi-modal approach', 'Proven protocols', 'Lasting results'],
    result: 'Measurable density improvement in 3 to 6 months',
    img: 'https://images.pexels.com/photos/7320791/pexels-photo-7320791.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
];

const aestheticServices = [
  {
    title: 'Botox',
    description: 'Precision botulinum toxin treatments for dynamic wrinkle reduction, facial contouring, and subtle natural rejuvenation.',
    benefits: ['Smooths wrinkles', 'Natural look', 'Quick procedure'],
    result: 'Visible softening of lines within 7 to 14 days',
    img: 'https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Dermal Fillers',
    description: 'Volume restoration and facial contouring using premium hyaluronic acid fillers for natural, balanced aesthetic enhancement.',
    benefits: ['Restores volume', 'Defines contours', 'Immediate results'],
    result: 'Immediate visible enhancement, lasting 9 to 18 months',
    img: 'https://images.pexels.com/photos/32160039/pexels-photo-32160039.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Anti-Aging Procedures',
    description: 'Comprehensive rejuvenation protocols combining multiple modalities to restore youthful skin quality, tone, and texture.',
    benefits: ['Multi-modal', 'Comprehensive', 'Preventative'],
    result: 'Progressive improvement with consistent treatment',
    img: 'https://images.pexels.com/photos/7479960/pexels-photo-7479960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Laser Hair Reduction',
    description: 'Long-term hair reduction using safe, controlled laser energy to target hair follicles and inhibit regrowth across all body areas.',
    benefits: ['Permanent reduction', 'All skin types', 'Painless sessions'],
    result: '70 to 90 percent reduction after complete treatment course',
    img: 'https://images.pexels.com/photos/4586726/pexels-photo-4586726.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
  {
    title: 'Personalized Cosmetology',
    description: 'Bespoke aesthetic treatment plans combining evidence-based procedures for comprehensive skin, face, and body enhancement.',
    benefits: ['Tailored protocols', 'Combined therapies', 'Ongoing care'],
    result: 'Holistic aesthetic improvement tailored to you',
    img: 'https://images.pexels.com/photos/3985332/pexels-photo-3985332.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
  },
];

const allServices: Record<string, typeof skinServices> = {
  skin: skinServices,
  hair: hairServices,
  aesthetic: aestheticServices,
};

type ServiceItem = {
  title: string;
  description: string;
  benefits: string[];
  result: string;
  img: string;
};

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="treatment-card group relative bg-[#FAF8F5] border border-[#E8DDD4] overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="img-zoom aspect-[4/3] overflow-hidden bg-[#E8DDD4]">
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-2 leading-tight">
          {service.title}
        </h3>
        <p className="font-sans text-[#6B6560] text-xs leading-relaxed mb-4 font-light">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.benefits.map((b) => (
            <span
              key={b}
              className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#A0896E] border border-[#E8DDD4] px-2 py-1"
            >
              {b}
            </span>
          ))}
        </div>

        <div className="border-t border-[#E8DDD4] pt-4 flex items-start gap-2">
          <div className="w-1 h-1 rounded-full bg-[#A8B5A2] mt-1.5 shrink-0" />
          <span className="font-sans text-[10px] text-[#6B6560] leading-relaxed italic font-light">
            {service.result}
          </span>
        </div>

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#A0896E] flex items-center gap-2 hover:gap-3 transition-all duration-300 border-none bg-transparent cursor-pointer"
              >
                Book Consultation
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('skin');
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="services" className="bg-[#F2EDE6] section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Our Treatments
            </span>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1] max-w-md"
            >
              Comprehensive Care,{' '}
              <em className="italic text-[#A0896E]">Precisely</em> Delivered
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex gap-0"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={
                    'font-sans text-[10px] tracking-[0.15em] uppercase px-5 py-2.5 transition-all duration-300 border border-r-0 last:border-r ' +
                    (activeCategory === cat.id
                      ? 'bg-[#2C2C2C] text-[#FAF8F5] border-[#2C2C2C]'
                      : 'bg-transparent text-[#6B6560] border-[#C4B8A8] hover:text-[#2C2C2C]')
                  }
                >
                  {cat.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {allServices[activeCategory].map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <p className="font-sans text-[#6B6560] text-sm mb-5 font-light">
            Not sure which treatment is right for you?
          </p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary"
          >
            Book a Free Consultation
          </button>
        </motion.div>

      </div>
    </section>
  );
}
