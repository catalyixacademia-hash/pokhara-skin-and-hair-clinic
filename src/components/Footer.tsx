import { useState } from 'react';
import {
  address,
  clinic,
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
  { label: 'Treatments', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Doctor', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const primaryPhones = phones.filter(
  (phone) => phone.role === 'main' || phone.role === 'appointments',
);

export default function Footer() {
  const [activeLegal, setActiveLegal] = useState<LegalDocument | null>(null);
  const { settings } = useClinicSettings();

  const socialLinks = [
    { label: 'WhatsApp', href: settings.social.whatsappMainUrl || social.whatsapp.url },
    { label: 'Instagram', href: settings.social.instagramUrl || social.instagram.url },
    { label: 'Facebook', href: settings.social.facebookUrl || social.facebook.url },
    { label: 'TikTok', href: settings.social.tiktokUrl || social.tiktok.url },
  ];

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface border-t border-outline-variant pt-8 pb-6 pb-safe sm:pt-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="font-display text-h3 text-secondary font-semibold">{clinic.nameShort}</p>
            <p className="font-body text-caption text-muted leading-relaxed mt-2 max-w-xs">
              {clinic.tagline}
            </p>
          </div>

          <div>
            <h2 className="footer-heading">Explore</h2>
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
              <button type="button" onClick={() => scrollTo('#services')}>
                View all treatments →
              </button>
            </nav>
          </div>

          <div>
            <h2 className="footer-heading">Visit</h2>
            <address className="font-body text-caption text-muted leading-relaxed not-italic mb-1 px-0.5">
              {address.line1}
              <br />
              {address.landmark}
            </address>
            <div className="footer-links">
              {primaryPhones.map((phone) => (
                <a key={phone.role} href={phoneHref(phone.number)}>
                  {formatPhoneDisplay(phone.number)}
                  <span className="text-muted/70"> · {phone.label}</span>
                </a>
              ))}
            </div>
            <p className="font-body text-caption text-muted mt-1 px-0.5">{hoursSummaryWithNote()}</p>
            <div className="flex flex-wrap gap-0.5 mt-1 -ml-2">
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

        <div className="border-t border-outline-variant pt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <p className="font-body text-caption text-muted text-center md:text-left">
            © {new Date().getFullYear()} {clinic.nameShort}. All rights reserved.
            <span className="text-muted/60"> · </span>
            Built by Orcrist Tech Nepal
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
