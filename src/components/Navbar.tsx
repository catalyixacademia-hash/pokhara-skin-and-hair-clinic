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
  { label: 'About', href: '#about' },
  { label: 'Treatments', href: '#services' },
  { label: 'Results', href: '#results' },
  { label: 'Doctor', href: '#doctor' },
  { label: 'Contact', href: '#contact' },
] as const;

type NavBrandProps = {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function NavBrand({ onClick }: NavBrandProps) {
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
        <span className="nav-brand__title block text-brand-green">Pokhara</span>
        <span className="nav-brand__subtitle text-brand-navy">Skin &amp; Hair Clinic</span>
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

  const linkClass = cn(
    'nav-link font-body text-sm bg-transparent border-none cursor-pointer touch-target py-2 text-muted hover:text-ink',
  );

  return (
    <>
      <header
        className={cn(
          'site-header fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] transition-colors duration-200',
          scrolled || menuOpen
            ? 'bg-surface/95 backdrop-blur-sm border-b border-line'
            : 'bg-paper/80 backdrop-blur-sm border-b border-transparent',
        )}
      >
        <Container>
          <div className="flex items-center justify-between gap-3 min-h-14 py-1.5">
            <NavBrand onClick={goHome} />

            <nav className="hidden md:flex items-center justify-center flex-1 gap-0.5 lg:gap-1 min-w-0" aria-label="Main">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={cn(linkClass, 'px-2 lg:px-3 text-[13px] lg:text-sm whitespace-nowrap')}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a
                href={adminLoginUrl}
                className="!hidden md:!inline-flex btn-secondary text-sm py-2 px-3 lg:px-4"
              >
                Staff login
              </a>
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="!hidden sm:!inline-flex btn-primary text-sm py-2 px-4 lg:px-5"
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
        <div className="fixed inset-0 z-40 bg-surface md:hidden pt-[var(--nav-height)] overflow-y-auto">
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
              <button type="button" onClick={() => handleNavClick('#contact')} className="btn-primary w-full">
                Book visit
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
