import type { Component } from './schema';

type Mountable = { category: string; mount?: Component['mount'] };

export type YokePart = 'handle' | 'base';

/**
 * A yoke handle is stored as `category: yoke` with a non-desk `mount.provides`: it has no gimbal
 * or USB of its own and only works on a base that accepts that standard. A desk-clamped yoke
 * (`provides: desk` or no mount) is a complete control.
 */
export function isYokeHandle(item: Mountable) {
  return item.category === 'yoke' && !!item.mount?.provides && item.mount.provides !== 'desk';
}

/** Mount standards that yoke handles plug into. */
export function yokeStandards(components: Iterable<Mountable>) {
  return new Set([...components].filter(isYokeHandle).map((item) => item.mount!.provides!));
}

/** A yoke base is a `category: base` component whose accepted mounts are all yoke-handle standards. */
export function isYokeBase(item: Mountable, standards: Set<string>) {
  const accepts = item.mount?.accepts ?? [];
  return item.category === 'base' && accepts.length > 0 && accepts.every((id) => standards.has(id));
}

export function yokePart(item: Mountable, standards: Set<string>): YokePart | null {
  return isYokeHandle(item) ? 'handle' : isYokeBase(item, standards) ? 'base' : null;
}

export const yokePartLabels: Record<YokePart, string> = { handle: 'Yoke handle', base: 'Yoke base' };
