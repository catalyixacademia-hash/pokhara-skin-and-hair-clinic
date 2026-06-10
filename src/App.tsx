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
import Location from './components/Location';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-ivory">
      <Navbar />
      {/* Reserves space so hero starts below the fixed header (all browsers) */}
      <div className="h-[var(--nav-height)] shrink-0" aria-hidden="true" />
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
        <Location />
      </main>
      <Footer />
    </div>
  );
}
