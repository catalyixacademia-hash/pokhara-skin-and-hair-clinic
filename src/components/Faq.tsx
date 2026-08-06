import { useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { faqs } from '../data/faq';
import { cn } from '../utils/cn';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="bg-surface section-padding"
      aria-labelledby="faq-heading"
    >
      <Container>
        <Reveal>
          <SectionIntro
            index="09"
            title="Visit FAQ"
            titleId="faq-heading"
            lede="Common questions before your first appointment."
          />
        </Reveal>

        <div className="faq-list max-w-3xl">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const triggerId = `faq-trigger-${i}`;
            return (
              <Reveal key={item.question} delay={i * 0.04}>
                <div className={cn('faq-item', open && 'faq-item--open')}>
                  <h3 className="faq-item__question">
                    <button
                      id={triggerId}
                      type="button"
                      className="faq-item__trigger"
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
                    hidden={!open}
                  >
                    <p className="faq-item__answer font-body text-base text-muted leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
