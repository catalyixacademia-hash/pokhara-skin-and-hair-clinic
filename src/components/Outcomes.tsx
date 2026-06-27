import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { skinServices, hairServices, aestheticServices } from '../data/services';

const outcomeGroups = [
  {
    label: 'Skin conditions',
    category: 'skin' as const,
    items: skinServices.map((s) => s.title),
  },
  {
    label: 'Hair & scalp',
    category: 'hair' as const,
    items: hairServices.map((s) => s.title),
  },
  {
    label: 'Aesthetic concerns',
    category: 'aesthetic' as const,
    items: aestheticServices.map((s) => s.title),
  },
];

export default function Outcomes() {
  return (
    <section id="results" className="bg-paper section-padding-sm border-t border-line">
      <Container>
        <Reveal>
          <SectionIntro
            index="04"
            title="Conditions we treat"
            lede="A focused overview of the dermatological and trichological concerns addressed at the clinic. Patient photography will be added when available."
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {outcomeGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.06}>
              <div>
                <p
                  className={
                    group.category === 'hair'
                      ? 'mono-label text-hair-accent mb-4'
                      : 'mono-label mb-4'
                  }
                >
                  {group.label}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="font-body text-sm text-ink py-2 border-b border-line last:border-0"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
