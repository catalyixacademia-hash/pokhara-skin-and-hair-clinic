import { useReducedMotion } from 'framer-motion';

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function BookFab() {
  const prefersReducedMotion = useReducedMotion();

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToContact}
      className="book-fab"
      aria-label="Book appointment"
    >
      <CalendarIcon />
      <span className="book-fab__label">Book appointment</span>
    </button>
  );
}
