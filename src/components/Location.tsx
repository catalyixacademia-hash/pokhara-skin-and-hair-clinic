import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function Location() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id="location" className="bg-[#FAF8F5] section-padding">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div ref={ref} className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="divider-thin" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
              Find Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-[clamp(2rem,4.5vw,3.2rem)] font-light text-[#2C2C2C] leading-[1.1]"
          >
            Located in the Heart of{' '}
            <em className="italic text-[#A0896E]">Pokhara</em>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.97 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="map-frame w-full aspect-[16/9] overflow-hidden border border-[#E8DDD4]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d83.9856!3d28.2096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNayabazar%2C+Pokhara!5e0!3m2!1sen!2snp!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'saturate(0.2) brightness(1.05)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pokhara Skin and Hair Clinic Location"
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#A0896E]" />
              <span className="font-sans text-[10px] text-[#6B6560] tracking-wide">
                Nayabazar / Zero KM · Pokhara, Gandaki Province, Nepal
              </span>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-4">Clinic Address</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="mt-0.5 shrink-0">
                    <path d="M8 1C5.2 1 3 3.2 3 6c0 4 5 9 5 9s5-5 5-9c0-2.8-2.2-5-5-5z"/>
                    <circle cx="8" cy="6" r="1.5"/>
                  </svg>
                  <div>
                    <p className="font-sans text-xs font-medium text-[#2C2C2C] mb-0.5">Pokhara Skin and Hair Clinic</p>
                    <p className="font-sans text-xs text-[#6B6560] font-light leading-relaxed">
                      Nayabazar / Zero KM Area<br/>
                      Opposite GMC Hospital Gate<br/>
                      Pokhara, Gandaki Province<br/>
                      Nepal
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-4">Landmarks Nearby</h3>
              <ul className="space-y-2">
                {[
                  'Opposite GMC Hospital Main Gate',
                  'Nayabazar Zero KM intersection',
                  'Near Prithvi Narayan Campus area',
                ].map((lm) => (
                  <li key={lm} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#A0896E] mt-1.5 shrink-0" />
                    <span className="font-sans text-xs text-[#6B6560] font-light">{lm}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl font-light text-[#2C2C2C] mb-4">Getting Here</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="mt-0.5 shrink-0">
                    <path d="M8 1l1.5 3.5L13 5l-2.5 2.5.5 3.5L8 9.5 5 11l.5-3.5L3 5l3.5-.5z"/>
                  </svg>
                  <div>
                    <p className="font-sans text-xs font-medium text-[#2C2C2C] mb-0.5">By Vehicle</p>
                    <p className="font-sans text-xs text-[#6B6560] font-light">Ample street parking available near the clinic.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#A0896E" strokeWidth="1.2" className="mt-0.5 shrink-0">
                    <circle cx="8" cy="8" r="6"/>
                    <path d="M8 5v3l2 2"/>
                  </svg>
                  <div>
                    <p className="font-sans text-xs font-medium text-[#2C2C2C] mb-0.5">Open Hours</p>
                    <p className="font-sans text-xs text-[#6B6560] font-light">Sun–Thu: 10AM–6PM · Fri: 10AM–2PM</p>
                  </div>
                </div>
              </div>
            </div>

            <a
              href="https://goo.gl/maps/pokhara-skin-hair-clinic"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center"
            >
              Open in Google Maps
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
