export const clinic = {
  name: 'Pokhara Skin and Hair Clinic',
  /** Preferred public wordmark / brand string (nav, footer, hero). */
  nameShort: 'Pokhara Skin & Hair Clinic',
  /** @deprecated Prefer nameShort — kept for legacy consumers. */
  nameLine1: 'Pokhara Skin',
  /** @deprecated Prefer nameShort */
  nameLine2: '& Hair Clinic',
  /** @deprecated Prefer nameShort — truncated on mobile; do not use in UI. */
  wordmarkLine1: 'Pokhara',
  /** @deprecated Prefer nameShort */
  wordmarkLine2: 'Skin & Hair Clinic',
  siteUrl: 'https://pokhara-skin-and-hair-clinic.vercel.app',
  tagline:
    'Advanced dermatology and aesthetic care with medically trusted expertise and modern treatment technology.',
} as const;

export type PhoneRole = 'main' | 'appointments' | 'landline' | 'additional';

export type ClinicPhone = {
  role: PhoneRole;
  number: string;
  label: string;
};

/**
 * Phone roles (do not invent numbers):
 * - main: primary voice contact (also drives social.whatsapp)
 * - appointments: booking line (Visit form placeholder / labeled calls)
 * - landline / additional: listed in Visit + Footer contact blocks
 */
export const phones: ClinicPhone[] = [
  { role: 'main', number: '9706929329', label: 'Main Contact' },
  { role: 'appointments', number: '9845815246', label: 'Appointments' },
  { role: 'landline', number: '061-586227', label: 'Clinic Line' },
  { role: 'additional', number: '9851063249', label: 'Additional' },
];

export const address = {
  line1: 'Nayabazar-8, Pokhara',
  line2: 'Gandaki Province, Nepal',
  landmark: 'Opposite GMC Hospital (GMC Medical College) Gate',
  area: 'Prithvi Chowk area',
  short: 'Nayabazar-8, Pokhara, Nepal',
  full: [
    'Nayabazar-8, Pokhara',
    'Gandaki Province, Nepal',
    'Opposite GMC Hospital (GMC Medical College) Gate',
    'Prithvi Chowk area',
  ],
  mapCaption: 'Nayabazar-8 · Prithvi Chowk · Pokhara, Gandaki Province, Nepal',
} as const;

export const landmarks = [
  'Opposite GMC Hospital (GMC Medical College) Main Gate',
  'Nayabazar-8, Prithvi Chowk area',
  'Near Prithvi Narayan Campus',
] as const;

export const hours = {
  daily: '8:00 AM – 7:00 PM',
  saturdayNote: 'Saturday OPD available',
  summary: 'Daily: 8AM–7PM',
  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ] as const,
} as const;

export const clinicHours = hours.days.map((day) => ({
  day,
  time: hours.daily,
}));

export const social = {
  instagram: {
    url: 'https://www.instagram.com/pokharaskinandhairclinic/',
    handle: '@pokharaskinandhairclinic',
  },
  facebook: {
    url: 'https://www.facebook.com/profile.php?id=61561770561179',
  },
  tiktok: {
    url: 'https://www.tiktok.com/@pokharaskinandhairclinic',
    handle: '@pokharaskinandhairclinic',
  },
  /**
   * Main clinic WhatsApp — same digits as phones.main (9706929329).
   * Use in Visit booking secondary CTA, Footer social, and in-page contact links.
   */
  whatsapp: {
    url: 'https://wa.me/9779706929329',
    urlWithMessage:
      'https://wa.me/9779706929329?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Pokhara%20Skin%20and%20Hair%20Clinic.',
  },
  /**
   * Floating chat + form handoff WhatsApp (984515246). Distinct from appointments phone (9845815246).
   * WhatsAppFloat and post-submit booking/enquiry prefill use this; do not substitute social.whatsapp here.
   */
  whatsappFloat: {
    number: '984515246',
    url: 'https://wa.me/977984515246',
    urlWithMessage:
      'https://wa.me/977984515246?text=Hello%2C%20I%20would%20like%20to%20contact%20Pokhara%20Skin%20and%20Hair%20Clinic.',
  },
} as const;

export const doctor = {
  name: 'Dr. Prakash Acharya',
  title: 'Board Certified Dermatologist',
  titleShort: 'Board Certified Dermatologist · MD',
  /** Displayed under the title in the doctor panel */
  qualificationLine: 'MD, Dermatology · NMC Reg. No. 12549',
  nmcNumber: '12549',
  nmcSpecialty: 'Dermatology',
  nmcStatus: 'Specialist',
  website: 'https://drprakashacharya.com.np/',
  education: [
    {
      degree: 'MD, Dermatology',
      institution: 'Kathmandu University, Nepal',
      year: '2020',
    },
    {
      degree: 'MBBS',
      institution: 'Tribhuvan University, Maharajgunj Medical Campus, Nepal',
      year: '2011',
    },
  ],
  credentials: [
    {
      label: 'NMC Registration',
      value: 'No. 12549 · Specialist (Dermatology) · Unlimited',
    },
    {
      label: 'MD, Dermatology',
      value: 'Kathmandu University, Nepal (2020)',
    },
    {
      label: 'MBBS',
      value: 'Tribhuvan University, Maharajgunj Medical Campus (2011)',
    },
    {
      label: 'Focus Areas',
      value:
        'Melasma & pigmentation, acne & scars, anti-aging, hair loss, regenerative dermatology',
    },
    {
      label: 'Recognition',
      value:
        '25+ peer-reviewed publications · Best Paper Award (SODVELON) · International speaker (IMCAS, MEIDAM, ISAAH)',
    },
    { label: 'Clinic', value: clinic.name },
    { label: 'Location', value: 'Nayabazar-8, Pokhara, Nepal' },
  ],
  bio: [
    'Dr. Prakash Acharya is a Board Certified Dermatologist and Nepal Medical Council specialist (NMC Reg. No. 12549). He holds an MD in Dermatology from Kathmandu University (2020) and an MBBS from Tribhuvan University, Maharajgunj Medical Campus (2011). He established Pokhara Skin and Hair Clinic to bring evidence-based dermatological care to patients across Pokhara and the Gandaki region.',
    'His clinical work focuses on melasma and pigmentation, acne and scarring, hair loss, and regenerative anti-aging treatments tailored to South Asian skin. He has treated 10,000+ patients, authored 25+ peer-reviewed publications in journals including JAAD, BJD, and JEADV, and speaks at international meetings including IMCAS, MEIDAM, and ISAAH. He also practices in Kathmandu as founder of Reva Skin & Hair Clinic.',
  ],
  portraitAlt: 'Dr. Prakash Acharya — Board Certified Dermatologist, NMC Reg. No. 12549',
} as const;

export const treatmentOptionGroups = [
  {
    label: 'Skin care',
    hint: 'Primary specialty',
    options: [
      'Skin Consultation',
      'Skin Analyzer / Skin Test',
      'Acne & Pigmentation',
      'Chemical Peel',
      'Microneedling',
      'Laser Treatment',
      'HydraFacial',
      'Nail Problems',
      'General Dermatology',
    ],
  },
  {
    label: 'Hair restoration',
    hint: 'Scalp & density',
    options: [
      'PRP Hair Therapy',
      'GFC Therapy',
      'Exosome Therapy',
      'Hair Fall Consultation',
    ],
  },
  {
    label: 'Aesthetic procedures',
    hint: 'Cosmetic dermatology',
    options: [
      'Botox',
      'Dermal Fillers',
      'Anti-Aging Treatment',
      'Laser Hair Reduction',
    ],
  },
] as const;

export const treatmentOptions = treatmentOptionGroups.flatMap((group) => group.options);

const treatmentCategoryByLabel = new Map<string, string>(
  treatmentOptionGroups.flatMap((group) =>
    group.options.map((option) => [option, group.label] as const),
  ),
);

export function groupTreatmentOptions(labels: string[]): { label: string; options: string[] }[] {
  const grouped = new Map<string, string[]>();

  for (const label of labels) {
    const category = treatmentCategoryByLabel.get(label) ?? 'Other treatments';
    const bucket = grouped.get(category) ?? [];
    bucket.push(label);
    grouped.set(category, bucket);
  }

  const orderedCategories = [
    ...treatmentOptionGroups.map((group) => group.label),
    'Other treatments',
  ];

  return orderedCategories
    .filter((category) => grouped.has(category))
    .map((category) => ({
      label: category,
      options: grouped.get(category) ?? [],
    }));
}

export const footerServiceLinks = [
  { label: 'Acne & Pigmentation', href: '#acne-pigmentation' },
  { label: 'Chemical Peels', href: '#chemical-peels' },
  { label: 'Microneedling', href: '#microneedling' },
  { label: 'Laser Treatments', href: '#laser-procedures' },
  { label: 'Skin Analyzer', href: '#skin-analyzer-skin-tests' },
  { label: 'PRP Hair Therapy', href: '#prp-therapy' },
  { label: 'GFC Therapy', href: '#gfc-therapy' },
  { label: 'Aesthetic care', href: '#aesthetics' },
  { label: 'Laser Hair Reduction', href: '#aesthetics' },
] as const;

/** Google Maps pin — Pokhara Skin and Hair Clinic, Nayabazar Rd (plus code 6X6P+MP5). */
const mapLocation = {
  lat: 28.211638,
  lng: 83.986859,
  zoom: 17,
  placeName: 'Pokhara Skin and Hair Clinic',
  address: 'Nayabazar Rd, Pokhara 33700, Nepal',
  plusCode: '6X6P+MP5',
} as const;

export const maps = {
  embedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(`${mapLocation.placeName}, ${mapLocation.address}`)}&ll=${mapLocation.lat},${mapLocation.lng}&z=${mapLocation.zoom}&hl=en&output=embed`,
  openUrl: `https://www.google.com/maps/place/${encodeURIComponent(mapLocation.placeName)}/@${mapLocation.lat},${mapLocation.lng},${mapLocation.zoom}z`,
  /** Google Business Profile / Knowledge Panel reviews for the clinic */
  reviewsUrl:
    'https://www.google.com/search?q=pokhara+skin+and+hair+clinic&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_4wTJVhQ__q_w4jYcYiQlFHvBxT6dldvP8ZamDtHTk4xu--gB5GNyG222s0UziRMWA3SbfTKO4J-XuyUXRqBf9w0z4ar77RwNPlQRhJeGs0sSsJ5Yg%3D%3D',
} as const;

function digitsOnly(number: string): string {
  return number.replace(/\D/g, '');
}

export function phoneHref(number: string): string {
  const digits = digitsOnly(number);
  if (digits.startsWith('0') && digits.length <= 9) {
    return `tel:+977${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `tel:+977${digits}`;
  }
  return `tel:+${digits}`;
}

export function formatPhoneDisplay(number: string): string {
  const digits = digitsOnly(number);

  if (digits.length === 10) {
    return `+977 ${digits.slice(0, 3)}-${digits.slice(3)}`;
  }

  if (digits.startsWith('61') && digits.length === 8) {
    return `+977 ${digits.slice(0, 2)}-${digits.slice(2)}`;
  }

  if (digits.startsWith('0') && digits.length === 9) {
    return `+977 ${digits.slice(1, 3)}-${digits.slice(3)}`;
  }

  return `+977 ${number}`;
}

export function getPhone(role: PhoneRole): ClinicPhone {
  const phone = phones.find((p) => p.role === role);
  if (!phone) {
    const _exhaustive: never = role;
    throw new Error(`Unknown phone role: ${_exhaustive}`);
  }
  return phone;
}

export function hoursSummaryWithNote(): string {
  return `${hours.summary} · ${hours.saturdayNote}`;
}
