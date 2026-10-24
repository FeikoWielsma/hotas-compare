import { products } from './content.ts';
import { resolvePrice } from '../src/lib/derive.ts';

const catalog = products();
const components = new Map(catalog.filter(p => p.collection === 'components').map(p => [p.id, p.data]));
let compared = 0;
let skipped = 0;
let above = 0;
let discounts = 0;

console.log('Bundle vs parts (VAT-estimated prices; excludes shipping, import costs, and compatibility extras).');
console.log('Large discount threshold: 20%. Missing regional prices or mixed currencies are skipped.');
for (const { file, data } of catalog) {
  if (!('components' in data)) continue;
  for (const region of ['EU', 'UK', 'US'] as const) {
    const bundle = resolvePrice(data.prices, region).price;
    if (!bundle) continue;
    const parts = data.components.map(id => resolvePrice(components.get(id)?.prices, region).price);
    if (parts.some(part => !part || part.currency !== bundle.currency)) {
      skipped++;
      continue;
    }
    const sum = Math.round(parts.reduce((total, part) => total + part!.amount, 0) * 100) / 100;
    const delta = Math.round((bundle.amount - sum) * 100) / 100;
    const percent = sum ? delta / sum * 100 : 0;
    compared++;
    if (delta > 0 || percent <= -20) {
      if (delta > 0) above++; else discounts++;
      console.log(`${file} [${region} ${bundle.currency}]: bundle ${bundle.amount.toFixed(2)}, parts ${sum.toFixed(2)}; ${delta > 0 ? 'ABOVE parts' : 'LARGE DISCOUNT'} ${Math.abs(delta).toFixed(2)} (${Math.abs(percent).toFixed(1)}%)`);
    }
  }
}
console.log(`Summary: ${compared} bundle/region comparisons; ${above} above parts; ${discounts} discounts >=20%; ${skipped} skipped.`);
