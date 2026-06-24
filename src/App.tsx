import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import About from './components/About';
import Services from './components/Services';
import Results from './components/Results';
import Doctor from './components/Doctor';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import SocialGallery from './components/SocialGallery';
import Appointment from './components/Appointment';
import GeneralEnquiry from './components/GeneralEnquiry';
import Location from './components/Location';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';

export default function App() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <div className="hero-viewport">
        <Hero />
      </div>
      <main>
        <TrustBar />
        <About />
        <Services />
        <Results />
        <Doctor />
        <WhyUs />
        <Testimonials />
        <SocialGallery />
        <Appointment />
        <GeneralEnquiry />
        <Location />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
