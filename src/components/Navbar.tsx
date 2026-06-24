import { useState, useEffect } from 'react';
import { address, clinic, formatPhoneDisplay, getPhone, phoneHref } from '../data/clinic';
import Container from './ui/Container';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Treatments', href: '#services' },
  { label: 'Doctor', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] transition-colors duration-300 ${
          scrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-line shadow-sm'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-14">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col cursor-pointer touch-target justify-center"
            >
              <span
                className={`font-serif text-lg md:text-xl leading-tight transition-colors ${
                  scrolled ? 'text-ink' : 'text-paper'
                }`}
              >
                {clinic.nameLine1}
              </span>
              <span
                className={`font-sans text-[10px] tracking-wide uppercase transition-colors ${
                  scrolled ? 'text-muted' : 'text-paper/80'
                }`}
              >
                {clinic.nameLine2}
              </span>
            </a>

            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`nav-link font-sans text-sm transition-colors bg-transparent border-none cursor-pointer touch-target ${
                    scrolled ? 'text-muted hover:text-ink' : 'text-paper/90 hover:text-paper'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <a
                href={phoneHref(getPhone('main').number)}
                className={`font-sans text-sm transition-colors ${
                  scrolled ? 'text-muted hover:text-ink' : 'text-paper/90 hover:text-paper'
                }`}
              >
                {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className={scrolled ? 'btn-primary text-sm py-2 px-4' : 'btn-outline text-sm py-2 px-4'}
              >
                Book
              </button>
            </div>

            <button
              type="button"
              className="lg:hidden touch-target flex flex-col gap-1.5 items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-5 h-px transition-all ${
                  scrolled || menuOpen ? 'bg-ink' : 'bg-paper'
                } ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
              />
              <span
                className={`block w-5 h-px transition-all ${
                  scrolled || menuOpen ? 'bg-ink' : 'bg-paper'
                } ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-px transition-all ${
                  scrolled || menuOpen ? 'bg-ink' : 'bg-paper'
                } ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
              />
            </button>
          </div>
        </Container>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-paper flex flex-col lg:hidden">
          <div className="h-[var(--nav-height)] shrink-0" />
          <nav className="flex-1 overflow-y-auto px-6 py-8 pb-safe">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="block w-full text-left font-serif text-2xl text-ink py-4 border-b border-line bg-transparent cursor-pointer touch-target"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-8 space-y-4">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="btn-primary w-full"
              >
                Book Appointment
              </button>
              <a href={phoneHref(getPhone('main').number)} className="btn-secondary w-full">
                {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <p className="font-sans text-muted text-sm text-center pt-2">{address.short}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
