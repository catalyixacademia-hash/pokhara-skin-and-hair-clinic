import Container from './ui/Container';
import { doctor } from '../data/clinic';

function BadgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DegreeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 4 2 9l10 5 10-5-10-5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 19c0-3 2.9-5.25 6.5-5.25S15.5 16 15.5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 5.5a3 3 0 0 1 0 5.75M17.5 13.9c2.4.5 4 2.2 4 4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function JournalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4.5A1.5 1.5 0 0 1 5.5 3H18a1 1 0 0 1 1 1v14.5a1.5 1.5 0 0 1-1.5 1.5H6a2 2 0 0 1-2-2V4.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 7.5h7M8 11h7M8 14.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Credential band directly below the hero.
 *
 * These proof points previously appeared only as an 11px hero ribbon that
 * rendered in body-ink because `--color-primary` was never defined, so the
 * clinic's strongest conversion signals were effectively invisible.
 */
export default function TrustStrip() {
  const items = [
    {
      icon: <BadgeIcon />,
      value: `NMC ${doctor.nmcNumber}`,
      label: 'Nepal Medical Council specialist',
    },
    {
      icon: <DegreeIcon />,
      value: 'MD Dermatology',
      label: 'Kathmandu University, 2020',
    },
    {
      icon: <PeopleIcon />,
      value: '10,000+ patients',
      label: 'Treated across the Gandaki region',
    },
    {
      icon: <JournalIcon />,
      value: '25+ publications',
      label: 'Peer-reviewed dermatology research',
    },
  ];

  return (
    <section className="trust-strip" aria-label="Clinic credentials">
      <Container>
        <ul className="trust-strip__list">
          {items.map((item) => (
            <li key={item.value} className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="trust-strip__value">{item.value}</span>
                <span className="trust-strip__label">{item.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
