import { address, clinic, hoursSummaryWithNote, landmarks, maps } from '../data/clinic';
import SectionHeader from './ui/SectionHeader';
import Container from './ui/Container';

export default function Location() {
  return (
    <section id="location" className="bg-paper section-padding border-t border-line">
      <Container>
        <SectionHeader label="Find us" title="Located in the heart of Pokhara" className="mb-10" />

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 -mx-4 sm:mx-0">
            <div className="map-frame w-full aspect-[4/3] md:aspect-video overflow-hidden border border-line">
              <iframe
                src={maps.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${clinic.name} Location`}
              />
            </div>
            <p className="font-sans text-sm text-muted mt-3 px-4 sm:px-0">{address.mapCaption}</p>
          </div>

          <div className="space-y-8 px-4 sm:px-0">
            <div>
              <h3 className="font-serif text-xl text-ink mb-3">Address</h3>
              <p className="font-sans text-sm font-medium text-ink mb-2">{clinic.name}</p>
              {address.full.map((line) => (
                <p key={line} className="font-sans text-sm text-muted">{line}</p>
              ))}
            </div>

            <div>
              <h3 className="font-serif text-xl text-ink mb-3">Landmarks</h3>
              <ul className="space-y-2">
                {landmarks.map((lm) => (
                  <li key={lm} className="font-sans text-sm text-muted flex gap-2">
                    <span className="text-accent">·</span>
                    {lm}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-xl text-ink mb-3">Getting here</h3>
              <p className="font-sans text-sm text-muted mb-2">Street parking available near the clinic.</p>
              <p className="font-sans text-sm text-muted">{hoursSummaryWithNote()}</p>
            </div>

            <a href={maps.openUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
              Open in Google Maps
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
