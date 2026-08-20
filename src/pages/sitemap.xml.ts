import type { APIRoute } from 'astro';
import { getSupabase } from '../lib/supabase';
import { LOCALES } from '../lib/i18n';

// Static routes that exist regardless of catalog/blog content. `''` is the
// homepage (becomes just `/es`, `/en`).
const STATIC_PATHS = ['', '/alquiler', '/blog', '/publicar-propiedad', '/como-funciona'];

function urlEntry(loc: string, alternates: { hreflang: string; href: string }[]) {
  const links = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
    .join('\n');
  return `  <url>\n    <loc>${loc}</loc>\n${links}\n  </url>`;
}

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://www.mikahomes.com')).origin;

  const [{ data: rentalRows }, { data: postRows }] = await Promise.all([
    getSupabase().from('rentals').select('id'),
    getSupabase().from('posts').select('id'),
  ]);

  // Every entry is emitted once per locale, each pointing at its siblings via
  // xhtml:link alternates — the same relationship the <head> hreflang tags
  // declare per page, mirrored here per Google's sitemap i18n guidance.
  const paths = [
    ...STATIC_PATHS,
    ...(rentalRows ?? []).map((r: any) => `/alquiler/${r.id}`),
    ...(postRows ?? []).map((r: any) => `/blog/${r.id}`),
  ];

  const entries = paths.flatMap((path) => {
    const alternates = LOCALES.map((l) => ({ hreflang: l, href: `${base}/${l}${path}` }));
    alternates.push({ hreflang: 'x-default', href: `${base}/es${path}` });
    return LOCALES.map((l) => urlEntry(`${base}/${l}${path}`, alternates));
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
