import { useState } from 'react';
import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { faqs } from '../data/faq';
import { cn } from '../utils/cn';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface-container-low section-padding border-t border-outline-variant">
      <Container>
        <Reveal>
          <SectionIntro
            index="05b"
            title="Visit FAQ"
            lede="Common questions before your first appointment."
          />
        </Reveal>

        <div className="faq-list max-w-3xl">
          {faqs.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.question} delay={i * 0.04}>
                <div className={cn('faq-item', open && 'faq-item--open')}>
                  <button
                    type="button"
                    className="faq-item__trigger"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="font-display text-lg text-ink text-left">{item.question}</span>
                    <span className="faq-item__icon" aria-hidden>
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <p className="faq-item__answer font-body text-base text-muted leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
