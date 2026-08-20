// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// Vercel sets its own env var during platform builds; falls back to the
// Node standalone adapter for local dev and the Docker image (see Dockerfile).
const adapter = process.env.VERCEL ? vercel() : node({ mode: 'standalone' });

export default defineConfig({
  site: 'https://www.mikahomes.com',
  output: 'server',
  adapter,
  // prefetchAll is required so every link gets the tap strategy — without it,
  // only links with an explicit data-astro-prefetch attribute are prefetched.
  // 'tap' fires on mousedown/touchstart instead of hover, so it also covers
  // touch devices (no hover event at all) and fast desktop clicks that don't
  // dwell long enough for 'hover' to kick in.
  prefetch: { defaultStrategy: 'tap', prefetchAll: true },
  // Astro's default ('auto') only inlines a page's CSS below ~4KB raw —
  // Layout.astro's and index.astro's stylesheets both exceed that, so they
  // were shipped as separate render-blocking <link> requests. 'always'
  // inlines all page styles into the HTML response instead, trading a bit
  // of per-navigation payload for removing those blocking round trips
  // entirely (Lighthouse "render-blocking requests").
  build: { inlineStylesheets: 'always' },
  // @astrojs/sitemap can't discover routes on a full-SSR site with
  // Supabase-driven dynamic pages (`[lang]/alquiler/[id]`, `[lang]/blog/[id]`)
  // — it only scans pages emitted at build time, and there are none here.
  // src/pages/sitemap.xml.ts replaces it with a real endpoint that queries
  // Supabase at request time instead.
  integrations: [react()],
  image: {
    // picsum.photos 302s to fastly.picsum.photos, and Astro checks the
    // post-redirect hostname against remotePatterns — both entries are needed.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.picsum.photos' },
    ],
  },
  vite: {
    ssr: {
      // gsap ships ESM-only; bundle it so the Vercel serverless
      // runtime doesn't try to require() it as CommonJS.
      noExternal: ['gsap'],
    },
  },
});
