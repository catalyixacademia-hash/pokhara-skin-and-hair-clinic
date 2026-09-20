import Container from './ui/Container';
import { Stagger, StaggerItem } from './motion/Stagger';

function ClinicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v4.25L15 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TreatmentsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 14.5a4 4 0 0 1 7.75-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M11.5 15.5a3.5 3.5 0 1 0 3.5 3.5V11.2a2.2 2.2 0 1 1 2.2 2.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="14.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const items = [
  {
    icon: <ClinicIcon />,
    value: 'Dermatologist-led',
    label: 'Medical skin & hair care in Pokhara',
  },
  {
    icon: <PinIcon />,
    value: 'Opposite of GMC',
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

/**
 * Clinic proof band directly below the hero.
 * Keep this about place, hours, and care scope — not doctor credentials.
 */
export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Clinic highlights">
      <Container>
        <Stagger as="ul" className="trust-strip__list">
          {items.map((item) => (
            <StaggerItem key={item.value} as="li" className="trust-strip__item">
              <span className="trust-strip__icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="trust-strip__text">
                <span className="trust-strip__value">{item.value}</span>
                <span className="trust-strip__label">{item.label}</span>
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
