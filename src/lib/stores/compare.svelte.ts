import { MAX_COMPARE_ITEMS } from '../compare-constants';
export { MAX_COMPARE_ITEMS } from '../compare-constants';
const STORAGE_KEY = 'hotas_compare';
function normalize(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string' && id.trim().length > 0).map((id) => id.trim()))].slice(0, MAX_COMPARE_ITEMS);
}

function createCompareStore() {
  let selected = $state<string[]>([]);
  let initialized = false;
  function readUrl(): string[] | undefined {
    const url = new URL(location.href);
    return url.searchParams.has('items') ? normalize((url.searchParams.get('items') ?? '').split(',')) : undefined;
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selected)); } catch { /* In-memory selection still works. */ }
    const url = new URL(location.href);
    // Catalog filters keep their own query string; compare URLs are shareable.
    if (/^\/compare\/?$/.test(url.pathname) || url.searchParams.has('items')) {
      if (selected.length) url.searchParams.set('items', selected.join(','));
      else url.searchParams.delete('items');
      history.replaceState(history.state, '', url);
    }
  }
  return {
    get items(): readonly string[] { return [...selected]; },
    get selectedIds(): readonly string[] { return [...selected]; },
    get href() { return `/compare?${new URLSearchParams({ items: selected.join(',') })}`; },
    init() {
      if (initialized || typeof window === 'undefined') return;
      initialized = true;
      let saved: unknown = [];
      try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { /* Ignore malformed storage. */ }
      selected = readUrl() ?? normalize(saved);
      persist();
      window.addEventListener('popstate', () => {
        selected = readUrl() ?? (/^\/compare\/?$/.test(location.pathname) ? [] : selected);
        persist();
      });
      window.addEventListener('storage', (event) => {
        if (event.key !== STORAGE_KEY) return;
        try { selected = normalize(JSON.parse(event.newValue ?? '[]')); } catch { selected = []; }
        persist();
      });
    },
    addItem(id: string): boolean {
      if (typeof window === 'undefined') return false;
      this.init();
      if (!id.trim() || selected.length >= MAX_COMPARE_ITEMS || selected.includes(id.trim())) return false;
      selected = [...selected, id.trim()]; persist(); return true;
    },
    removeItem(id: string) {
      if (typeof window === 'undefined') return;
      this.init(); selected = selected.filter((item) => item !== id); persist();
    },
    hasItem(id: string) { return selected.includes(id); },
    clear() {
      if (typeof window === 'undefined') return;
      this.init(); selected = []; persist();
    },
  };
}
export const compareStore = createCompareStore();
