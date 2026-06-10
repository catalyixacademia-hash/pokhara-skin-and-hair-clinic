import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  address,
  clinic,
  doctor,
  footerServiceLinks,
  formatPhoneDisplay,
  hoursSummaryWithNote,
  phones,
  phoneHref,
  social,
} from '../data/clinic';

const quickLinks = [
  { label: 'About the Clinic', href: '#about' },
  { label: 'Our Treatments', href: '#services' },
  { label: 'Meet the Doctor', href: '#doctor' },
  { label: 'Patient Results', href: '#results' },
  { label: 'Book Appointment', href: '#contact' },
  { label: 'Find Us', href: '#location' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: social.instagram.url,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="5"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: social.facebook.url,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: social.tiktok.url,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: social.whatsapp.url,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: true });

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1816] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
          transition={{ duration: 0.9 }}
        >

          {/* Top: Brand + CTA */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-16 gap-10">
            <div className="max-w-xs">
              <div className="mb-4">
                <div className="font-serif text-2xl font-light text-[#FAF8F5] leading-tight">
                  {clinic.nameLine1}
                </div>
                <div className="font-sans text-[9px] tracking-[0.3em] uppercase text-[#A0896E]">
                  {clinic.nameLine2}
                </div>
              </div>
              <p className="font-sans text-[#6B6560] text-xs leading-[1.9] font-light mb-6">
                {clinic.tagline} Located in Nayabazar-8, Pokhara.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-9 h-9 border border-[#2C2C2C] flex items-center justify-center text-[#6B6560] hover:text-[#A0896E] hover:border-[#A0896E] transition-all duration-300"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* CTA box */}
            <div className="bg-[#2C2C2C] p-8 max-w-sm">
              <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] mb-2">
                Ready to Begin?
              </p>
              <h3 className="font-serif text-xl font-light text-[#FAF8F5] mb-4 leading-snug">
                Book your consultation with Dr. Acharya today
              </h3>
              <button
                onClick={() => scrollTo('#contact')}
                className="btn-bronze w-full justify-center"
              >
                Book Appointment
              </button>
            </div>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-16 border-t border-[#2C2C2C] pt-12">
            {/* Quick links */}
            <div>
              <h4 className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] mb-5">
                Navigation
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="font-sans text-xs text-[#6B6560] hover:text-[#FAF8F5] transition-colors duration-300 font-light bg-transparent border-none cursor-pointer text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] mb-5">
                Treatments
              </h4>
              <ul className="space-y-2.5">
                {footerServiceLinks.map((s) => (
                  <li key={s}>
                    <button
                      onClick={() => scrollTo('#services')}
                      className="font-sans text-xs text-[#6B6560] hover:text-[#FAF8F5] transition-colors duration-300 font-light bg-transparent border-none cursor-pointer text-left"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-sans text-[9px] tracking-[0.25em] uppercase text-[#A0896E] mb-5">
                Contact
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#3A3A3A] mb-1">Address</p>
                  <p className="font-sans text-xs text-[#6B6560] font-light leading-relaxed">
                    {address.line1}<br/>
                    {address.landmark}<br/>
                    {address.area}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#3A3A3A] mb-1">Phone</p>
                  {phones.map((phone) => (
                    <a
                      key={phone.role}
                      href={phoneHref(phone.number)}
                      className="block font-sans text-xs text-[#6B6560] font-light hover:text-[#FAF8F5] transition-colors"
                    >
                      {formatPhoneDisplay(phone.number)}
                      <span className="text-[#3A3A3A]"> · {phone.label}</span>
                    </a>
                  ))}
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.12em] uppercase text-[#3A3A3A] mb-1">Hours</p>
                  <p className="font-sans text-xs text-[#6B6560] font-light">{hoursSummaryWithNote()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-[#2C2C2C] pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="font-sans text-[10px] text-[#3A3A3A] font-light">
              &copy; {new Date().getFullYear()} {clinic.name}. All rights reserved.
            </p>
            <div className="flex gap-5">
              <span className="font-sans text-[10px] text-[#3A3A3A] font-light">
                {doctor.name}, MD · {doctor.title}
              </span>
            </div>
            <p className="font-sans text-[10px] text-[#2C2C2C] font-light">
              {address.line1}, {address.line2}
            </p>
          </div>

        </motion.div>

      </div>
    </footer>
  );
}
