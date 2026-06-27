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
import Container from './ui/Container';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Treatments', href: '#services' },
  { label: 'Doctor', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'Contact', href: '#contact' },
  { label: 'Location', href: '#location' },
];

const socialLinks = [
  { label: 'Instagram', href: social.instagram.url },
  { label: 'Facebook', href: social.facebook.url },
  { label: 'TikTok', href: social.tiktok.url },
  { label: 'WhatsApp', href: social.whatsapp.url },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink text-paper pt-16 pb-8 pb-safe">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-1">
            <p className="font-display text-lg mb-1">{clinic.nameLine1}</p>
            <p className="font-body text-sm text-paper/60 mb-4">{clinic.nameLine2}</p>
            <p className="font-body text-sm text-paper/70 leading-relaxed">{clinic.tagline}</p>
          </div>

          <div>
            <p className="font-mono text-xs text-paper/50 mb-4">Navigation</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="font-body text-sm text-paper/70 hover:text-paper bg-transparent border-none cursor-pointer touch-target text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs text-paper/50 mb-4">Treatments</p>
            <ul className="space-y-2">
              {footerServiceLinks.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => scrollTo('#services')}
                    className="font-body text-sm text-paper/70 hover:text-paper bg-transparent border-none cursor-pointer text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs text-paper/50 mb-4">Contact</p>
            <p className="font-body text-sm text-paper/70 mb-3">
              {address.line1}
              <br />
              {address.landmark}
            </p>
            {phones.map((phone) => (
              <a
                key={phone.role}
                href={phoneHref(phone.number)}
                className="block font-body text-sm text-paper/70 hover:text-paper mb-1"
              >
                {formatPhoneDisplay(phone.number)}
              </a>
            ))}
            <p className="font-body text-sm text-paper/60 mt-3">{hoursSummaryWithNote()}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-paper/60 hover:text-paper"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-paper/10 pt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
          <button
            type="button"
            onClick={() => scrollTo('#contact')}
            className="inline-flex items-center justify-center min-h-[2.75rem] px-6 bg-paper text-ink font-body text-sm font-medium border border-paper hover:bg-paper/90 transition-colors w-full sm:w-auto"
          >
            Book appointment
          </button>
          <div className="text-sm text-paper/50 sm:text-right">
            <p>&copy; {new Date().getFullYear()} {clinic.name}</p>
            <p>{doctor.name} · {doctor.title}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
