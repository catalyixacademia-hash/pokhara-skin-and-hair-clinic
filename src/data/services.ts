export type ServiceItem = {
  title: string;
  description: string;
  benefits: string[];
  result: string;
  img: string;
  featured?: boolean;
};

export const skinServices: ServiceItem[] = [
  {
    title: 'Acne & Pigmentation',
    description:
      'Comprehensive medical treatment for acne, acne scars, melasma, post-acne marks, and nail problems using clinically proven protocols.',
    benefits: ['Reduces breakouts', 'Fades dark spots', 'Clears skin tone'],
    result: 'Visibly clearer skin within 4 to 8 weeks',
    img: '/images/treatments/skin/acne-pigmentation.webp',
    featured: true,
  },
  {
    title: 'Chemical Peels',
    description:
      'Medical-grade peels tailored to your skin type, targeting texture, tone, and radiance with precision-controlled exfoliation.',
    benefits: ['Refines texture', 'Brightens complexion', 'Minimizes pores'],
    result: 'Smoother, luminous skin in 1 to 3 sessions',
    img: '/images/treatments/skin/chemical-peels.webp',
    featured: true,
  },
  {
    title: 'Skin Analyzer & Skin Tests',
    description:
      'Advanced Skin Analyzer diagnostics and clinical skin tests to accurately assess your skin condition and build a personalized treatment roadmap.',
    benefits: ['Skin Analyzer scan', 'Accurate diagnosis', 'Customized plan'],
    result: 'Clear treatment plan in a single consultation',
    img: '/images/treatments/skin/skin-analyzer.webp',
    featured: true,
  },
  {
    title: 'Microneedling',
    description:
      'Precision collagen induction therapy that stimulates natural skin regeneration for firmer, smoother, and more youthful-looking skin.',
    benefits: ['Boosts collagen', 'Reduces scars', 'Improves elasticity'],
    result: 'Firmer, rejuvenated skin within 4 to 6 weeks',
    img: '/images/treatments/skin/microneedling.webp',
  },
  {
    title: 'Laser Procedures',
    description:
      'Advanced laser technology for skin resurfacing, pigmentation correction, and targeted skin renewal with minimal downtime.',
    benefits: ['Targets pigmentation', 'Resurfaces skin', 'Long-lasting results'],
    result: 'Clinically significant improvement after each session',
    img: '/images/treatments/skin/laser-procedures.webp',
  },
  {
    title: 'HydraFacial & Rejuvenation',
    description:
      'Multi-step medical facial treatment combining deep cleansing, exfoliation, extraction, and hydration for instantly radiant skin.',
    benefits: ['Deep cleansing', 'Instant radiance', 'Zero downtime'],
    result: 'Visibly refreshed skin after first treatment',
    img: '/images/treatments/skin/hydrafacial.webp',
  },
];

export const hairServices: ServiceItem[] = [
  {
    title: 'PRP Therapy',
    description:
      'Platelet-Rich Plasma therapy using your own blood growth factors to stimulate dormant hair follicles and promote natural regrowth.',
    benefits: ['Activates follicles', 'Thickens hair', 'Natural process'],
    result: 'Noticeable density improvement in 3 to 6 months',
    img: '/images/treatments/hair/prp-therapy.webp',
  },
  {
    title: 'GFC Therapy',
    description:
      'Growth Factor Concentrate therapy, a next-generation advancement over PRP with a higher concentration of targeted growth factors.',
    benefits: ['Higher efficacy', 'Concentrated factors', 'Faster results'],
    result: 'Enhanced hair density within 2 to 4 months',
    img: '/images/treatments/hair/gfc-therapy.webp',
  },
  {
    title: 'Exosome Therapy',
    description:
      'Cutting-edge regenerative treatment using exosomes to signal cellular repair and accelerate hair follicle regeneration at the root.',
    benefits: ['Regenerative medicine', 'Cellular renewal', 'Minimal sessions'],
    result: 'Visible improvement within 6 to 10 weeks',
    img: '/images/treatments/hair/exosome-therapy.webp',
  },
  {
    title: 'Hair Fall Consultation',
    description:
      'Complete trichological evaluation for hair loss and hair care, including scalp health assessment, hormonal analysis review, and dietary guidance.',
    benefits: ['Root cause diagnosis', 'Scalp health', 'Treatment roadmap'],
    result: 'Targeted treatment plan from first visit',
    img: '/images/treatments/hair/hair-consultation.webp',
  },
  {
    title: 'Hair Density Restoration',
    description:
      'Multi-modal treatment combining medical therapy, nutritional support, and clinical procedures to restore optimal hair density.',
    benefits: ['Multi-modal approach', 'Proven protocols', 'Lasting results'],
    result: 'Measurable density improvement in 3 to 6 months',
    img: '/images/treatments/hair/hair-density.webp',
  },
];

export const aestheticServices: ServiceItem[] = [
  {
    title: 'Botox',
    description:
      'Precision botulinum toxin treatments for dynamic wrinkle reduction, facial contouring, and subtle natural rejuvenation.',
    benefits: ['Smooths wrinkles', 'Natural look', 'Quick procedure'],
    result: 'Visible softening of lines within 7 to 14 days',
    img: '/images/treatments/aesthetic/botox.webp',
  },
  {
    title: 'Dermal Fillers',
    description:
      'Volume restoration and facial contouring using premium hyaluronic acid fillers for natural, balanced aesthetic enhancement.',
    benefits: ['Restores volume', 'Defines contours', 'Immediate results'],
    result: 'Immediate visible enhancement, lasting 9 to 18 months',
    img: '/images/treatments/aesthetic/dermal-fillers.webp',
  },
  {
    title: 'Anti-Aging Procedures',
    description:
      'Comprehensive rejuvenation protocols combining multiple modalities to restore youthful skin quality, tone, and texture.',
    benefits: ['Multi-modal', 'Comprehensive', 'Preventative'],
    result: 'Progressive improvement with consistent treatment',
    img: '/images/treatments/aesthetic/anti-aging.webp',
  },
  {
    title: 'Laser Hair Reduction',
    description:
      'Long-term hair reduction using safe, controlled laser energy to target hair follicles and inhibit regrowth across all body areas.',
    benefits: ['Permanent reduction', 'All skin types', 'Painless sessions'],
    result: '70 to 90 percent reduction after complete treatment course',
    img: '/images/treatments/aesthetic/laser-hair-reduction.webp',
  },
  {
    title: 'Personalized Cosmetology',
    description:
      'Bespoke aesthetic treatment plans combining evidence-based procedures for comprehensive skin, face, and body enhancement.',
    benefits: ['Tailored protocols', 'Combined therapies', 'Ongoing care'],
    result: 'Holistic aesthetic improvement tailored to you',
    img: '/images/treatments/aesthetic/cosmetology.webp',
  },
];
