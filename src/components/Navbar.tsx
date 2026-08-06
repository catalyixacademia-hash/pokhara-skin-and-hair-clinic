import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  address,
  clinic,
  formatPhoneDisplay,
  getPhone,
  phoneHref,
} from '../data/clinic';
import { adminLoginUrl } from '../lib/admin-url';
import { useActiveSection } from '../hooks/useActiveSection';
import Container from './ui/Container';
import { cn } from '../utils/cn';

const navLinks = [
  { label: 'Treatments', href: '#services' },
  { label: 'Hair restoration', href: '#hair-services' },
  { label: 'Dermatology', href: '#doctor' },
  { label: 'Results', href: '#results' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;

const navHrefs = navLinks.map((l) => l.href);

/** Elements that can hold focus inside the mobile sheet. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

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

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type NavBrandProps = {
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

function NavBrand({ onClick }: NavBrandProps) {
  return (
    <a href="#" onClick={onClick} className="nav-brand">
      <img
        src="/clinic-logo-full.png"
        alt={clinic.nameShort}
        width={1024}
        height={512}
        className="nav-brand__logo"
        decoding="async"
      />
    </a>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /*
   * Active state is derived from scroll position. It used to be plain state set
   * only on click, defaulting to "#services" — so the header claimed the
   * visitor was in Treatments while they were still reading the hero.
   */
  const activeHref = useActiveSection(navHrefs);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Move focus into the sheet, trap it there, and restore it on close.
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key !== 'Tab' || !panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  // Close the sheet if the viewport grows into the desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    const list = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const goHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setMenuOpen(false);
  };

  const linkClass = (href: string) =>
    cn(
      'nav-link',
      activeHref === href && 'nav-link-active',
    );

  return (
    <>
      <header className="site-header glass-nav fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] border-b border-outline-variant">
        <Container>
          <div className="nav-row min-h-[var(--nav-height)]">
            <NavBrand onClick={goHome} />

            <nav className="nav-links" aria-label="Main">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={linkClass(link.href)}
                  aria-current={activeHref === link.href ? 'true' : undefined}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="nav-actions">
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
                className="nav-staff-icon nav-staff-desktop"
                aria-label="Staff login"
              >
                <PersonIcon />
              </a>

              <button
                ref={menuButtonRef}
                type="button"
                className="nav-menu-toggle"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-site-menu"
              >
                <span
                  className={cn(
                    'nav-menu-toggle__bar',
                    menuOpen && 'rotate-45 translate-y-[7px]',
                  )}
                />
                <span className={cn('nav-menu-toggle__bar', menuOpen && 'opacity-0')} />
                <span
                  className={cn(
                    'nav-menu-toggle__bar',
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
          ref={panelRef}
          id="mobile-site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="mobile-nav-panel fixed inset-0 z-40 lg:hidden pt-[var(--nav-height)] overflow-y-auto"
        >
          <div className="mobile-nav-content">
            <nav aria-label="Mobile" className="mobile-nav-links">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'mobile-nav-link',
                    activeHref === link.href && 'mobile-nav-link--active',
                  )}
                  aria-current={activeHref === link.href ? 'true' : undefined}
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
            </nav>

            <div className="mobile-nav-actions">
              <button
                type="button"
                onClick={() => handleNavClick('#contact')}
                className="btn-primary w-full"
              >
                Book appointment
              </button>
              <a
                href={phoneHref(getPhone('main').number)}
                className="btn-secondary w-full"
              >
                <PhoneIcon />
                Call {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <a href={adminLoginUrl} className="mobile-nav-staff">
                <PersonIcon />
                <span>Staff login</span>
              </a>
              <p className="font-body text-muted text-caption text-center pt-2">{address.short}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
