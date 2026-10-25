import { describe, expect, it } from 'vitest';
import { feedRequest, parseFeed, updatePriceText } from './price-feeds';

describe('feedRequest', () => {
  it('maps each supported store URL to its machine-readable endpoint', () => {
    expect(feedRequest('https://vkbsimcontrollers.com/products/blackbox-mk3-us')).toMatchObject({ kind: 'shopify', url: 'https://vkbsimcontrollers.com/products/blackbox-mk3-us.json' });
    expect(feedRequest('https://flightsimcontrols.co.uk/product/gladiator-nxt-evo-base-only/')).toMatchObject({ kind: 'woocommerce', url: 'https://flightsimcontrols.co.uk/wp-json/wc/store/v1/products?slug=gladiator-nxt-evo-base-only' });
    expect(feedRequest('https://uk.winctrl.com/p/335.html')?.url).toBe('https://uk.winctrl.com/home/shop/get?id=335');
    expect(feedRequest('https://us.winwingsim.com/view/goods-details.html?id=1585')?.url).toBe('https://winctrl.com/home/shop/get?id=1585');
    expect(feedRequest('https://winctrl.com/view/goods-details.html?id=6485&sku_id=4981')?.url).toBe('https://winctrl.com/home/shop/get?id=6485&sku_id=4981');
    const magento = feedRequest('https://virpil-controls.eu/cdt-aeromax-r-flightstick.html');
    expect(magento).toMatchObject({ kind: 'magento', method: 'GET' });
    expect(decodeURIComponent(magento!.url)).toContain('https://virpil-controls.eu/graphql?query={products(filter:{url_key:{eq:"cdt-aeromax-r-flightstick"}})');
  });
  it('ignores stores and URL shapes it does not understand', () => {
    expect(feedRequest('https://tweakers.net/pricewatch/1904256/x.html')).toBeNull();
    expect(feedRequest('https://flightsimcontrols.com/shop/')).toBeNull();
    expect(feedRequest('not a url')).toBeNull();
  });
});

describe('parseFeed', () => {
  const req = (url: string) => feedRequest(url)!;
  it('reads Shopify prices and refuses to guess between differently priced variants', () => {
    const r = req('https://vkbsimcontrollers.com/products/x');
    expect(parseFeed(r, { product: { variants: [{ id: 1, price: '119.00', available: true }] } })).toEqual({ ok: true, amount: 119, inStock: true });
    expect(parseFeed(r, { product: { variants: [{ id: 1, price: '119.00' }, { id: 2, price: '139.00' }] } })).toMatchObject({ ok: false, ambiguous: true });
    expect(parseFeed(req('https://vkbsimcontrollers.com/products/x?variant=2'), { product: { variants: [{ id: 1, price: '119.00' }, { id: 2, price: '139.00' }] } })).toMatchObject({ ok: true, amount: 139 });
  });
  it('reads WooCommerce minor units and flags price ranges', () => {
    const r = req('https://flightsimcontrols.com/product/x/');
    expect(parseFeed(r, [{ is_in_stock: true, prices: { price: '20900', currency_code: 'EUR', currency_minor_unit: 2 } }])).toEqual({ ok: true, amount: 209, currency: 'EUR', inStock: true });
    expect(parseFeed(r, [{ prices: { price: '16100', currency_code: 'EUR', currency_minor_unit: 2, price_range: { min_amount: '16100', max_amount: '20100' } } }])).toMatchObject({ ok: false, ambiguous: true });
    expect(parseFeed(r, [])).toMatchObject({ ok: false, reason: 'product slug not found' });
  });
  it('reads the WINCTRL shop API and checks the requested SKU came back', () => {
    expect(parseFeed(req('https://eu.winctrl.com/view/goods-details.html?id=6485'), { data: { price: '229.28', total_stock: 4, now_sku: { id: 4961 } } })).toEqual({ ok: true, amount: 229.28, inStock: true });
    expect(parseFeed(req('https://eu.winctrl.com/view/goods-details.html?id=6485&sku_id=4981'), { data: { price: '229.28', now_sku: { id: 4961 } } })).toMatchObject({ ok: false });
  });
  it('reads Magento GraphQL final prices', () => {
    const body = (min: number, max = min) => ({ data: { products: { items: [{ stock_status: 'IN_STOCK', price_range: { minimum_price: { final_price: { value: min, currency: 'EUR' } }, maximum_price: { final_price: { value: max, currency: 'EUR' } } } }] } } });
    const r = req('https://virpil-controls.eu/x.html');
    expect(parseFeed(r, body(199.95))).toEqual({ ok: true, amount: 199.95, currency: 'EUR', inStock: true });
    expect(parseFeed(r, body(100, 120))).toMatchObject({ ok: false, ambiguous: true });
    expect(parseFeed(r, { data: { products: { items: [] } } })).toMatchObject({ ok: false, reason: 'product not found' });
  });
});

describe('updatePriceText', () => {
  const yaml = [
    'name: Test',
    'prices:',
    '- region: EU',
    '  currency: EUR',
    '  amount: 278.67',
    '  incl_vat: true',
    '  store: eu.winctrl.com',
    '  url: https://eu.winctrl.com/p/1.html',
    "  verified: '2026-10-21'",
    '  source: manual',
    '- region: UK',
    '  currency: GBP',
    '  amount: 298.98',
    '  url: https://uk.winctrl.com/p/1.html',
    "  verified: '2026-10-21'",
    'verification: draft',
  ].join('\n');
  it('rewrites only the matching entry and keeps everything else byte-for-byte', () => {
    const out = updatePriceText(yaml, 'UK', 'https://uk.winctrl.com/p/1.html', 246, '2026-10-24')!;
    expect(out.split('\n').slice(0, 10)).toEqual(yaml.split('\n').slice(0, 10));
    expect(out).toContain("  amount: 246\n  url: https://uk.winctrl.com/p/1.html\n  verified: '2026-10-24'\n  source: feed\nverification: draft");
  });
  it('handles indented lists and returns null when the entry is missing', () => {
    const indented = yaml.replaceAll(/^(- |  )/gm, '  $1');
    expect(updatePriceText(indented, 'EU', 'https://eu.winctrl.com/p/1.html', 229.28, '2026-10-24')).toContain('    amount: 229.28');
    expect(updatePriceText(yaml, 'US', 'https://eu.winctrl.com/p/1.html', 1, '2026-10-24')).toBeNull();
  });
});
