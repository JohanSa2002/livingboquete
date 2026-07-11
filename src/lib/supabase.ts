import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }
    _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// Public pages pay a real ~200-300ms network round-trip to Supabase on every
// request (output: 'server' means nothing is pre-rendered). This in-memory
// cache lets repeat navigation within the TTL window skip that round-trip
// entirely, matching the freshness window already established by the
// CDN Cache-Control in middleware.ts. Admin routes never read through this —
// they call getSupabase() directly — so edits are always read/written live.
const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { data: unknown; expires: number }>();

export async function cachedQuery<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data as T;
  const data = await fn();
  cache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  return data;
}

// Called by the admin content API after a write so edits show up on the
// public site immediately instead of waiting out the TTL.
export function invalidateCache(prefix: string) {
  for (const key of cache.keys()) {
    if (key === prefix || key.startsWith(`${prefix}:`)) cache.delete(key);
  }
}
