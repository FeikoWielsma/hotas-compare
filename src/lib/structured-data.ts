import type { Bundle, Component } from './schema';

/** Keep regional offers separate: prices in different currencies cannot be aggregated. */
export function productJsonLd(product: Component | Bundle, brandName: string, url: URL, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url: url.href,
    brand: { '@type': 'Brand', name: brandName },
    description,
    category: product.category.replaceAll('_', ' '),
    ...(product.images.length ? { image: product.images.map(image => new URL(image.file, url).href) } : {}),
    ...(product.prices.length ? { offers: product.prices.map(price => ({
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: price.currency,
      url: price.url ?? url.href,
      seller: { '@type': 'Organization', name: price.store },
      eligibleRegion: price.region === 'UK' ? 'GB' : price.region,
    })) } : {}),
  };
}
