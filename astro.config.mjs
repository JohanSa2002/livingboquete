// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Vercel sets its own env var during platform builds; falls back to the
// Node standalone adapter for local dev and the Docker image (see Dockerfile).
const adapter = process.env.VERCEL ? vercel() : node({ mode: 'standalone' });

export default defineConfig({
  site: 'https://mikahomes.com',
  output: 'server',
  adapter,
  // prefetchAll is required so every link gets the tap strategy — without it,
  // only links with an explicit data-astro-prefetch attribute are prefetched.
  // 'tap' fires on mousedown/touchstart instead of hover, so it also covers
  // touch devices (no hover event at all) and fast desktop clicks that don't
  // dwell long enough for 'hover' to kick in.
  prefetch: { defaultStrategy: 'tap', prefetchAll: true },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
  ],
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
