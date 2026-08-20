export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

// Only looks at the browser's top-priority language tag — good enough to
// pick between the two locales this site actually has without pulling in a
// full Accept-Language parser for a binary choice.
export function detectLocale(request: Request): Locale {
  const header = request.headers.get('accept-language') ?? '';
  const first = header.split(',')[0]?.trim().toLowerCase() ?? '';
  return first.startsWith('en') ? 'en' : DEFAULT_LOCALE;
}

// Swaps the locale segment of a pathname, preserving everything after it —
// used by the language toggle so switching languages keeps you on the same
// rental, blog post, or filtered /alquiler search.
export function swapLocale(pathname: string, target: Locale): string {
  return pathname.replace(/^\/(es|en)(?=\/|$)/, `/${target}`);
}
