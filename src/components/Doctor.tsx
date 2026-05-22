import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const credentials = [
  { label: 'Qualification', value: 'MD, Dermatology & Venereology' },
  { label: 'Specialization', value: 'Clinical & Aesthetic Dermatology' },
  { label: 'Focus Areas', value: 'Hair Restoration, Acne, Anti-aging, Laser' },
  { label: 'Clinic', value: 'Pokhara Skin and Hair Clinic' },
  { label: 'Location', value: 'Nayabazar, Pokhara, Nepal' },
];

const philosophy = [
  {
    title: 'Patient-First Approach',
    body: 'Every treatment decision begins with a thorough understanding of the individual. I believe accurate diagnosis is the foundation of any effective treatment plan.',
  },
  {
    title: 'Evidence-Based Medicine',
    body: 'All procedures and protocols at the clinic are grounded in peer-reviewed medical science, not trends. Your safety and results are non-negotiable.',
  },
  {
    title: 'Natural Aesthetic Results',
    body: 'The goal is always to restore and enhance, never to alter. I aim for results that feel authentic to who you are, enhancing your confidence naturally.',
  },
];

export default function Doctor() {
  const { ref: leftRef, inView: leftInView } = useInView({ threshold: 0.15, triggerOnce: true });
  const { ref: rightRef, inView: rightInView } = useInView({ threshold: 0.15, triggerOnce: true });

  return (
    <section id="doctor" className="bg-[#EDE8DF] section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="grid lg:grid-cols-5 gap-14 lg:gap-20 items-start">

          {/* Left: Image + credentials */}
          <div ref={leftRef} className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: leftInView ? 1 : 0, x: leftInView ? 0 : -30 }}
              transition={{ duration: 1 }}
            >
              {/* Portrait */}
              <div className="img-zoom aspect-[3/4] overflow-hidden bg-[#C4B8A8] mb-8">
                <img
                  src="https://images.pexels.com/photos/7659876/pexels-photo-7659876.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600"
                  alt="Dr. Prakash Acharya - Consultant Dermatologist"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Name card */}
              <div className="border-l-2 border-[#A0896E] pl-5 mb-8">
                <h3 className="font-serif text-2xl font-light text-[#2C2C2C] mb-1">
                  Dr. Prakash Acharya
                </h3>
                <p className="font-sans text-[11px] tracking-[0.18em] uppercase text-[#A0896E]">
                  Consultant Dermatologist · MD
                </p>
              </div>

              {/* Credentials */}
              <div className="space-y-3">
                {credentials.map((c) => (
                  <div key={c.label} className="flex gap-3">
                    <span className="font-sans text-[10px] tracking-[0.12em] uppercase text-[#C4B8A8] w-24 shrink-0 pt-0.5">
                      {c.label}
                    </span>
                    <span className="font-sans text-xs text-[#2C2C2C] font-light leading-relaxed">
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Content */}
          <div ref={rightRef} className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: rightInView ? 1 : 0, y: rightInView ? 0 : 30 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="divider-thin" />
                <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#A0896E]">
                  Meet the Doctor
                </span>
              </div>

              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-[#2C2C2C] leading-[1.1] mb-8">
                A Commitment to{' '}
                <em className="italic text-[#A0896E]">Medically</em>
                <br />
                Guided Aesthetic Care
              </h2>

              <p className="font-sans text-[#6B6560] text-sm leading-[1.9] mb-5 font-light">
                Dr. Prakash Acharya is a qualified Consultant Dermatologist with an MD in Dermatology
                and Venereology. He established Pokhara Skin and Hair Clinic with the vision of making
                internationally standard dermatological care accessible to patients across the Gandaki region of Nepal.
              </p>

              <p className="font-sans text-[#6B6560] text-sm leading-[1.9] mb-10 font-light">
                With clinical expertise spanning medical dermatology, trichology, and aesthetic procedures,
                Dr. Acharya brings a holistic, evidence-based perspective to every patient interaction.
                His approach combines the precision of clinical medicine with a genuine understanding
                of the emotional dimensions of skin and hair health.
              </p>

              {/* Philosophy cards */}
              <div className="space-y-5 mb-10">
                {philosophy.map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: rightInView ? 1 : 0, x: rightInView ? 0 : 20 }}
                    transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                    className="bg-[#FAF8F5] border border-[#E8DDD4] p-5"
                  >
                    <h4 className="font-serif text-base font-light text-[#2C2C2C] mb-2">
                      {p.title}
                    </h4>
                    <p className="font-sans text-[#6B6560] text-xs leading-relaxed font-light">
                      {p.body}
                    </p>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                Schedule a Consultation
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
