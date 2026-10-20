// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const isDev = process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
  site: 'https://hotas.razortek.nl',
  adapter: isDev ? node({ mode: 'standalone' }) : cloudflare(),
  integrations: [react(), svelte(), keystatic(), sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
