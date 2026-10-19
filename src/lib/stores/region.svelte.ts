import type { Currency, Region } from '../schema';

export const REGION_CURRENCIES: Record<Region, Currency> = { EU: 'EUR', UK: 'GBP', US: 'USD' };
export function isRegion(value: unknown): value is Region {
  return value === 'EU' || value === 'UK' || value === 'US';
}
export function regionFromCountry(country?: string | null): Region | undefined {
  if (!country) return undefined;
  if (country.toUpperCase() === 'GB') return 'UK';
  if (country.toUpperCase() === 'US') return 'US';
  if ('AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE IS LI NO CH'.split(' ').includes(country.toUpperCase())) return 'EU';
  return undefined;
}

function createRegionStore() {
  let active = $state<Region>('EU');
  let initialized = false;
  function persist() {
    try { localStorage.setItem('hotas_region', active); } catch { /* Storage can be disabled. */ }
    document.cookie = `hotas_region=${active}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }
  return {
    get region() { return active; },
    get currency() { return REGION_CURRENCIES[active]; },
    setRegion(region: Region) {
      if (!isRegion(region) || typeof window === 'undefined') return;
      active = region;
      persist();
    },
    /** Call from onMount. Never mutate the module singleton during SSR. */
    init(hint?: Region) {
      if (initialized || typeof window === 'undefined') return;
      initialized = true;
      let saved: string | null = null;
      try { saved = localStorage.getItem('hotas_region'); } catch { /* Cookie fallback. */ }
      const cookie = document.cookie.split('; ').find((part) => part.startsWith('hotas_region='))?.split('=')[1];
      const localeCountry = navigator.language.match(/[-_]([a-z]{2})$/i)?.[1];
      active = isRegion(saved) ? saved : isRegion(cookie) ? cookie : hint ?? regionFromCountry(localeCountry) ?? 'EU';
      persist();
      window.addEventListener('storage', (event) => {
        if (event.key === 'hotas_region' && isRegion(event.newValue)) {
          active = event.newValue;
          persist();
        }
      });
    },
  };
}
export const regionStore = createRegionStore();
