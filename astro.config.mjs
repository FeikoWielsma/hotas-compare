// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://hotas.razortek.nl',
  adapter: cloudflare(),
  integrations: [svelte(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
