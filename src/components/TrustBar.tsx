import Container from './ui/Container';

const trustItems = [
  { label: 'Board Certified', sub: 'MD dermatologist' },
  { label: 'Skin Analysis', sub: 'Modern diagnostics' },
  { label: 'Personalized Care', sub: 'Individual plans' },
  { label: 'Evidence-Based', sub: 'Safe procedures' },
  { label: 'Hair Restoration', sub: 'PRP · GFC · Exosome' },
];

export default function TrustBar() {
  return (
    <section className="border-b border-line bg-accent-soft py-6 md:py-8">
      <Container>
        <div className="trust-scroll">
          {trustItems.map((item) => (
            <div key={item.label} className="text-center px-2 md:px-4">
              <p className="font-sans text-sm font-medium text-ink mb-1">{item.label}</p>
              <p className="font-sans text-xs text-muted">{item.sub}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
