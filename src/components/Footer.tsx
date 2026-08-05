import { useState } from 'react';
import {
  address,
  clinic,
  doctor,
  footerServiceLinks,
  formatPhoneDisplay,
  hoursSummaryWithNote,
  phones,
  phoneHref,
  social,
} from '../data/clinic';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { legalDocuments, type LegalDocument } from '../data/legal';
import Container from './ui/Container';
import LegalModal from './LegalModal';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Treatments', href: '#services' },
  { label: 'Doctor', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
  { label: 'Location', href: '#location' },
];

export default function Footer() {
  const [activeLegal, setActiveLegal] = useState<LegalDocument | null>(null);
  const { settings } = useClinicSettings();

  const socialLinks = [
    { label: 'Instagram', href: settings.social.instagramUrl || social.instagram.url },
    { label: 'Facebook', href: settings.social.facebookUrl || social.facebook.url },
    { label: 'TikTok', href: settings.social.tiktokUrl || social.tiktok.url },
    { label: 'WhatsApp', href: settings.social.whatsappMainUrl || social.whatsapp.url },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-container border-t border-outline-variant pt-12 pb-8 pb-safe">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] gap-8 lg:gap-10 mb-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-h3 text-secondary font-semibold">{clinic.nameShort}</p>
            <p className="font-body text-base text-muted leading-relaxed mt-3 max-w-sm">
              {clinic.tagline}
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Navigation</h2>
            <nav aria-label="Footer navigation" className="footer-links">
              {quickLinks.map((link) => (
                <button key={link.href} type="button" onClick={() => scrollTo(link.href)}>
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="footer-heading">Treatments</h2>
            <nav aria-label="Treatment links" className="footer-links">
              {footerServiceLinks.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    scrollTo(s.href);
                    window.location.hash = s.href;
                  }}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="footer-heading">Contact</h2>
            <address className="font-body text-caption text-muted leading-relaxed not-italic mb-2">
              {address.line1}
              <br />
              {address.landmark}
            </address>
            <div className="footer-links">
              {phones.map((phone) => (
                <a key={phone.role} href={phoneHref(phone.number)}>
                  {formatPhoneDisplay(phone.number)}
                  <span className="text-muted/70"> · {phone.label}</span>
                </a>
              ))}
            </div>
            <p className="font-body text-caption text-muted mt-3">{hoursSummaryWithNote()}</p>
            <div className="flex flex-wrap gap-1 mt-3 -ml-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-outline-variant pt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <p className="font-body text-caption text-muted text-center md:text-left">
            © {new Date().getFullYear()} {clinic.name}. All rights reserved. · {doctor.name} —{' '}
            {doctor.title}
          </p>
          <div className="flex flex-wrap justify-center gap-1 -mx-2">
            {legalDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveLegal(doc)}
                className="footer-social"
              >
                {doc.label}
              </button>
            ))}
          </div>
        </div>
      </Container>

      <LegalModal doc={activeLegal} onClose={() => setActiveLegal(null)} />
    </footer>
  );
}
