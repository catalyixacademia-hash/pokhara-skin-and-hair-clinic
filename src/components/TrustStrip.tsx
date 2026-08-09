import Container from './ui/Container';

function ClinicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20V8.5A1.5 1.5 0 0 1 5.5 7H9V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7h3.5A1.5 1.5 0 0 1 20 8.5V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 11v5M9.5 13.5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TreatmentsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 4h8a2 2 0 0 1 2 2v3.2a4 4 0 0 1-1.2 2.85L14 15v4h-4v-4l-2.8-2.95A4 4 0 0 1 6 9.2V6a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Clinic proof band directly below the hero.
 *
 * Keep this strip about the Pokhara clinic (place, hours, care scope) —
 * doctor credentials live in the Dermatology / ClinicDoctor section.
 */
export default function TrustStrip() {
  const items = [
    {
      icon: <ClinicIcon />,
      value: 'Dermatologist-led',
      label: 'Medical skin & hair care in Pokhara',
    },
    {
      icon: <PinIcon />,
      value: 'Opposite GMC',
      label: 'Nayabazar-8, easy to reach',
    },
    {
      icon: <ClockIcon />,
      value: 'Daily 8AM–7PM',
      label: 'Saturday OPD available',
    },
    {
      icon: <TreatmentsIcon />,
      value: 'Skin, hair & aesthetics',
      label: 'Treatments under one clinic roof',
    },
  ];

  return (
    <section className="trust-strip" aria-label="Clinic highlights">
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
