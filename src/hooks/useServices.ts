import { useMemo } from 'react';
import type { ServiceItem } from '../data/services';
import { fallbackServices } from '../types/cms';

type ServicesByCategory = {
  skin: ServiceItem[];
  hair: ServiceItem[];
  aesthetic: ServiceItem[];
  loading: boolean;
  fromDb: boolean;
};

/**
 * Public treatments always use curated local photography (clinic + results assets).
 * CMS/Pexels seed image_url values must not override the public site.
 */
export function useServices(): ServicesByCategory {
  return useMemo(
    () => ({
      skin: fallbackServices.skin,
      hair: fallbackServices.hair,
      aesthetic: fallbackServices.aesthetic,
      loading: false,
      fromDb: false,
    }),
    [],
  );
}
