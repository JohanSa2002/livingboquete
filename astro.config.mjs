// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';

// Vercel sets its own env var during platform builds; falls back to the
// Node standalone adapter for local dev and the Docker image (see Dockerfile).
const adapter = process.env.VERCEL ? vercel() : node({ mode: 'standalone' });

export default defineConfig({
  output: 'server',
  adapter,
  // prefetchAll is required so every link gets the hover strategy — without it,
  // only links with an explicit data-astro-prefetch attribute are prefetched.
  prefetch: { defaultStrategy: 'hover', prefetchAll: true },
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
