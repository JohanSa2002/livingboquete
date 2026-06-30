import type { APIRoute } from 'astro';
import { getDb, initDb } from '../../../lib/db';
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
  initDb();
  const db = getDb();
  const rows = db.prepare(`SELECT * FROM ${table} ORDER BY created_at DESC`).all() as any[];
  const items = rows.map(r => ({ ...JSON.parse(r.data), _created: r.created_at, _updated: r.updated_at }));
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
  initDb();
  const db = getDb();
  const body = await request.json();
  if (!body.id) {
    return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  }
  db.prepare(`INSERT OR REPLACE INTO ${table} (id, data, updated_at) VALUES (?, ?, datetime('now'))`).run(body.id, JSON.stringify(body));
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
  initDb();
  const db = getDb();
  const { id } = await request.json();
  db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return new Response(JSON.stringify({ ok: true }));
};
