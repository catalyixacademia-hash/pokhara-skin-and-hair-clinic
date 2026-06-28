import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Treatments from './components/Treatments';
import CareStandards from './components/CareStandards';
import ClinicDoctor from './components/ClinicDoctor';
import Outcomes from './components/Outcomes';
import SocialProof from './components/SocialProof';
import Visit from './components/Visit';
import GeneralEnquiry from './components/GeneralEnquiry';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import BookFab from './components/BookFab';

export default function App() {
  return (
    <div className="bg-paper min-h-screen">
      <Navbar />
      <Hero />
      <main className="pb-24 md:pb-8">
        <Treatments />
        <CareStandards />
        <ClinicDoctor />
        <Outcomes />
        <SocialProof />
        <Visit />
        <GeneralEnquiry />
      </main>
      <Footer />
      <WhatsAppFloat />
      <BookFab />
    </div>
  );
}
