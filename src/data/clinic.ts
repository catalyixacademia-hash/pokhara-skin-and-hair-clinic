export const clinic = {
  name: 'Pokhara Skin and Hair Clinic',
  nameShort: 'Pokhara Skin & Hair Clinic',
  nameLine1: 'Pokhara Skin',
  nameLine2: '& Hair Clinic',
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
  whatsapp: {
    url: 'https://wa.me/9779706929329',
    urlWithMessage:
      'https://wa.me/9779706929329?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Pokhara%20Skin%20and%20Hair%20Clinic.',
  },
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
  credentials: [
    { label: 'Qualification', value: 'MD, Dermatology & Venereology' },
    { label: 'Certification', value: 'Board Certified Dermatologist' },
    {
      label: 'Specialization',
      value: 'Clinical & Aesthetic Dermatology',
    },
    {
      label: 'Focus Areas',
      value:
        'Skin Repair & Regeneration, Melasma, Acne Scars, Hair Disorders, Advanced Dermatological Treatments',
    },
    { label: 'Clinic', value: clinic.name },
    { label: 'Location', value: 'Nayabazar-8, Pokhara, Nepal' },
  ],
  bio: [
    'Dr. Prakash Acharya is a Board Certified Dermatologist with an MD in Dermatology and Venereology. He established Pokhara Skin and Hair Clinic with the vision of making internationally standard dermatological care accessible to patients across the Gandaki region of Nepal. He also practices in Kathmandu.',
    'With clinical expertise spanning medical dermatology, trichology, and aesthetic procedures, Dr. Acharya brings a holistic, evidence-based perspective to every patient interaction. His approach combines the precision of clinical medicine with a genuine understanding of the emotional dimensions of skin and hair health.',
  ],
  portraitAlt: 'Dr. Prakash Acharya - Board Certified Dermatologist',
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
  'Acne & Pigmentation',
  'Chemical Peels',
  'Microneedling',
  'Laser Treatments',
  'Skin Analyzer',
  'PRP Hair Therapy',
  'GFC Therapy',
  'Botox & Fillers',
  'Laser Hair Reduction',
] as const;

export const maps = {
  embedUrl:
    'https://maps.google.com/maps?q=Pokhara+Skin+and+Hair+Clinic+Nayabazar+GMC+Hospital+Pokhara&hl=en&z=16&output=embed',
  openUrl:
    'https://www.google.com/maps/search/?api=1&query=Pokhara+Skin+and+Hair+Clinic+Nayabazar+GMC+Hospital+Pokhara',
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
