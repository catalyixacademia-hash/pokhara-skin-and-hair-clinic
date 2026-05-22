import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const treatments = [
  'Skin Consultation',
  'Acne & Pigmentation',
  'Chemical Peel',
  'Microneedling',
  'Laser Treatment',
  'HydraFacial',
  'PRP Hair Therapy',
  'GFC Therapy',
  'Exosome Therapy',
  'Hair Fall Consultation',
  'Botox',
  'Dermal Fillers',
  'Anti-Aging Treatment',
  'Laser Hair Reduction',
  'General Dermatology',
];

const clinicHours = [
  { day: 'Sunday', time: '10:00 AM - 6:00 PM' },
  { day: 'Monday', time: '10:00 AM - 6:00 PM' },
  { day: 'Tuesday', time: '10:00 AM - 6:00 PM' },
  { day: 'Wednesday', time: '10:00 AM - 6:00 PM' },
  { day: 'Thursday', time: '10:00 AM - 6:00 PM' },
  { day: 'Friday', time: '10:00 AM - 2:00 PM' },
  { day: 'Saturday', time: 'Closed' },
];

export default function Appointment() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: '',
    date: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: '', phone: '', email: '', treatment: '', date: '', message: '' });
  };

  return (
    <section id="contact" className="bg-[#EDE8DF] section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={ref} className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Book a Visit
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1] max-w-2xl"
          >
            Begin Your Journey to{' '}
            <em className="italic text-[#A0896E]">Better Skin</em>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-14 lg:gap-20">

          {/* Left: Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -30 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <div className="bg-[#FAF8F5] border border-[#A8B5A2] p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#A8B5A2]/20 flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10l4 4 8-8" stroke="#A8B5A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-light text-[#2C2C2C] mb-2">Appointment Requested</h3>
                <p className="font-sans text-[#6B6560] text-sm font-light">
                  Thank you. We will contact you within 24 hours to confirm your appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="premium-input"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      required
                      className="premium-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="premium-input"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                      Preferred Treatment *
                    </label>
                    <select
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleChange}
                      required
                      className="premium-select"
                    >
                      <option value="">Select a treatment</option>
                      {treatments.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="premium-input"
                  />
                </div>

                <div>
                  <label className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] block mb-1">
                    Your Concern (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Briefly describe your skin or hair concern..."
                    rows={3}
                    className="premium-input resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    Request Appointment
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <a
                    href="https://wa.me/97798XXXXXXXX?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20at%20Pokhara%20Skin%20and%20Hair%20Clinic."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-[#A8B5A2] text-[#6B6560] hover:bg-[#A8B5A2]/10 transition-all duration-300"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#A8B5A2">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <span className="font-sans text-[10px] tracking-[0.15em] uppercase">WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-2 space-y-10"
          >
            {/* Contact info */}
            <div>
              <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-5">Contact Details</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="mt-0.5 shrink-0">
                    <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"/>
                    <circle cx="8" cy="6" r="1.5"/>
                  </svg>
                  <div>
                    <p className="font-sans text-xs text-[#2C2C2C] font-light">Nayabazar / Zero KM Area</p>
                    <p className="font-sans text-xs text-[#6B6560] font-light">Opposite GMC Hospital Gate, Pokhara, Nepal</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="shrink-0">
                    <path d="M14 11c0 .3-.1.6-.2.8L12 13.6c-.4.4-.9.6-1.4.4C7 12.8 3.2 9 1.9 5.4c-.2-.5 0-1 .4-1.4L4.2 2.2C4.4 2.1 4.7 2 5 2c.3 0 .5.1.7.3L8 5.4c.2.2.3.5.3.7 0 .2-.1.5-.3.7L7 7.9c.9 1.8 2.3 3.2 4.1 4.1l1.1-1c.2-.2.5-.3.7-.3.2 0 .5.1.7.3l2.1 2.3c.2.2.3.4.3.7z"/>
                  </svg>
                  <div>
                    <p className="font-sans text-xs text-[#2C2C2C] font-light">+977 61-XXXXXX</p>
                    <p className="font-sans text-xs text-[#6B6560] font-light">+977 98XXXXXXXX</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="shrink-0">
                    <rect x="1" y="3" width="14" height="10" rx="1.5"/>
                    <path d="M1 5l7 5 7-5"/>
                  </svg>
                  <p className="font-sans text-xs text-[#2C2C2C] font-light">info@pokharaskinhairclinic.com</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-5">Clinic Hours</h3>
              <div className="space-y-2">
                {clinicHours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center py-1.5 border-b border-[#E8DDD4] last:border-0">
                    <span className="font-sans text-xs text-[#6B6560] font-light">{h.day}</span>
                    <span className={`font-sans text-xs font-light ${h.time === 'Closed' ? 'text-[#C4B8A8] italic' : 'text-[#2C2C2C]'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action */}
            <div className="bg-[#2C2C2C] p-6">
              <h4 className="font-serif text-lg font-light text-[#FAF8F5] mb-2">
                Need Immediate Assistance?
              </h4>
              <p className="font-sans text-[#6B6560] text-xs mb-4 font-light">
                WhatsApp us directly for quick appointments or urgent queries.
              </p>
              <a
                href="https://wa.me/97798XXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bronze w-full justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
