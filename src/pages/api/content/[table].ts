import type { APIRoute } from 'astro';
import { getSupabase, invalidateCache } from '../../../lib/supabase';
import { isAuthenticated } from '../../../lib/auth';

const VALID_TABLES = ['places', 'events', 'posts', 'rentals', 'gallery'];

function validateTable(table: string): table is string {
  return VALID_TABLES.includes(table);
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { table } = params;
  if (!table || !validateTable(table)) {
    return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400 });
  }
  const { data: rows, error } = await getSupabase()
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const items = rows.map((r: any) => ({ ...r.data, _created: r.created_at, _updated: r.updated_at }));
  return new Response(JSON.stringify(items));
};

export const POST: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { table } = params;
  if (!table || !validateTable(table)) {
    return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400 });
  }
  const body = await request.json();
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  }
  const { error } = await getSupabase()
    .from(table)
    .upsert({ id: body.id, data: body, updated_at: new Date().toISOString() });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  invalidateCache(table);
  return new Response(JSON.stringify({ ok: true }));
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { table } = params;
  if (!table || !validateTable(table)) {
    return new Response(JSON.stringify({ error: 'Invalid table' }), { status: 400 });
  }
  const { id } = await request.json();
  const { error } = await getSupabase().from(table).delete().eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  invalidateCache(table);
  return new Response(JSON.stringify({ ok: true }));
};
