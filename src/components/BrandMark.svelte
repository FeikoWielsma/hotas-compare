<script lang="ts">
  import { brandAssets } from '../lib/brand-assets';
  let { brand, name = '', size = 36 }: { brand: string; name?: string; size?: number } = $props();
  const initials: Record<string, string> = { honeycomb: 'HC', logitech: 'G', mfg: 'MFG', moza: 'M', slaw: 'SD', thrustmaster: 'TM', 'turtle-beach': 'TB', virpil: 'VPC', vkb: 'VKB', winctrl: 'W' };
  const asset = $derived(brandAssets[brand]);
  const letters = $derived(initials[brand] ?? (name || brand).slice(0, 2).toUpperCase());
</script>

<span class="brand-mark" class:official={!!asset} class:light-art={['moza', 'slaw', 'turtle-beach', 'vkb'].includes(brand)} style:width={`${size}px`} style:height={`${size}px`} style:padding={asset ? `${size * .12}px` : '0'} style:font-size={`${Math.max(9, size * (letters.length > 2 ? .24 : .34))}px`} aria-hidden="true">
  {#if asset}<img src={asset.src} alt="" width={size} height={size} loading="lazy" />{:else}<span>{letters}</span>{/if}
</span>

<style>
  .brand-mark { display: inline-flex; align-items: center; justify-content: center; flex: none; border: 1px solid var(--color-rule); background: var(--color-paper); color: var(--color-ink); position: relative; overflow: hidden; vertical-align: middle; font: 700 1rem/1 var(--font-sans); letter-spacing: -.045em; border-radius: 3px; }
  .brand-mark::after { content: ''; position: absolute; bottom: 0; left: 0; width: 38%; height: 2px; background: var(--color-accent); }
  .brand-mark.official { background: #fff; }
  .brand-mark.official.light-art { background: #192f43; }
  .brand-mark img { display: block; width: 100%; height: 100%; object-fit: contain; }
</style>
