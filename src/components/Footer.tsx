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
import { adminLoginUrl } from '../lib/admin-url';
import { scrollToId } from '../lib/scroll';
import Container from './ui/Container';
import LegalModal from './LegalModal';
import Reveal from './motion/Reveal';
import { Stagger, StaggerItem } from './motion/Stagger';

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

function SocialIcon({ label }: { label: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true as const };
  switch (label) {
    case 'WhatsApp':
      return (
        <svg {...common}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      );
    case 'Instagram':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Facebook':
      return (
        <svg {...common}>
          <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-1.5c0-.6.4-1 1-1z" />
        </svg>
      );
    default:
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 4h6l1 4H8l1-4zM8 8l-2 12h12l-2-12" strokeLinejoin="round" />
        </svg>
      );
  }
}

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
    scrollToId(href);
  };

  return (
    <footer className="bg-surface border-t border-outline-variant pt-8 pb-6 pb-safe sm:pt-10">
      <Container>
        <Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6">
            <StaggerItem className="sm:col-span-2 lg:col-span-1">
              <p className="font-display text-h3 text-brand-green font-semibold">{clinic.nameShort}</p>
              <p className="font-body text-caption text-muted leading-relaxed mt-2 max-w-xs">
                {clinic.tagline}
              </p>
              <p className="font-body text-caption text-secondary mt-3" lang="ne">
                नमस्ते — thank you for visiting
              </p>
            </StaggerItem>

            <StaggerItem>
              <h2 className="footer-heading">Explore</h2>
              <nav aria-label="Footer navigation" className="footer-links">
                {quickLinks.map((link) => (
                  <button key={link.href} type="button" onClick={() => scrollTo(link.href)}>
                    {link.label}
                  </button>
                ))}
              </nav>
            </StaggerItem>

            <StaggerItem>
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
            </StaggerItem>

            <StaggerItem>
              <h2 className="footer-heading">Visit</h2>
              <address className="font-body text-caption text-muted leading-relaxed not-italic mb-1 px-0.5">
                {address.line1}
                <br />
                Opposite of GMC Hospital
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
              <div className="footer-social-icons mt-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social__link"
                    aria-label={s.label}
                  >
                    <SocialIcon label={s.label} />
                  </a>
                ))}
              </div>
              <a
                href={adminLoginUrl}
                className="inline-flex items-center gap-2 mt-4 text-caption text-muted hover:text-accent underline-offset-4 hover:underline"
              >
                Staff login
              </a>
            </StaggerItem>
          </Stagger>
        </Reveal>

        <p className="footer-wordmark" aria-hidden="true">
          POKHARA SKIN &amp; HAIR
        </p>

        <div className="border-t border-outline-variant pt-4 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <p className="font-body text-caption text-muted text-center md:text-left">
            © {new Date().getFullYear()} {clinic.nameShort}. All rights reserved.
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

        <p className="mt-4 text-center font-body text-caption text-muted">
          Developed By :{' '}
          <span className="font-semibold text-[var(--color-error)]">Orcrist Nepal</span>
        </p>
      </Container>

      <LegalModal doc={activeLegal} onClose={() => setActiveLegal(null)} />
    </footer>
  );
}
