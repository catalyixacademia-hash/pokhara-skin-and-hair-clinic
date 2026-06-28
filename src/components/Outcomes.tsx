import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import Reveal from './motion/Reveal';
import { skinServices, hairServices, aestheticServices } from '../data/services';

const outcomeGroups = [
  {
    label: 'Skin conditions',
    items: skinServices.map((s) => s.title),
  },
  {
    label: 'Hair & scalp',
    items: hairServices.map((s) => s.title),
  },
  {
    label: 'Aesthetic concerns',
    items: aestheticServices.map((s) => s.title),
  },
];

export default function Outcomes() {
  return (
    <section id="results" className="bg-surface-container-highest section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="04"
            title="Conditions we treat"
            lede="A focused overview of the dermatological and trichological concerns addressed at the clinic. Patient photography will be added when available."
          />
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {outcomeGroups.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.06}>
              <div className="space-y-6">
                <h3 className="category-heading">{group.label}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="font-body text-base text-muted">
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
