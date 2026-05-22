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
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar />
      <main>
        <Hero />
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
