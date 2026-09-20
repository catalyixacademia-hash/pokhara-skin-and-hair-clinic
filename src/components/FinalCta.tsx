import { useClinicSettings } from '../hooks/useClinicSettings';
import { buildWhatsAppHref } from '../lib/whatsapp';
import { scrollToId } from '../lib/scroll';
import Container from './ui/Container';
import Reveal from './motion/Reveal';

const WA_MESSAGE = 'Hello, I would like to book a visit at Pokhara Skin and Hair Clinic.';

export default function FinalCta() {
  const { settings } = useClinicSettings();
  const waHref = buildWhatsAppHref(settings.social.whatsappFloatNumber, WA_MESSAGE);

  return (
    <section className="final-cta" aria-labelledby="final-cta-heading">
      <div className="final-cta__grain" aria-hidden="true" />
      <Container>
        <Reveal>
          <div className="relative z-[1] max-w-3xl mx-auto text-center">
            <h2 id="final-cta-heading" className="final-cta__title">
              Healthy skin starts with a <em>conversation</em>
            </h2>
            <p className="font-body text-body-lg mt-4 text-white/80 max-w-xl mx-auto">
              Book a dermatologist-led consultation or message us on WhatsApp — we reply within one
              business day.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                className="btn-primary"
                style={{ background: '#fff', color: '#005f56', backgroundImage: 'none' }}
                onClick={() => scrollToId('#contact')}
              >
                Book appointment
              </button>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-outline"
                style={{ borderColor: 'rgba(255,255,255,0.55)', color: '#fff' }}
              >
                WhatsApp us
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
