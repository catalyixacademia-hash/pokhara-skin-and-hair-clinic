import { useState, useEffect } from 'react';
import { address, clinic, formatPhoneDisplay, getPhone, phoneHref } from '../data/clinic';
import { adminLoginUrl } from '../lib/admin-url';
import Container from './ui/Container';
import { cn } from '../utils/cn';

const navLinks = [
  { label: 'Treatments', href: '#services' },
  { label: 'About', href: '#about' },
] as const;

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

  const onHero = !scrolled && !menuOpen;
  const linkClass = cn(
    'nav-link font-sans text-sm bg-transparent border-none cursor-pointer touch-target py-2',
    onHero ? 'nav-link-hero text-paper/90 hover:text-paper' : 'text-muted hover:text-ink',
  );

  return (
    <>
      <header
        className={cn(
          'site-header fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] transition-all duration-300',
          scrolled
            ? 'bg-paper/95 backdrop-blur-md border-b border-line shadow-sm'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex items-center justify-between gap-4 h-14">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setMenuOpen(false);
              }}
              className="shrink-0 touch-target flex items-center"
              aria-label={`${clinic.nameShort} home`}
            >
              <span
                className={cn(
                  'font-serif text-lg md:text-xl leading-none transition-colors',
                  onHero ? 'text-paper' : 'text-ink',
                )}
              >
                {clinic.nameShort}
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={cn(linkClass, 'px-3 lg:px-4')}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={adminLoginUrl}
                className={cn(
                  'hidden md:inline-flex text-sm py-2 px-3 lg:px-4 border transition-colors touch-target items-center',
                  onHero
                    ? 'text-paper/90 border-paper/30 hover:border-paper hover:text-paper'
                    : 'text-muted border-line hover:border-ink hover:text-ink',
                )}
              >
                Staff login
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className={cn(
                  'hidden sm:inline-flex btn-primary text-sm py-2 px-4 lg:px-5',
                  onHero && 'bg-paper text-ink border-paper hover:bg-transparent hover:text-paper',
                )}
              >
                Book visit
              </button>

              <button
                type="button"
                className="md:hidden touch-target flex flex-col gap-1.5 items-center justify-center w-11 h-11"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span
                  className={cn(
                    'block w-5 h-px transition-all',
                    onHero ? 'bg-paper' : 'bg-ink',
                    menuOpen && 'rotate-45 translate-y-[7px]',
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-px transition-all',
                    onHero ? 'bg-paper' : 'bg-ink',
                    menuOpen && 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-px transition-all',
                    onHero ? 'bg-paper' : 'bg-ink',
                    menuOpen && '-rotate-45 -translate-y-[7px]',
                  )}
                />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-paper md:hidden">
          <div className="h-[var(--nav-height)] shrink-0 border-b border-line" />
          <nav className="flex flex-col px-6 py-6 pb-safe" aria-label="Mobile">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-left font-serif text-xl text-ink py-4 border-b border-line bg-transparent cursor-pointer touch-target w-full"
              >
                {link.label}
              </button>
            ))}

            <div className="mt-8 space-y-3">
              <a href={adminLoginUrl} className="btn-secondary w-full text-center">
                Staff login
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="btn-primary w-full"
              >
                Book visit
              </button>
              <a href={phoneHref(getPhone('main').number)} className="btn-secondary w-full">
                Call {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <p className="font-sans text-muted text-xs text-center pt-3">{address.short}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
