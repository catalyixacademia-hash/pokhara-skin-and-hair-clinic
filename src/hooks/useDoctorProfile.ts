import { useEffect, useState } from 'react';
import { doctor as staticDoctor, doctors as staticDoctors } from '../data/clinic';
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
  pullQuote: string;
};

type StaticDoctor = (typeof staticDoctors)[number];

function toView(source: StaticDoctor): DoctorProfileView {
  return {
    name: source.name,
    title: source.title,
    titleShort: source.titleShort,
    qualificationLine: source.qualificationLine,
    bio: [...source.bio],
    credentials: source.credentials.map((c) => ({ ...c })),
    portraitUrl: source.portraitUrl,
    portraitAlt: source.portraitAlt,
    pullQuote: source.pullQuote,
  };
}

const fallbacks: DoctorProfileView[] = staticDoctors.map(toView);

function matchStatic(name: string | null | undefined): StaticDoctor {
  const trimmed = name?.trim().toLowerCase() ?? '';
  const found = staticDoctors.find((d) => d.name.toLowerCase() === trimmed);
  if (found) return found;
  if (trimmed.includes('bishnu')) return staticDoctors[1];
  return staticDoctors[0];
}

function parseBio(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    return value.filter((p): p is string => typeof p === 'string' && p.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return fallback;
}

function parseCredentials(
  value: unknown,
  fallback: { label: string; value: string }[],
): { label: string; value: string }[] {
  if (!Array.isArray(value)) return fallback;
  const parsed = value.filter(
    (c): c is { label: string; value: string } =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as { label?: unknown }).label === 'string' &&
      typeof (c as { value?: unknown }).value === 'string',
  );
  return parsed.length ? parsed : fallback;
}

function mapRow(row: {
  name: string;
  title: string;
  title_short: string | null;
  bio: unknown;
  credentials: unknown;
  portrait_url: string | null;
  pull_quote?: string | null;
}): DoctorProfileView {
  const staticMatch = matchStatic(row.name);
  const credentials = parseCredentials(
    row.credentials,
    staticMatch.credentials.map((c) => ({ ...c })),
  );
  const nmc = credentials.find((c) => /nmc/i.test(c.label));
  const qualificationLine =
    nmc?.value ?? row.title_short?.trim() ?? staticMatch.qualificationLine;

  return {
    name: row.name?.trim() || staticMatch.name,
    title: row.title?.trim() || staticMatch.title,
    titleShort: row.title_short?.trim() || staticMatch.titleShort,
    qualificationLine,
    bio: parseBio(row.bio, [...staticMatch.bio]),
    credentials,
    portraitUrl: row.portrait_url?.trim() || staticMatch.portraitUrl,
    portraitAlt: `${row.name?.trim() || staticMatch.name} — ${row.title?.trim() || staticMatch.title}`,
    pullQuote: row.pull_quote?.trim() || staticMatch.pullQuote,
  };
}

function mergeWithFallbacks(rows: DoctorProfileView[]): DoctorProfileView[] {
  const names = new Set(rows.map((d) => d.name.toLowerCase()));
  const missing = fallbacks.filter((d) => !names.has(d.name.toLowerCase()));
  return [...rows, ...missing];
}

export function useDoctorProfiles() {
  const [profiles, setProfiles] = useState<DoctorProfileView[]>(fallbacks);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const applyRows = (data: unknown[] | null) => {
      if (!data || data.length === 0) return false;
      const mapped = data
        .filter((row) => {
          const record = row as { name?: unknown; is_published?: unknown };
          if (record.is_published === false) return false;
          return typeof record.name === 'string' && record.name.trim().length > 0;
        })
        .map((row) => mapRow(row as Parameters<typeof mapRow>[0]));
      if (!mapped.length) return false;
      setProfiles(mergeWithFallbacks(mapped));
      setFromDb(true);
      return true;
    };

    supabase
      .from('doctor_profile')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
      .then(async ({ data, error }) => {
        if (!error && applyRows(data)) {
          setLoading(false);
          return;
        }

        const retry = await supabase.from('doctor_profile').select('*').order('id');
        if (!retry.error) applyRows(retry.data);
        setLoading(false);
      });
  }, []);

  return { doctors: profiles, loading, fromDb };
}

/** @deprecated Use useDoctorProfiles — kept for any leftover singleton callers. */
export function useDoctorProfile() {
  const { doctors, loading, fromDb } = useDoctorProfiles();
  return { doctor: doctors[0] ?? toView(staticDoctor), loading, fromDb };
}
