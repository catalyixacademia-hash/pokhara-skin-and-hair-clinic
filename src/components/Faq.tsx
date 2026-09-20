import { useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { faqs } from '../data/faq';
import { cn } from '../utils/cn';
import { useClinicSettings } from '../hooks/useClinicSettings';
import { buildWhatsAppHref } from '../lib/whatsapp';

const FAQ_WA_MESSAGE =
  'Hello, I have a question before booking at Pokhara Skin and Hair Clinic.';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { settings } = useClinicSettings();
  const waHref = buildWhatsAppHref(settings.social.whatsappFloatNumber, FAQ_WA_MESSAGE);

  return (
    <section
      id="faq"
      className="bg-surface section-padding"
      aria-labelledby="faq-heading"
    >
      <Container>
        <div className="faq-layout">
          <Reveal className="faq-layout__aside">
            <SectionIntro
              index="08"
              title="Visit FAQ"
              titleId="faq-heading"
              lede="Common questions before your first appointment."
              className="mb-0"
            />
            <aside className="faq-wa-card">
              <p className="font-display text-h3 text-ink mb-2">Still have a question?</p>
              <p className="font-body text-sm text-muted leading-relaxed mb-4">
                Message us on WhatsApp — we usually reply during clinic hours.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex w-full sm:w-auto justify-center"
              >
                Ask on WhatsApp
              </a>
            </aside>
          </Reveal>

          <div className="faq-list">
            {faqs.map((item, i) => {
              const open = openIndex === i;
              const panelId = `faq-panel-${i}`;
              const triggerId = `faq-trigger-${i}`;
              return (
                <Reveal key={item.question} delay={Math.min(i, 4) * 0.05}>
                  <div className={cn('faq-item', open && 'faq-item--open')}>
                    <h3 className="faq-item__question">
                      <button
                        id={triggerId}
                        type="button"
                        className="faq-item__trigger min-h-11"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(open ? null : i)}
                      >
                        <span>{item.question}</span>
                        <span className="faq-item__icon" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                              d="M7 1v12M1 7h12"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="faq-item__panel"
                    >
                      <div className="faq-item__panel-inner">
                        <p className="faq-item__answer font-body text-base text-muted leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
