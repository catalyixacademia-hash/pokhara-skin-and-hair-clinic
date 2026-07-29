import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';
import ImageUpload from '@/components/ImageUpload';

type Credential = { label: string; value: string };

type Doctor = {
  name: string;
  title: string;
  title_short: string;
  bio: string[];
  credentials: Credential[];
  portrait_url: string | null;
};

const DEFAULT_CREDENTIALS: Credential[] = [
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
];

const DEFAULT_DOCTOR: Doctor = {
  name: 'Dr. Prakash Acharya',
  title: 'Board Certified Dermatologist',
  title_short: 'Board Certified Dermatologist · MD',
  bio: [
    'Dr. Prakash Acharya is a Board Certified Dermatologist and Nepal Medical Council specialist (NMC Reg. No. 12549). He holds an MD in Dermatology from Kathmandu University (2020) and an MBBS from Tribhuvan University, Maharajgunj Medical Campus (2011). He established Pokhara Skin and Hair Clinic to bring evidence-based dermatological care to patients across Pokhara and the Gandaki region.',
    'His clinical work focuses on melasma and pigmentation, acne and scarring, hair loss, and regenerative anti-aging treatments tailored to South Asian skin. He has treated 10,000+ patients, authored 25+ peer-reviewed publications in journals including JAAD, BJD, and JEADV, and speaks at international meetings including IMCAS, MEIDAM, and ISAAH. He also practices in Kathmandu as founder of Reva Skin & Hair Clinic.',
  ],
  credentials: DEFAULT_CREDENTIALS,
  portrait_url: null,
};

function normalizeCredentials(raw: unknown): Credential[] {
  if (!Array.isArray(raw) || raw.length === 0) return [...DEFAULT_CREDENTIALS];
  return raw.map((item) => {
    if (item && typeof item === 'object' && 'label' in item && 'value' in item) {
      const row = item as Credential;
      return { label: String(row.label ?? ''), value: String(row.value ?? '') };
    }
    return { label: '', value: '' };
  });
}

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [bioText, setBioText] = useState('');
  const [credentials, setCredentials] = useState<Credential[]>(DEFAULT_CREDENTIALS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applyDoctor = (d: Doctor) => {
    setDoctor(d);
    setBioText((d.bio ?? []).join('\n\n'));
    setCredentials(normalizeCredentials(d.credentials));
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('doctor_profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (data) {
        applyDoctor(data as Doctor);
      } else {
        const { data: created, error: createError } = await supabase
          .from('doctor_profile')
          .upsert({ id: 1, ...DEFAULT_DOCTOR }, { onConflict: 'id' })
          .select()
          .maybeSingle();
        if (createError) setError(createError.message);
        applyDoctor((created as Doctor) ?? DEFAULT_DOCTOR);
      }
      setLoading(false);
    }
    void load();
  }, []);

  const updateCredential = (index: number, field: keyof Credential, value: string) => {
    setCredentials((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addCredential = () => {
    setCredentials((prev) => [...prev, { label: '', value: '' }]);
  };

  const removeCredential = (index: number) => {
    setCredentials((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;

    if (!doctor.name.trim() || !doctor.title.trim()) {
      setError('Name and title are required.');
      setMessage(null);
      return;
    }

    const cleanedCredentials = credentials
      .map((c) => ({ label: c.label.trim(), value: c.value.trim() }))
      .filter((c) => c.label || c.value);

    if (cleanedCredentials.some((c) => !c.label || !c.value)) {
      setError('Each credential needs both a label and a value.');
      setMessage(null);
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const { error: updateError } = await supabase
      .from('doctor_profile')
      .update({
        name: doctor.name.trim(),
        title: doctor.title.trim(),
        title_short: doctor.title_short.trim(),
        bio: bioText
          .split('\n\n')
          .map((p) => p.trim())
          .filter(Boolean),
        credentials: cleanedCredentials,
        portrait_url: doctor.portrait_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    const result = mutationResult(updateError);
    if (!result.ok) {
      setError(result.message);
    } else {
      setCredentials(cleanedCredentials);
      setMessage('Doctor profile saved.');
    }
    setSaving(false);
  };

  if (loading || !doctor) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Doctor Profile</h1>
      <p className="text-sm text-muted mb-4 max-w-2xl">
        Credentials should stay aligned with NMC registration and{' '}
        <a
          href="https://drprakashacharya.com.np/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-link"
        >
          drprakashacharya.com.np
        </a>
        .
      </p>
      <form onSubmit={(e) => void handleSave(e)} className="admin-card max-w-2xl space-y-4">
        {message && <p className="text-sm text-accent">{message}</p>}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div>
          <label className="admin-label">Name</label>
          <input
            className="admin-input"
            value={doctor.name}
            onChange={(e) => setDoctor({ ...doctor, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Title</label>
          <input
            className="admin-input"
            value={doctor.title}
            onChange={(e) => setDoctor({ ...doctor, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Short Title</label>
          <input
            className="admin-input"
            value={doctor.title_short ?? ''}
            onChange={(e) => setDoctor({ ...doctor, title_short: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Bio (paragraphs separated by blank line)</label>
          <textarea
            className="admin-input min-h-40"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
          />
        </div>

        <fieldset className="space-y-3 border border-line rounded p-4">
          <legend className="text-sm font-medium text-ink px-1">Credentials</legend>
          {credentials.map((row, index) => (
            <div key={index} className="grid sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-end">
              <div>
                <label className="admin-label">Label</label>
                <input
                  className="admin-input"
                  value={row.label}
                  onChange={(e) => updateCredential(index, 'label', e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Value</label>
                <input
                  className="admin-input"
                  value={row.value}
                  onChange={(e) => updateCredential(index, 'value', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="admin-btn-secondary text-xs py-2 px-3 mb-0.5"
                onClick={() => removeCredential(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="admin-btn-secondary text-xs" onClick={addCredential}>
            Add credential
          </button>
        </fieldset>

        <div>
          <label className="admin-label">Portrait</label>
          <ImageUpload
            folder="doctor"
            value={doctor.portrait_url ?? ''}
            onChange={(url) => setDoctor({ ...doctor, portrait_url: url })}
          />
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
