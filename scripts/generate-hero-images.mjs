// Pre-renders the homepage hero into fixed responsive WebP files at build
// time, served as static files from /public/hero. The hero used to go
// through astro:assets' <Image>, which on this SSR site (output: 'server')
// optimizes on every request via the /_image endpoint instead of at build
// time — each first hit paid the full sharp resize cost (~800ms) with no
// disk cache surviving between serverless invocations on Vercel.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const SOURCE = 'src/assets/hero-poster.webp';
const OUT_DIR = 'public/hero';
const WIDTHS = [480, 768, 1080, 1440, 1920];
const QUALITY = 65;

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

await Promise.all(
  WIDTHS.map((width) =>
    sharp(SOURCE)
      .resize({ width })
      .webp({ quality: QUALITY })
      .toFile(`${OUT_DIR}/hero-${width}.webp`)
  )
);

console.log(`generated ${WIDTHS.length} hero images in ${OUT_DIR}`);
