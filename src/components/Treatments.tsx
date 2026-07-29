import Container from './ui/Container';
import SectionIntro from './ui/SectionIntro';
import TreatmentRow from './ui/TreatmentRow';
import Reveal from './motion/Reveal';
import { useServices } from '../hooks/useServices';

export default function Treatments() {
  const { skin: skinServices, hair: hairServices } = useServices();

  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-surface section-padding">
      <Container>
        <Reveal>
          <SectionIntro
            index="01"
            title="Treatments"
            lede="Skin care is our core specialty. Hair restoration and aesthetic procedures complement comprehensive dermatology."
          />
        </Reveal>

        <Reveal delay={0.05}>
          <div className="space-y-8 mb-12">
            <h3 className="category-heading">Skin care — primary specialty</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skinServices.map((service) => (
                <TreatmentRow
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="skin"
                  featured
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <button type="button" onClick={scrollToContact} className="btn-primary">
                Book a skin consultation
              </button>
              <button
                type="button"
                onClick={() =>
                  document.querySelector('#hair-services')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="font-body text-base text-muted hover:text-accent underline-offset-4 hover:underline bg-transparent border-none cursor-pointer text-left touch-target"
              >
                See hair restoration ↓
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div id="hair-services" className="space-y-8 scroll-mt-24">
            <h3 className="category-heading">Hair restoration — complementary care</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hairServices.map((service) => (
                <TreatmentRow
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  img={service.img}
                  category="hair"
                  featured
                />
              ))}
            </div>
            <p className="font-body text-sm text-muted">
              <button
                type="button"
                onClick={scrollToContact}
                className="text-secondary hover:text-accent underline-offset-4 hover:underline bg-transparent border-none cursor-pointer p-0 font-inherit"
              >
                Request a hair restoration visit
              </button>
              {' '}
              — we will confirm the right protocol during your consultation.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
