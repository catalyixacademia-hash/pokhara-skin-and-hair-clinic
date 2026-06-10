import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { address, clinic } from '../data/clinic';

const stats = [
  { value: '5000+', label: 'Patients Treated' },
  { value: '15+', label: 'Aesthetic Procedures' },
  { value: '10+', label: 'Years Experience' },
  { value: '98%', label: 'Patient Satisfaction' },
];

export default function About() {
  const { ref: textRef, inView: textInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: imgRef, inView: imgInView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: statRef, inView: statInView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="about" className="bg-[#FAF8F5] section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Eyebrow */}
        <motion.div
          ref={textRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 20 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="divider-thin" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
            About the Clinic
          </span>
        </motion.div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Left: Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] font-light text-[#2C2C2C] leading-[1.1] mb-8"
            >
              Where Medical
              <br />
              <em className="italic text-[#A0896E]">Precision Meets</em>
              <br />
              Aesthetic Care
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="font-sans text-[#6B6560] text-sm leading-[1.9] mb-6 font-light"
            >
              {clinic.name} was founded with a singular vision — to bring internationally
              standard dermatology and aesthetic medicine to the people of Pokhara. Under the guidance
              of Dr. Prakash Acharya, every consultation is approached with clinical rigour and genuine
              human care.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="font-sans text-[#6B6560] text-sm leading-[1.9] mb-10 font-light"
            >
              We believe that great skin is the result of evidence-based medicine, not shortcuts.
              Each patient receives a personalized treatment plan built on accurate diagnosis,
              modern technology, and treatments proven to deliver safe, lasting results.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: textInView ? 1 : 0, y: textInView ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="flex items-center gap-4"
            >
              <button
                onClick={() => document.querySelector('#doctor')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Meet Our Doctor
              </button>
              <button
                onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-sans text-[10px] tracking-[0.18em] uppercase text-[#6B6560] hover:text-[#A0896E] transition-colors duration-300 flex items-center gap-2"
              >
                View Treatments
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Right: Image composition */}
          <div ref={imgRef} className="relative">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: imgInView ? 1 : 0, x: imgInView ? 0 : 40 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              {/* Main image */}
              <div className="img-zoom aspect-[4/5] overflow-hidden bg-[#E8DDD4]">
                <img
                  src="https://images.pexels.com/photos/4586740/pexels-photo-4586740.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=640"
                  alt="Doctor consulting patient"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Floating small image */}
              <motion.div
                className="absolute -left-10 bottom-16 w-36 h-44 lg:w-44 lg:h-56 img-zoom overflow-hidden border-4 border-[#FAF8F5] shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: imgInView ? 1 : 0, y: imgInView ? 0 : 30 }}
                transition={{ duration: 0.9, delay: 0.5 }}
              >
                <img
                  src="https://images.pexels.com/photos/7479517/pexels-photo-7479517.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=560&w=440"
                  alt="Skin care treatment"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>

              {/* Label card */}
              <motion.div
                className="absolute -right-4 top-10 bg-[#FAF8F5] border border-[#E8DDD4] shadow-lg px-5 py-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: imgInView ? 1 : 0, x: imgInView ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <div className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#A0896E] mb-1">
                  Located At
                </div>
                <div className="font-serif text-sm text-[#2C2C2C]">
                  {address.line1}
                </div>
                <div className="font-sans text-[10px] text-[#6B6560] mt-0.5">
                  {address.landmark}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statRef} className="border-t border-[#E8DDD4] pt-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: statInView ? 1 : 0, y: statInView ? 0 : 20 }}
                transition={{ duration: 0.7, delay: i * 0.12 }}
                className="text-center lg:border-r last:border-r-0 border-[#E8DDD4] px-4"
              >
                <div className="stat-number mb-2">{stat.value}</div>
                <div className="font-sans text-[11px] tracking-[0.12em] uppercase text-[#A0896E] font-light">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
