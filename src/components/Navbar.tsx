import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { address, clinic, formatPhoneDisplay, getPhone, phoneHref } from '../data/clinic';

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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 min-h-[var(--nav-height)] transition-all duration-500 ${
          scrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E8DDD4]'
            : 'bg-[#FAF8F5]/80 backdrop-blur-sm border-b border-[#E8DDD4]/60'
        }`}
      >
        <motion.div
          className="max-w-7xl mx-auto px-6 lg:px-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a
              href="#"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col cursor-pointer"
            >
              <span
                className={`font-serif text-xl font-light leading-tight tracking-wide transition-colors duration-300 ${
                  scrolled ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]'
                }`}
              >
                {clinic.nameLine1}
              </span>
              <span
                className={`font-sans text-[9px] tracking-[0.25em] uppercase font-light transition-colors duration-300 ${
                  scrolled ? 'text-[#A0896E]' : 'text-[#A0896E]'
                }`}
              >
                {clinic.nameLine2}
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`nav-link font-sans text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-300 bg-transparent border-none cursor-pointer ${
                    scrolled ? 'text-[#6B6560]' : 'text-[#6B6560]'
                  } hover:text-[#A0896E]`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href={phoneHref(getPhone('main').number)}
                className={`font-sans text-[11px] font-medium tracking-[0.15em] transition-colors duration-300 ${
                  scrolled ? 'text-[#6B6560]' : 'text-[#6B6560]'
                } hover:text-[#A0896E]`}
              >
                {formatPhoneDisplay(getPhone('main').number)}
              </a>
              <button
                onClick={() => handleNavClick('#contact')}
                className={`font-sans text-[10px] tracking-[0.18em] uppercase font-semibold px-4 py-2 border transition-all duration-300 ${
                  scrolled
                    ? 'border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAF8F5]'
                    : 'border-[#2C2C2C] text-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAF8F5]'
                }`}
              >
                Book Appointment
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={`block w-5 h-px transition-all duration-300 ${
                  scrolled ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]'
                } ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}
              />
              <span
                className={`block w-5 h-px transition-all duration-300 ${
                  scrolled ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]'
                } ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-5 h-px transition-all duration-300 ${
                  scrolled ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]'
                } ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}
              />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[#1A1816] flex flex-col"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
          >
            <div className="flex flex-col justify-center h-full px-10">
              <div className="mb-10">
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
                  Navigation
                </span>
              </div>
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="font-serif text-4xl font-light text-[#FAF8F5] hover:text-[#A0896E] transition-colors duration-300 text-left py-3 border-none bg-transparent cursor-pointer"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.div
                className="mt-12 pt-8 border-t border-[#2C2C2C]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="btn-bronze w-full justify-center"
                >
                  Book Appointment
                </button>
                <p className="font-sans text-[#6B6560] text-sm mt-6 text-center">
                  {address.short}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
