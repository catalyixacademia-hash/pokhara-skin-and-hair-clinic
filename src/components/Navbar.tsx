import { useEffect, useRef, useState } from 'react';
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
  { label: 'Dermatology', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'Contact', href: '#contact' },
] as const;

function PersonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 9h18M8 2v4M16 2v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

type NavBrandProps = {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function NavBrand({ onClick }: NavBrandProps) {
  return (
    <a
      href="#"
      onClick={onClick}
      className="nav-brand"
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
        <span className="nav-brand__name">{clinic.nameShort}</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#services');
  const prefersReducedMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setActiveHref(href);
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setMenuOpen(false);
  };

  const linkClass = (href: string) =>
    cn(
      'nav-link bg-transparent border-none cursor-pointer touch-target py-2 px-2 xl:px-3 text-muted hover:text-accent whitespace-nowrap',
      activeHref === href && 'nav-link-active text-accent',
    );

  return (
    <>
      <header className="site-header glass-nav fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] border-b border-outline-variant shadow-sm">
        <Container>
          <div className="nav-row flex items-center justify-between gap-3 min-h-[var(--nav-height)]">
            <NavBrand onClick={goHome} />

            <nav className="hidden lg:flex items-center justify-center flex-1 gap-4 xl:gap-6 min-w-0" aria-label="Main">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={linkClass(link.href)}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="btn-nav-cta nav-book-desktop"
              >
                Book appointment
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="nav-book-mobile"
                aria-label="Book appointment"
              >
                <CalendarIcon />
              </button>

              <a
                href={adminLoginUrl}
                className="nav-staff-icon nav-staff-desktop touch-target"
                aria-label="Staff login"
              >
                <PersonIcon />
              </a>

              <button
                ref={menuButtonRef}
                type="button"
                className="nav-menu-toggle touch-target"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-site-menu"
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
        <div
          id="mobile-site-menu"
          className="mobile-nav-panel fixed inset-0 z-40 lg:hidden pt-[var(--nav-height)] overflow-y-auto"
        >
          <nav className="mobile-nav-content" aria-label="Mobile">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                className={cn('mobile-nav-link', activeHref === link.href && 'mobile-nav-link--active')}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNavClick('#enquiry')}
              className="mobile-nav-link"
            >
              Ask a question
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('#location')}
              className="mobile-nav-link"
            >
              Location
            </button>

            <div className="mobile-nav-actions">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="btn-nav-cta w-full"
              >
                Book appointment
              </button>
              <a
                href={adminLoginUrl}
                className="nav-staff-icon nav-staff-icon--menu w-full justify-center"
                aria-label="Staff login"
              >
                <PersonIcon />
                <span className="font-body text-sm">Staff login</span>
              </a>
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
