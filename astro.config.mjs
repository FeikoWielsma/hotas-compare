// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [svelte(), keystatic()],
  vite: {
    plugins: [tailwindcss()]
  }
});
