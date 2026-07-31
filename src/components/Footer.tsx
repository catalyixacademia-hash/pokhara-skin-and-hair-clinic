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
    <footer className="bg-surface-container-low border-t border-line pt-12 pb-8 pb-safe">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="space-y-4">
            <p className="font-display text-xl text-secondary font-semibold">{clinic.nameShort}</p>
            <p className="font-body text-base text-muted leading-relaxed">{clinic.tagline}</p>
          </div>

          <div className="space-y-4">
            <p className="text-label text-ink">Navigation</p>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => scrollTo(link.href)}
                  className="font-body text-base text-muted hover:text-accent hover:underline bg-transparent border-none cursor-pointer text-left transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-label text-ink">Treatments</p>
            <nav className="flex flex-col gap-2">
              {footerServiceLinks.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => {
                    scrollTo(s.href);
                    window.location.hash = s.href;
                  }}
                  className="font-body text-base text-muted hover:text-accent hover:underline bg-transparent border-none cursor-pointer text-left transition-colors"
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-label text-ink">Contact</p>
            <p className="font-body text-caption text-muted leading-relaxed">
              {address.line1}
              <br />
              {address.landmark}
              <br />
              <br />
              {phones.map((phone) => (
                <span key={phone.role}>
                  <a href={phoneHref(phone.number)} className="hover:text-accent">
                    {formatPhoneDisplay(phone.number)}
                  </a>
                  <br />
                </span>
              ))}
              <br />
              {hoursSummaryWithNote()}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-caption text-muted hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-caption text-muted opacity-70 text-center md:text-left">
            © {new Date().getFullYear()} {clinic.name}. All rights reserved. · {doctor.name} —{' '}
            {doctor.title}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => setActiveLegal(doc)}
                className="font-body text-caption text-muted hover:text-accent bg-transparent border-none cursor-pointer transition-colors"
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
