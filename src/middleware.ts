import { defineMiddleware } from 'astro:middleware';

// Every page reads live from Supabase on each request, but Vercel's edge
// was caching the SSR HTML anyway (X-Vercel-Cache: HIT), so admin edits/
// deletes didn't show up on the public site until the cache expired.
export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  response.headers.set('Cache-Control', 'no-store');
  return response;
});
