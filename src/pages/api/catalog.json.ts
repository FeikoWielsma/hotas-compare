import type { APIRoute } from 'astro';
import { getCatalogItems } from '../../lib/catalog';

// Static index includes every region's prices. EU is the initial resolved view.
export const prerender = true;
export const GET: APIRoute = async () => new Response(JSON.stringify(await getCatalogItems()), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
