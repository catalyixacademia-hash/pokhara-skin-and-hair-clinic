import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import Treatments from './components/Treatments';
import CareStandards from './components/CareStandards';
import ClinicDoctor from './components/ClinicDoctor';
import Outcomes from './components/Outcomes';
import Aesthetics from './components/Aesthetics';
import Gallery from './components/Gallery';
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
      <main id="main">
        <Hero />
        <TrustStrip />
        <Treatments />
        <CareStandards />
        <ClinicDoctor />
        <Outcomes />
        <Aesthetics />
        <Gallery />
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
