import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  address,
  clinic,
  formatPhoneDisplay,
  getPhone,
  phoneHref,
} from '../data/clinic';
import { adminLoginUrl } from '../lib/admin-url';
import Container from './ui/Container';
import { cn } from '../utils/cn';

const navLinks = [
  { label: 'Treatments', href: '#services' },
  { label: 'Hair restoration', href: '#hair-services' },
  { label: 'Dermatology', href: '#about' },
  { label: 'Results', href: '#results' },
  { label: 'Contact', href: '#contact' },
] as const;

type NavBrandProps = {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onHero: boolean;
};

function NavBrand({ onClick, onHero }: NavBrandProps) {
  return (
    <a
      href="#"
      onClick={onClick}
      className="nav-brand shrink-0"
      aria-label={`${clinic.nameShort} home`}
    >
      <span className="nav-brand__mark-wrap">
        <img
          src="/clinic-logo-mark.png?v=3"
          alt=""
          width={256}
          height={256}
          className="nav-brand__mark"
          decoding="async"
          aria-hidden
        />
      </span>
      <span className="nav-brand__text">
        <span
          className={cn(
            'nav-brand__title block',
            onHero ? 'text-accent' : 'text-brand-green',
          )}
        >
          {clinic.nameShort}
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
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

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setMenuOpen(false);
  };

  const onHero = !scrolled && !menuOpen;

  const linkClass = cn(
    'nav-link font-body text-sm bg-transparent border-none cursor-pointer touch-target py-2',
    onHero ? 'text-ink/80 hover:text-accent' : 'text-muted hover:text-ink',
  );

  return (
    <>
      <header
        className={cn(
          'site-header fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] transition-all duration-200',
          onHero
            ? 'bg-white/25 backdrop-blur-md border-b border-white/30'
            : 'bg-surface/95 backdrop-blur-sm border-b border-line',
        )}
      >
        <Container>
          <div className="flex items-center justify-between gap-3 min-h-14 py-1.5">
            <NavBrand onClick={goHome} onHero={onHero} />

            <nav className="hidden lg:flex items-center justify-center flex-1 gap-1 xl:gap-2 min-w-0" aria-label="Main">
              {navLinks.map((link, index) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    linkClass,
                    'px-2 xl:px-3 text-[13px] xl:text-sm whitespace-nowrap',
                    index === 0 && onHero && 'nav-link-active text-accent',
                  )}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={adminLoginUrl}
                className="hidden xl:inline-flex btn-secondary text-sm py-2 px-3"
              >
                Staff login
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="hidden sm:inline-flex btn-accent text-sm py-2 px-4 lg:px-5"
              >
                Book appointment
              </button>

              <button
                type="button"
                className="lg:hidden touch-target flex flex-col gap-1.5 items-center justify-center w-11 h-11"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span
                  className={cn(
                    'block w-5 h-px bg-ink transition-all',
                    menuOpen && 'rotate-45 translate-y-[7px]',
                  )}
                />
                <span
                  className={cn('block w-5 h-px bg-ink transition-all', menuOpen && 'opacity-0')}
                />
                <span
                  className={cn(
                    'block w-5 h-px bg-ink transition-all',
                    menuOpen && '-rotate-45 -translate-y-[7px]',
                  )}
                />
              </button>
            </div>
          </div>
        </Container>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-surface lg:hidden pt-[var(--nav-height)] overflow-y-auto">
          <nav className="flex flex-col px-6 py-6 pb-safe" aria-label="Mobile">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className="text-left font-display text-lg text-ink py-4 border-b border-line bg-transparent cursor-pointer touch-target w-full"
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick('#enquiry')}
              className="text-left font-display text-lg text-ink py-4 border-b border-line bg-transparent cursor-pointer touch-target w-full"
            >
              Ask a question
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#location')}
              className="text-left font-display text-lg text-ink py-4 border-b border-line bg-transparent cursor-pointer touch-target w-full"
            >
              Location
            </button>

            <div className="mt-8 space-y-3">
              <a href={adminLoginUrl} className="btn-secondary w-full text-center">
                Staff login
              </a>
              <button type="button" onClick={() => handleNavClick('#contact')} className="btn-accent w-full">
                Book appointment
              </button>
              <a href={phoneHref(getPhone('main').number)} className="btn-secondary w-full text-center">
                Call {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <p className="font-body text-muted text-xs text-center pt-3">{address.short}</p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
