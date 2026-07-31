import { useEffect, useState } from 'react';
import {
  address as staticAddress,
  clinic as staticClinic,
  hours as staticHours,
  maps as staticMaps,
  social as staticSocial,
} from '../data/clinic';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type ClinicSettingsView = {
  name: string;
  nameShort: string;
  tagline: string;
  address: {
    line1: string;
    line2: string;
    landmark: string;
    area: string;
    short: string;
    full: string[];
    mapCaption: string;
  };
  hours: {
    daily: string;
    saturdayNote: string;
    summary: string;
  };
  maps: {
    embedUrl: string;
    openUrl: string;
    reviewsUrl: string;
  };
  social: {
    instagramUrl: string;
    facebookUrl: string;
    tiktokUrl: string;
    whatsappMainUrl: string;
    whatsappFloatNumber: string;
  };
};

const fallback: ClinicSettingsView = {
  name: staticClinic.name,
  nameShort: staticClinic.nameShort,
  tagline: staticClinic.tagline,
  address: {
    line1: staticAddress.line1,
    line2: staticAddress.line2,
    landmark: staticAddress.landmark,
    area: staticAddress.area,
    short: staticAddress.short,
    full: [...staticAddress.full],
    mapCaption: staticAddress.mapCaption,
  },
  hours: {
    daily: staticHours.daily,
    saturdayNote: staticHours.saturdayNote,
    summary: staticHours.summary,
  },
  maps: {
    embedUrl: staticMaps.embedUrl,
    openUrl: staticMaps.openUrl,
    reviewsUrl: staticMaps.reviewsUrl,
  },
  social: {
    instagramUrl: staticSocial.instagram.url,
    facebookUrl: staticSocial.facebook.url,
    tiktokUrl: staticSocial.tiktok.url,
    whatsappMainUrl: staticSocial.whatsapp.url,
    whatsappFloatNumber: staticSocial.whatsappFloat.number,
  },
};

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function str(value: unknown, fallbackValue: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallbackValue;
}

function mapRow(row: Record<string, unknown>): ClinicSettingsView {
  const addr = asRecord(row.address);
  const hrs = asRecord(row.hours);
  const fullFromDb = addr.full;
  const full =
    Array.isArray(fullFromDb) && fullFromDb.every((x) => typeof x === 'string')
      ? (fullFromDb as string[])
      : fallback.address.full;

  return {
    name: str(row.name, fallback.name),
    nameShort: str(row.name_short, fallback.nameShort),
    tagline: str(row.tagline, fallback.tagline),
    address: {
      line1: str(addr.line1, fallback.address.line1),
      line2: str(addr.line2, fallback.address.line2),
      landmark: str(addr.landmark, fallback.address.landmark),
      area: str(addr.area, fallback.address.area),
      short: str(addr.short, fallback.address.short),
      full,
      mapCaption: str(addr.mapCaption, fallback.address.mapCaption),
    },
    hours: {
      daily: str(hrs.daily, fallback.hours.daily),
      saturdayNote: str(hrs.saturdayNote, fallback.hours.saturdayNote),
      summary: str(hrs.summary, fallback.hours.summary),
    },
    maps: {
      embedUrl: str(row.maps_embed_url, fallback.maps.embedUrl),
      openUrl: str(row.maps_open_url, fallback.maps.openUrl),
      reviewsUrl: str(row.maps_reviews_url, fallback.maps.reviewsUrl),
    },
    social: {
      instagramUrl: str(row.social_instagram_url, fallback.social.instagramUrl),
      facebookUrl: str(row.social_facebook_url, fallback.social.facebookUrl),
      tiktokUrl: str(row.social_tiktok_url, fallback.social.tiktokUrl),
      whatsappMainUrl: str(row.whatsapp_main_url, fallback.social.whatsappMainUrl),
      whatsappFloatNumber: str(row.whatsapp_float_number, fallback.social.whatsappFloatNumber),
    },
  };
}

export function useClinicSettings() {
  const [settings, setSettings] = useState<ClinicSettingsView>(fallback);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('clinic_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data && typeof (data as { name?: string }).name === 'string') {
          setSettings(mapRow(data as Record<string, unknown>));
          setFromDb(true);
        }
        setLoading(false);
      });
  }, []);

  return { settings, loading, fromDb };
}
