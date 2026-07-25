import { defineMiddleware } from 'astro:middleware';

// Every page reads live from Supabase on each request, but Vercel's edge
// was caching the SSR HTML anyway (X-Vercel-Cache: HIT), so admin edits/
// deletes didn't show up on the public site until the cache expired.
//
// Forcing no-store on every response fixed that, but it also disables the
// browser's back/forward cache and any CDN caching for the public pages,
// making every navigation pay a full Supabase round-trip. Admin/API routes
// (where edits happen and freshness matters most) keep no-store; public
// pages get a short edge cache with stale-while-revalidate so admin changes
// still show up within ~30s without making every click a cold fetch.
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const isImage = context.url.pathname.startsWith('/_image');
  const isAdminOrApi = context.url.pathname.startsWith('/admin') || context.url.pathname.startsWith('/api');
  response.headers.set(
    'Cache-Control',
    isImage
      ? 'public, max-age=31536000, immutable'
      : isAdminOrApi ? 'no-store' : 'public, max-age=0, s-maxage=30, stale-while-revalidate=300',
  );
  return response;
});
