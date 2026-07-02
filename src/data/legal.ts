import { address, clinic, phones, social } from './clinic';

export type LegalSection = {
  heading: string;
  body: string[];
};

export type LegalDocument = {
  id: 'privacy' | 'disclaimer' | 'terms';
  label: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

const mainPhone = phones[0]?.number ?? '';
const contactLine = `${clinic.name}, ${address.line1}, ${address.line2}. Phone: ${mainPhone}. Instagram: ${social.instagram.handle}.`;

/**
 * Template legal content tailored for the clinic. Reviewed content should replace
 * this before relying on it as a binding policy; it is intended as an editable starting point.
 */
export const legalDocuments: LegalDocument[] = [
  {
    id: 'privacy',
    label: 'Privacy Policy',
    title: 'Privacy Policy',
    intro: `${clinic.name} respects your privacy and is committed to protecting the personal and health information you share with us through this website and during your care.`,
    sections: [
      {
        heading: 'Information we collect',
        body: [
          'When you submit a booking or enquiry form, we collect the details you provide such as your name, phone number, email address, preferred treatment, preferred date, and any message or concern you choose to share.',
          'We do not collect sensitive medical records through this website. Clinical information is recorded separately and securely as part of your in-clinic treatment.',
        ],
      },
      {
        heading: 'How we use your information',
        body: [
          'Your information is used solely to respond to your enquiry, schedule and confirm appointments, provide follow-up care, and improve our services.',
          'We do not sell, rent, or trade your personal information to third parties for marketing purposes.',
        ],
      },
      {
        heading: 'Data storage and security',
        body: [
          'Form submissions are stored using trusted service providers with industry-standard security safeguards. Access is limited to authorised clinic staff.',
          'While we take reasonable steps to protect your data, no method of transmission over the internet is completely secure.',
        ],
      },
      {
        heading: 'Your rights',
        body: [
          'You may request access to, correction of, or deletion of the personal information you have submitted to us at any time by contacting the clinic.',
        ],
      },
      {
        heading: 'Contact us',
        body: [
          `For any privacy-related questions or requests, please contact us: ${contactLine}`,
        ],
      },
    ],
  },
  {
    id: 'disclaimer',
    label: 'Medical Disclaimer',
    title: 'Medical Disclaimer',
    intro: `The information provided on this website by ${clinic.name} is for general informational and educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.`,
    sections: [
      {
        heading: 'Not medical advice',
        body: [
          'Content on this website, including descriptions of treatments and conditions, should not be used to diagnose or treat any health problem or disease. Always seek the advice of a qualified dermatologist or healthcare provider with any questions you may have.',
        ],
      },
      {
        heading: 'Individual results vary',
        body: [
          'Outcomes from dermatological and aesthetic treatments differ from person to person. Any results, testimonials, or before-and-after references shown are illustrative and do not guarantee a specific outcome for your case.',
        ],
      },
      {
        heading: 'Consultation required',
        body: [
          'A suitable treatment plan can only be determined after an in-person consultation and clinical assessment with our dermatologist.',
        ],
      },
      {
        heading: 'In case of emergency',
        body: [
          'This website is not intended for medical emergencies. If you are experiencing a medical emergency, contact your nearest hospital or emergency services immediately.',
        ],
      },
      {
        heading: 'Contact us',
        body: [`To book a consultation, please contact us: ${contactLine}`],
      },
    ],
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    title: 'Terms of Service',
    intro: `By accessing and using the ${clinic.name} website, you agree to the following terms. Please read them carefully.`,
    sections: [
      {
        heading: 'Use of this website',
        body: [
          'This website is provided to share information about our clinic and services and to allow you to request appointments and enquiries. You agree to use it only for lawful purposes and to provide accurate information when submitting forms.',
        ],
      },
      {
        heading: 'Appointments and enquiries',
        body: [
          'Submitting a booking or enquiry form is a request for an appointment and does not constitute a confirmed booking until our staff contact you to confirm date and time.',
          'We reserve the right to reschedule or decline appointments where necessary.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'All content on this website, including text, images, logos, and branding, is the property of the clinic and may not be copied or reused without permission.',
        ],
      },
      {
        heading: 'Limitation of liability',
        body: [
          'The clinic is not liable for any decisions made solely on the basis of information presented on this website. Treatment decisions should always follow a professional consultation.',
        ],
      },
      {
        heading: 'Contact us',
        body: [`For questions about these terms, please contact us: ${contactLine}`],
      },
    ],
  },
];

export function getLegalDocument(id: LegalDocument['id']): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.id === id);
}
