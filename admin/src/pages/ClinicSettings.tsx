import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Settings = {
  name: string;
  name_short: string;
  tagline: string;
  address: Record<string, string>;
  hours: Record<string, string>;
  maps_embed_url: string;
  maps_open_url: string;
};

type Phone = { id: string; number: string; role: string; label: string; sort_order: number };

const DEFAULT_SETTINGS: Settings = {
  name: 'Pokhara Skin and Hair Clinic',
  name_short: 'Pokhara Skin & Hair Clinic',
  tagline: '',
  address: {},
  hours: {},
  maps_embed_url: '',
  maps_open_url: '',
};

export default function ClinicSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [addressJson, setAddressJson] = useState('');
  const [hoursJson, setHoursJson] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const applySettings = (s: Settings) => {
    setSettings(s);
    setAddressJson(JSON.stringify(s.address ?? {}, null, 2));
    setHoursJson(JSON.stringify(s.hours ?? {}, null, 2));
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [{ data: s }, { data: p }] = await Promise.all([
        supabase.from('clinic_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('phones').select('*').order('sort_order'),
      ]);

      if (s) {
        applySettings(s as Settings);
      } else {
        // No singleton row yet — create one so the page renders and saves work.
        const { data: created } = await supabase
          .from('clinic_settings')
          .upsert({ id: 1, ...DEFAULT_SETTINGS }, { onConflict: 'id' })
          .select()
          .maybeSingle();
        applySettings((created as Settings) ?? DEFAULT_SETTINGS);
      }
      setPhones(p ?? []);
      setLoading(false);
    }
    void load();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    try {
      const address = JSON.parse(addressJson) as Record<string, string>;
      const hours = JSON.parse(hoursJson) as Record<string, string>;
      await supabase.from('clinic_settings').update({
        name: settings.name,
        name_short: settings.name_short,
        tagline: settings.tagline,
        address,
        hours,
        maps_embed_url: settings.maps_embed_url,
        maps_open_url: settings.maps_open_url,
        updated_at: new Date().toISOString(),
      }).eq('id', 1);
      setMessage('Settings saved.');
    } catch {
      setMessage('Invalid JSON in address or hours.');
    }
    setSaving(false);
  };

  if (loading || !settings) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Clinic Settings</h1>

      <form onSubmit={saveSettings} className="admin-card max-w-2xl space-y-4 mb-10">
        {message && <p className="text-sm text-accent">{message}</p>}
        <div>
          <label className="admin-label">Clinic Name</label>
          <input className="admin-input" value={settings.name} onChange={(e) => setSettings({ ...settings, name: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Short Name</label>
          <input className="admin-input" value={settings.name_short ?? ''} onChange={(e) => setSettings({ ...settings, name_short: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Tagline</label>
          <textarea className="admin-input min-h-20" value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Address (JSON)</label>
          <textarea className="admin-input min-h-32 font-mono text-xs" value={addressJson} onChange={(e) => setAddressJson(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Hours (JSON)</label>
          <textarea className="admin-input min-h-24 font-mono text-xs" value={hoursJson} onChange={(e) => setHoursJson(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">Maps Embed URL</label>
          <input className="admin-input" value={settings.maps_embed_url} onChange={(e) => setSettings({ ...settings, maps_embed_url: e.target.value })} />
        </div>
        <div>
          <label className="admin-label">Maps Open URL</label>
          <input className="admin-input" value={settings.maps_open_url} onChange={(e) => setSettings({ ...settings, maps_open_url: e.target.value })} />
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>

      <h2 className="font-serif text-xl mb-4">Phone Numbers</h2>
      <div className="admin-card max-w-2xl">
        <ul className="space-y-2 text-sm">
          {phones.length === 0 && <li className="text-muted">No phone numbers yet.</li>}
          {phones.map((p) => (
            <li key={p.id} className="flex justify-between border-b border-line pb-2">
              <span>{p.label}</span>
              <span className="text-muted">{p.number}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted mt-4">Edit phones via Supabase dashboard or extend this page with inline CRUD.</p>
      </div>
    </div>
  );
}
