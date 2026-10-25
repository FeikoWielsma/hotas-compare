import { readFileSync, writeFileSync } from 'node:fs';
import { parse, stringify } from 'yaml';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('../../scripts/content.ts', () => ({ products: vi.fn() }));
vi.mock('node:fs', async (original) => ({ ...await original<typeof import('node:fs')>(), readFileSync: vi.fn(), writeFileSync: vi.fn() }));
import { products } from '../../scripts/content.ts';

const argv = process.argv;
afterEach(() => { process.argv = argv; vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it('applies changed feed prices through the script, caps history, and leaves dry runs unwritten', async () => {
  const price = { region: 'US', currency: 'USD', amount: 100, verified: '2026-10-01', url: 'https://vkbsimcontrollers.com/products/test', store: 'VKB', history: Array.from({ length: 10 }, (_, amount) => ({ amount, verified: '2026-09-01' })) };
  vi.mocked(products).mockReturnValue([{ file: 'fixture.yaml', id: 'test', collection: 'components', data: { brand: 'vkb', prices: [price] } }] as ReturnType<typeof products>);
  vi.mocked(readFileSync).mockReturnValue(stringify({ prices: [price] }));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ product: { variants: [{ price: '110' }] } }) }));
  vi.spyOn(console, 'log').mockImplementation(() => {});
  process.argv = ['node', 'refresh-prices.ts'];
  await import('../../scripts/refresh-prices.ts');
  expect(writeFileSync).not.toHaveBeenCalled();
  vi.resetModules();
  process.argv = ['node', 'refresh-prices.ts', '--write'];
  await import('../../scripts/refresh-prices.ts');
  const output = parse(String(vi.mocked(writeFileSync).mock.calls[0][1])).prices[0];
  expect(output.amount).toBe(110);
  expect(output.source).toBe('feed');
  expect(output.verified).toBe(new Date().toISOString().slice(0, 10));
  expect(output.history).toEqual([...price.history.slice(1), { amount: 100, verified: price.verified }]);
});
