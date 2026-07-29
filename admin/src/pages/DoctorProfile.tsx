import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import ImageUpload from '@/components/ImageUpload';

type Doctor = {
  name: string;
  title: string;
  title_short: string;
  bio: string[];
  credentials: { label: string; value: string }[];
  portrait_url: string | null;
};

const DEFAULT_DOCTOR: Doctor = {
  name: 'Dr. Prakash Acharya',
  title: 'Board Certified Dermatologist',
  title_short: 'Board Certified Dermatologist · MD',
  bio: [
    'Dr. Prakash Acharya is a Board Certified Dermatologist and Nepal Medical Council specialist (NMC Reg. No. 12549). He holds an MD in Dermatology from Kathmandu University (2020) and an MBBS from Tribhuvan University, Maharajgunj Medical Campus (2011). He established Pokhara Skin and Hair Clinic to bring evidence-based dermatological care to patients across Pokhara and the Gandaki region.',
    'His clinical work focuses on melasma and pigmentation, acne and scarring, hair loss, and regenerative anti-aging treatments tailored to South Asian skin. He has treated 10,000+ patients, authored 25+ peer-reviewed publications in journals including JAAD, BJD, and JEADV, and speaks at international meetings including IMCAS, MEIDAM, and ISAAH. He also practices in Kathmandu as founder of Reva Skin & Hair Clinic.',
  ],
  credentials: [
    {
      label: 'NMC Registration',
      value: 'No. 12549 · Specialist (Dermatology) · Unlimited',
    },
    {
      label: 'MD, Dermatology',
      value: 'Kathmandu University, Nepal (2020)',
    },
    {
      label: 'MBBS',
      value: 'Tribhuvan University, Maharajgunj Medical Campus (2011)',
    },
    {
      label: 'Focus Areas',
      value:
        'Melasma & pigmentation, acne & scars, anti-aging, hair loss, regenerative dermatology',
    },
  ],
  portrait_url: null,
};

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [bioText, setBioText] = useState('');
  const [credentialsJson, setCredentialsJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const applyDoctor = (d: Doctor) => {
    setDoctor(d);
    setBioText((d.bio ?? []).join('\n\n'));
    setCredentialsJson(JSON.stringify(d.credentials ?? [], null, 2));
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('doctor_profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data) {
        applyDoctor(data as Doctor);
      } else {
        const { data: created } = await supabase
          .from('doctor_profile')
          .upsert({ id: 1, ...DEFAULT_DOCTOR }, { onConflict: 'id' })
          .select()
          .maybeSingle();
        applyDoctor((created as Doctor) ?? DEFAULT_DOCTOR);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setSaving(true);
    setMessage(null);
    try {
      const credentials = JSON.parse(credentialsJson) as { label: string; value: string }[];
      await supabase.from('doctor_profile').update({
        name: doctor.name,
        title: doctor.title,
        title_short: doctor.title_short,
        bio: bioText.split('\n\n').map((p) => p.trim()).filter(Boolean),
        credentials,
        portrait_url: doctor.portrait_url,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
      setMessage('Doctor profile saved.');
    } catch {
      setMessage('Invalid credentials JSON.');
    }
    setSaving(false);
  };

  if (loading || !doctor) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Doctor Profile</h1>
      <form onSubmit={handleSave} className="admin-card max-w-2xl space-y-4">
        {message && <p className="text-sm text-accent">{message}</p>}
        <div>
          <label className="admin-label">Name</label>
          <input className="admin-input" value={doctor.name} onChange={(e) => setDoctor({ ...doctor, name: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Title</label>
          <input className="admin-input" value={doctor.title} onChange={(e) => setDoctor({ ...doctor, title: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Short Title</label>
          <input className="admin-input" value={doctor.title_short ?? ''} onChange={(e) => setDoctor({ ...doctor, title_short: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Bio (paragraphs separated by blank line)</label>
          <textarea className="admin-input min-h-40" value={bioText} onChange={(e) => setBioText(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Credentials (JSON array)</label>
          <textarea className="admin-input min-h-40 font-mono text-xs" value={credentialsJson} onChange={(e) => setCredentialsJson(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Portrait</label>
          <ImageUpload folder="doctor" value={doctor.portrait_url ?? ''} onChange={(url) => setDoctor({ ...doctor, portrait_url: url })} />
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? 'Saving…' : 'Save Profile'}</button>
      </form>
    </div>
  );
}
