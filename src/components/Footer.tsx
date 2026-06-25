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
        <div className="flex flex-col lg:flex-row lg:justify-between gap-10 mb-12">
          <div className="max-w-sm">
            <p className="font-serif text-2xl mb-1">{clinic.nameLine1}</p>
            <p className="font-sans text-sm text-paper/60 mb-4">{clinic.nameLine2}</p>
            <p className="font-sans text-sm text-paper/70 leading-relaxed mb-6">{clinic.tagline}</p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm text-paper/70 hover:text-paper touch-target"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-paper/5 border border-paper/10 p-6 max-w-sm w-full">
            <p className="font-sans text-sm text-paper/60 mb-2">Ready to begin?</p>
            <h3 className="font-serif text-xl mb-4">Book your visit</h3>
            <button type="button" onClick={() => scrollTo('#contact')} className="btn-bronze w-full">
              Book appointment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-paper/10 pt-10 mb-10">
          <div>
            <p className="section-label text-paper/50 mb-4">Navigation</p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.href)}
                    className="font-sans text-sm text-paper/70 hover:text-paper bg-transparent border-none cursor-pointer touch-target text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label text-paper/50 mb-4">Treatments</p>
            <ul className="space-y-2">
              {footerServiceLinks.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => scrollTo('#services')}
                    className="font-sans text-sm text-paper/70 hover:text-paper bg-transparent border-none cursor-pointer text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="section-label text-paper/50 mb-4">Contact</p>
            <p className="font-sans text-sm text-paper/70 mb-3">
              {address.line1}<br />
              {address.landmark}
            </p>
            {phones.map((phone) => (
              <a key={phone.role} href={phoneHref(phone.number)} className="block font-sans text-sm text-paper/70 hover:text-paper mb-1">
                {formatPhoneDisplay(phone.number)}
              </a>
            ))}
            <p className="font-sans text-sm text-paper/60 mt-3">{hoursSummaryWithNote()}</p>
          </div>
        </div>

        <div className="border-t border-paper/10 pt-6 flex flex-col md:flex-row md:justify-between gap-2 text-sm text-paper/50">
          <p>&copy; {new Date().getFullYear()} {clinic.name}</p>
          <p>{doctor.name} · {doctor.title}</p>
        </div>
      </Container>
    </footer>
  );
}
