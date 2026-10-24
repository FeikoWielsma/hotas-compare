import { describe, expect, it } from 'vitest';
import { classify, homepageRedirect } from '../../scripts/audit-links';

describe('link audit classification (offline)', () => {
  it('reports product redirects to localized homepages but preserves product queries', () => {
    expect(homepageRedirect('https://shop.test/products/stick', 'https://shop.test/en-us/')).toBe(true);
    expect(homepageRedirect('https://shop.test/', 'https://shop.test/en/')).toBe(false);
    expect(homepageRedirect('https://shop.test/detail?id=1', 'https://shop.test/detail?id=2')).toBe(false);
  });
  it('separates broken links, bot blocks, and JS storefronts', () => {
    expect(classify('https://shop.test/a', 'https://shop.test/a', 404).status).toBe('broken');
    expect(classify('https://virpil-controls.co.uk/a', 'https://virpil-controls.co.uk/a', 403).status).toBe('unverifiable');
    expect(classify('https://eu.winctrl.com/a', 'https://eu.winctrl.com/a', 200).status).toBe('unverifiable');
    expect(classify('https://shop.test/a', 'https://shop.test/a', 200).status).toBe('ok');
  });
});
