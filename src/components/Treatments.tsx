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
          <div className="space-y-8 mb-20">
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
                  onSelect={scrollToContact}
                />
              ))}
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
                  onSelect={scrollToContact}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
