import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { mutationResult } from '@/lib/supabase-result';

type AddressFields = {
  line1: string;
  line2: string;
  landmark: string;
  area: string;
  short: string;
  mapCaption: string;
};

type HoursFields = {
  daily: string;
  saturdayNote: string;
  summary: string;
};

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

const DEFAULT_ADDRESS: AddressFields = {
  line1: 'Nayabazar-8, Pokhara',
  line2: 'Gandaki Province, Nepal',
  landmark: 'Opposite GMC Hospital (GMC Medical College) Gate',
  area: 'Prithvi Chowk area',
  short: 'Nayabazar-8, Pokhara, Nepal',
  mapCaption: 'Nayabazar-8 · Prithvi Chowk · Pokhara, Gandaki Province, Nepal',
};

const DEFAULT_HOURS: HoursFields = {
  daily: '8:00 AM – 7:00 PM',
  saturdayNote: 'Saturday OPD available',
  summary: 'Daily: 8AM–7PM',
};

const DEFAULT_SETTINGS: Settings = {
  name: 'Pokhara Skin and Hair Clinic',
  name_short: 'Pokhara Skin & Hair Clinic',
  tagline: '',
  address: { ...DEFAULT_ADDRESS },
  hours: { ...DEFAULT_HOURS },
  maps_embed_url: '',
  maps_open_url: '',
};

const PHONE_ROLES = ['main', 'appointments', 'landline', 'additional'] as const;

function toAddressFields(raw: Record<string, string> | null | undefined): AddressFields {
  return {
    line1: raw?.line1 ?? '',
    line2: raw?.line2 ?? '',
    landmark: raw?.landmark ?? '',
    area: raw?.area ?? '',
    short: raw?.short ?? '',
    mapCaption: raw?.mapCaption ?? '',
  };
}

function toHoursFields(raw: Record<string, string> | null | undefined): HoursFields {
  return {
    daily: raw?.daily ?? '',
    saturdayNote: raw?.saturdayNote ?? '',
    summary: raw?.summary ?? '',
  };
}

const emptyPhone = (): Omit<Phone, 'id'> => ({
  number: '',
  role: 'main',
  label: '',
  sort_order: 0,
});

export default function ClinicSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [address, setAddress] = useState<AddressFields>(DEFAULT_ADDRESS);
  const [hours, setHours] = useState<HoursFields>(DEFAULT_HOURS);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [phoneDraft, setPhoneDraft] = useState(emptyPhone());
  const [editingPhoneId, setEditingPhoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phoneSaving, setPhoneSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const applySettings = (s: Settings) => {
    setSettings(s);
    setAddress(toAddressFields(s.address));
    setHours(toHoursFields(s.hours));
  };

  const loadPhones = async () => {
    const { data, error: phonesError } = await supabase
      .from('phones')
      .select('*')
      .order('sort_order');
    if (phonesError) setError(phonesError.message);
    else setPhones((data ?? []) as Phone[]);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const [{ data: s, error: settingsError }, { data: p, error: phonesError }] = await Promise.all([
        supabase.from('clinic_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('phones').select('*').order('sort_order'),
      ]);

      if (settingsError) setError(settingsError.message);
      if (phonesError) setError(phonesError.message);

      if (s) {
        applySettings(s as Settings);
      } else if (!settingsError) {
        const { data: created, error: createError } = await supabase
          .from('clinic_settings')
          .upsert({ id: 1, ...DEFAULT_SETTINGS }, { onConflict: 'id' })
          .select()
          .maybeSingle();
        if (createError) setError(createError.message);
        applySettings((created as Settings) ?? DEFAULT_SETTINGS);
      }
      setPhones((p ?? []) as Phone[]);
      setLoading(false);
    }
    void load();
  }, []);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    if (!settings.name.trim() || !settings.name_short.trim()) {
      setError('Clinic name and short name are required.');
      setMessage(null);
      return;
    }
    if (!address.line1.trim() || !address.short.trim()) {
      setError('Address line 1 and short address are required.');
      setMessage(null);
      return;
    }
    if (!hours.daily.trim()) {
      setError('Daily hours are required.');
      setMessage(null);
      return;
    }

    setSaving(true);
    setMessage(null);
    setError(null);

    const addressPayload: Record<string, string> = {
      line1: address.line1.trim(),
      line2: address.line2.trim(),
      landmark: address.landmark.trim(),
      area: address.area.trim(),
      short: address.short.trim(),
      mapCaption: address.mapCaption.trim(),
    };
    const hoursPayload: Record<string, string> = {
      daily: hours.daily.trim(),
      saturdayNote: hours.saturdayNote.trim(),
      summary: hours.summary.trim() || `Daily: ${hours.daily.trim()}`,
    };

    const { error: updateError } = await supabase
      .from('clinic_settings')
      .update({
        name: settings.name.trim(),
        name_short: settings.name_short.trim(),
        tagline: settings.tagline.trim(),
        address: addressPayload,
        hours: hoursPayload,
        maps_embed_url: settings.maps_embed_url.trim(),
        maps_open_url: settings.maps_open_url.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    const result = mutationResult(updateError);
    if (!result.ok) {
      setError(result.message);
    } else {
      setSettings({
        ...settings,
        address: addressPayload,
        hours: hoursPayload,
      });
      setMessage('Settings saved.');
    }
    setSaving(false);
  };

  const startEditPhone = (phone: Phone) => {
    setEditingPhoneId(phone.id);
    setPhoneDraft({
      number: phone.number,
      role: phone.role,
      label: phone.label,
      sort_order: phone.sort_order,
    });
  };

  const cancelPhoneEdit = () => {
    setEditingPhoneId(null);
    setPhoneDraft(emptyPhone());
  };

  const savePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneDraft.number.trim() || !phoneDraft.label.trim()) {
      setError('Phone number and label are required.');
      return;
    }

    setPhoneSaving(true);
    setError(null);
    setMessage(null);

    const payload = {
      number: phoneDraft.number.trim(),
      role: phoneDraft.role,
      label: phoneDraft.label.trim(),
      sort_order: phoneDraft.sort_order,
      updated_at: new Date().toISOString(),
    };

    const { error: phoneError } = editingPhoneId
      ? await supabase.from('phones').update(payload).eq('id', editingPhoneId)
      : await supabase.from('phones').insert(payload);

    const result = mutationResult(phoneError);
    if (!result.ok) {
      setError(result.message);
    } else {
      setMessage(editingPhoneId ? 'Phone updated.' : 'Phone added.');
      cancelPhoneEdit();
      await loadPhones();
    }
    setPhoneSaving(false);
  };

  const deletePhone = async (id: string) => {
    setPhoneSaving(true);
    setError(null);
    const { error: deleteError } = await supabase.from('phones').delete().eq('id', id);
    const result = mutationResult(deleteError);
    if (!result.ok) setError(result.message);
    else {
      setMessage('Phone removed.');
      if (editingPhoneId === id) cancelPhoneEdit();
      await loadPhones();
    }
    setPhoneSaving(false);
  };

  if (loading || !settings) return <p className="text-muted">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl mb-6">Clinic Settings</h1>

      <form onSubmit={(e) => void saveSettings(e)} className="admin-card max-w-2xl space-y-4 mb-10">
        {message && <p className="text-sm text-accent">{message}</p>}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div>
          <label className="admin-label">Clinic Name</label>
          <input
            className="admin-input"
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Short Name</label>
          <input
            className="admin-input"
            value={settings.name_short ?? ''}
            onChange={(e) => setSettings({ ...settings, name_short: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="admin-label">Tagline</label>
          <textarea
            className="admin-input min-h-20"
            value={settings.tagline}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </div>

        <fieldset className="space-y-3 border border-line rounded p-4">
          <legend className="text-sm font-medium text-ink px-1">Address</legend>
          <div>
            <label className="admin-label">Line 1</label>
            <input
              className="admin-input"
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="admin-label">Line 2</label>
            <input
              className="admin-input"
              value={address.line2}
              onChange={(e) => setAddress({ ...address, line2: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Landmark</label>
            <input
              className="admin-input"
              value={address.landmark}
              onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Area</label>
            <input
              className="admin-input"
              value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Short address</label>
            <input
              className="admin-input"
              value={address.short}
              onChange={(e) => setAddress({ ...address, short: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="admin-label">Map caption</label>
            <input
              className="admin-input"
              value={address.mapCaption}
              onChange={(e) => setAddress({ ...address, mapCaption: e.target.value })}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3 border border-line rounded p-4">
          <legend className="text-sm font-medium text-ink px-1">Hours</legend>
          <div>
            <label className="admin-label">Daily hours</label>
            <input
              className="admin-input"
              value={hours.daily}
              onChange={(e) => setHours({ ...hours, daily: e.target.value })}
              required
              placeholder="8:00 AM – 7:00 PM"
            />
          </div>
          <div>
            <label className="admin-label">Saturday note</label>
            <input
              className="admin-input"
              value={hours.saturdayNote}
              onChange={(e) => setHours({ ...hours, saturdayNote: e.target.value })}
            />
          </div>
          <div>
            <label className="admin-label">Summary</label>
            <input
              className="admin-input"
              value={hours.summary}
              onChange={(e) => setHours({ ...hours, summary: e.target.value })}
              placeholder="Daily: 8AM–7PM"
            />
          </div>
        </fieldset>

        <div>
          <label className="admin-label">Maps Embed URL</label>
          <input
            className="admin-input"
            value={settings.maps_embed_url}
            onChange={(e) => setSettings({ ...settings, maps_embed_url: e.target.value })}
          />
        </div>
        <div>
          <label className="admin-label">Maps Open URL</label>
          <input
            className="admin-input"
            value={settings.maps_open_url}
            onChange={(e) => setSettings({ ...settings, maps_open_url: e.target.value })}
          />
        </div>
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>

      <h2 className="font-serif text-xl mb-4">Phone Numbers</h2>
      <div className="admin-card max-w-2xl space-y-4">
        <ul className="space-y-2 text-sm">
          {phones.length === 0 && <li className="text-muted">No phone numbers yet.</li>}
          {phones.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2">
              <div>
                <span className="font-medium text-ink">{p.label}</span>
                <span className="text-muted ml-2">{p.number}</span>
                <span className="text-xs text-muted ml-2">({p.role})</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="admin-btn-secondary text-xs py-1 px-2"
                  onClick={() => startEditPhone(p)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="admin-btn-danger text-xs py-1 px-2"
                  disabled={phoneSaving}
                  onClick={() => void deletePhone(p.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={(e) => void savePhone(e)} className="space-y-3 border-t border-line pt-4">
          <p className="text-sm font-medium text-ink">
            {editingPhoneId ? 'Edit phone' : 'Add phone'}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="admin-label">Label</label>
              <input
                className="admin-input"
                value={phoneDraft.label}
                onChange={(e) => setPhoneDraft({ ...phoneDraft, label: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">Number</label>
              <input
                className="admin-input"
                value={phoneDraft.number}
                onChange={(e) => setPhoneDraft({ ...phoneDraft, number: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="admin-label">Role</label>
              <select
                className="admin-input"
                value={phoneDraft.role}
                onChange={(e) => setPhoneDraft({ ...phoneDraft, role: e.target.value })}
              >
                {PHONE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="admin-label">Sort order</label>
              <input
                type="number"
                className="admin-input"
                value={phoneDraft.sort_order}
                onChange={(e) => setPhoneDraft({ ...phoneDraft, sort_order: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={phoneSaving} className="admin-btn-primary">
              {phoneSaving ? 'Saving…' : editingPhoneId ? 'Update phone' : 'Add phone'}
            </button>
            {editingPhoneId && (
              <button type="button" className="admin-btn-secondary" onClick={cancelPhoneEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
