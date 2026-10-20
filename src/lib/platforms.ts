import type { PlatformCompatibility } from './schema';

export const platforms = [
  { key: 'pc', label: 'PC' },
  { key: 'xbox', label: 'Xbox' },
  { key: 'ps5', label: 'PS5' },
] as const;
export type Platform = typeof platforms[number]['key'];

export function platformSupport(compatibility: PlatformCompatibility | undefined, platform: Platform): string {
  const status = compatibility?.[platform];
  return status === 'supported' ? 'Supported' : status === 'unsupported' ? 'Not supported' : 'Unknown';
}
