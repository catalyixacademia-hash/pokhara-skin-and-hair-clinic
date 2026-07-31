export type FaqItem = {
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    question: 'Do I need an appointment?',
    answer:
      'Yes. We recommend booking ahead so we can allocate enough time for assessment and treatment planning. Walk-ins are accommodated when the schedule allows.',
  },
  {
    question: 'What should I bring to my first visit?',
    answer:
      'Bring a list of current skincare or medications, any prior dermatology reports or photos of your concern, and questions about your goals. Arrive with a clean face when possible (minimal makeup).',
  },
  {
    question: 'How are treatment prices determined?',
    answer:
      'Fees depend on the condition, protocol, and number of sessions. We discuss options and approximate ranges during consultation and only recommend what is medically appropriate for you.',
  },
  {
    question: 'Is there downtime after procedures?',
    answer:
      'It varies by treatment. Peels and lasers may involve temporary redness or flaking; injectables and many hair protocols have little to no downtime. We explain aftercare before you proceed.',
  },
  {
    question: 'Do you treat both skin and hair concerns?',
    answer:
      'Yes. Skin care is our primary specialty; hair restoration and selected aesthetic procedures complement comprehensive dermatology under Dr. Prakash Acharya.',
  },
];
