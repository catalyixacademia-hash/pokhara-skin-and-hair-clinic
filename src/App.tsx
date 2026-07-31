import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Treatments from './components/Treatments';
import CareStandards from './components/CareStandards';
import Gallery from './components/Gallery';
import ClinicDoctor from './components/ClinicDoctor';
import Outcomes from './components/Outcomes';
import Aesthetics from './components/Aesthetics';
import SocialProof from './components/SocialProof';
import Faq from './components/Faq';
import Visit from './components/Visit';
import GeneralEnquiry from './components/GeneralEnquiry';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

export default function App() {
  return (
    <div className="bg-paper min-h-screen">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main" className="pb-24 md:pb-8">
        <Hero />
        <Treatments />
        <CareStandards />
        <Gallery />
        <ClinicDoctor />
        <Outcomes />
        <Aesthetics />
        <SocialProof />
        <Faq />
        <Visit />
        <GeneralEnquiry />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
