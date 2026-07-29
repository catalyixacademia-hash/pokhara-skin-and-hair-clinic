import { useEffect, useState } from 'react';
import { doctor as staticDoctor } from '../data/clinic';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type DoctorProfileView = {
  name: string;
  title: string;
  titleShort: string;
  qualificationLine: string;
  bio: string[];
  credentials: { label: string; value: string }[];
  portraitUrl: string;
  portraitAlt: string;
};

const FALLBACK_PORTRAIT = '/images/doctor/dr-prakash-acharya.png';

const fallback: DoctorProfileView = {
  name: staticDoctor.name,
  title: staticDoctor.title,
  titleShort: staticDoctor.titleShort,
  qualificationLine: staticDoctor.qualificationLine,
  bio: [...staticDoctor.bio],
  credentials: staticDoctor.credentials.map((c) => ({ ...c })),
  portraitUrl: FALLBACK_PORTRAIT,
  portraitAlt: staticDoctor.portraitAlt,
};

function parseBio(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((p): p is string => typeof p === 'string' && p.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return fallback.bio;
}

function parseCredentials(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return fallback.credentials;
  const parsed = value.filter(
    (c): c is { label: string; value: string } =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as { label?: unknown }).label === 'string' &&
      typeof (c as { value?: unknown }).value === 'string',
  );
  return parsed.length ? parsed : fallback.credentials;
}

function mapRow(row: {
  name: string;
  title: string;
  title_short: string | null;
  bio: unknown;
  credentials: unknown;
  portrait_url: string | null;
}): DoctorProfileView {
  const credentials = parseCredentials(row.credentials);
  const nmc = credentials.find((c) => /nmc/i.test(c.label));
  const qualificationLine =
    nmc?.value ??
    row.title_short?.trim() ??
    fallback.qualificationLine;

  return {
    name: row.name?.trim() || fallback.name,
    title: row.title?.trim() || fallback.title,
    titleShort: row.title_short?.trim() || fallback.titleShort,
    qualificationLine,
    bio: parseBio(row.bio),
    credentials,
    portraitUrl: row.portrait_url?.trim() || FALLBACK_PORTRAIT,
    portraitAlt: `${row.name?.trim() || fallback.name} — ${row.title?.trim() || fallback.title}`,
  };
}

export function useDoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfileView>(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('doctor_profile')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data?.name) {
          setProfile(mapRow(data));
          setFromDb(true);
        }
        setLoading(false);
      });
  }, []);

  return { doctor: profile, loading, fromDb };
}
