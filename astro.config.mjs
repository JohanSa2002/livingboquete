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
  prefetch: { defaultStrategy: 'hover' },
  integrations: [react()],
  vite: {
    ssr: {
      // gsap ships ESM-only; bundle it so the Vercel serverless
      // runtime doesn't try to require() it as CommonJS.
      noExternal: ['gsap'],
    },
  },
});
