import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustStrip from './components/TrustStrip';
import ExosomesSpotlight from './components/ExosomesSpotlight';
import Treatments from './components/Treatments';
import CareStandards from './components/CareStandards';
import ClinicJourney from './components/ClinicJourney';
import ClinicDoctor from './components/ClinicDoctor';
import Outcomes from './components/Outcomes';
import Gallery from './components/Gallery';
import SocialProof from './components/SocialProof';
import Faq from './components/Faq';
import Visit from './components/Visit';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import MobileActionBar from './components/MobileActionBar';
import FinalCta from './components/FinalCta';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <div className="bg-paper min-h-screen">
      <Preloader />
      <SmoothScroll />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustStrip />
        <ExosomesSpotlight />
        <Treatments />
        <CareStandards />
        <ClinicDoctor />
        <Outcomes />
        <Gallery />
        <SocialProof />
        <Faq />
        <ClinicJourney />
        <FinalCta />
        <Visit />
      </main>
      <Footer />
      <WhatsAppFloat />
      <MobileActionBar />
    </div>
  );
}
