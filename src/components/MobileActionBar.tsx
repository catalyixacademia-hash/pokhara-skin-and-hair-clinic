import { useEffect, useState } from 'react';
import {
  formatPhoneDisplay,
  getPhone,
  phoneHref,
} from '../data/clinic';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { buildWhatsAppHref } from '../lib/whatsapp';
import { scrollToId } from '../lib/scroll';
import { cn } from '../utils/cn';

const WA_MESSAGE = 'Hello, I would like to contact Pokhara Skin and Hair Clinic.';

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

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

/**
 * Sticky mobile conversion bar: Call · WhatsApp · Book.
 * Appears after the hero; hides when the booking form is in view.
 */
export default function MobileActionBar() {
  const { settings } = useClinicSettings();
  const [visible, setVisible] = useState(false);
  const [nearContact, setNearContact] = useState(false);
  const phone = getPhone('main');
  const waHref = buildWhatsAppHref(
    settings.social.whatsappFloatNumber,
    WA_MESSAGE,
  );

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector('.hero-section');
      const contact = document.querySelector('#contact');
      const heroBottom = hero
        ? hero.getBoundingClientRect().bottom
        : 400;
      setVisible(heroBottom < 80);

      if (contact) {
        const rect = contact.getBoundingClientRect();
        setNearContact(rect.top < window.innerHeight * 0.85 && rect.bottom > 0);
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const show = visible && !nearContact;

  return (
    <nav
      className={cn('mobile-action-bar', show && 'mobile-action-bar--visible')}
      aria-label="Quick actions"
      aria-hidden={!show}
    >
      <a
        href={phoneHref(phone.number)}
        className="mobile-action-bar__btn"
        tabIndex={show ? 0 : -1}
      >
        <PhoneIcon />
        <span>Call</span>
        <span className="sr-only">{formatPhoneDisplay(phone.number)}</span>
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-action-bar__btn mobile-action-bar__btn--wa"
        tabIndex={show ? 0 : -1}
      >
        <WhatsAppIcon />
        <span>WhatsApp</span>
      </a>
      <button
        type="button"
        className="mobile-action-bar__btn mobile-action-bar__btn--book"
        onClick={() => scrollToId('#contact')}
        tabIndex={show ? 0 : -1}
      >
        <CalendarIcon />
        <span>Book</span>
      </button>
    </nav>
  );
}
