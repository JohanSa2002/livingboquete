import type { APIRoute } from 'astro';
import { getDb, initDb } from '../../lib/db';
import { isAuthenticated } from '../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  initDb();
  const db = getDb();
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all();
  return new Response(JSON.stringify(leads));
};

export const POST: APIRoute = async ({ request }) => {
  initDb();
  const db = getDb();
  const body = await request.json();
  const { nombre, email, celular, pais, retiro, timeline, interes } = body;
  if (!nombre || !email) {
    return new Response(JSON.stringify({ error: 'nombre and email required' }), { status: 400 });
  }
  const stmt = db.prepare('INSERT INTO leads (nombre, email, celular, pais, retiro, timeline, interes) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const result = stmt.run(nombre, email, celular || null, pais || null, retiro || null, timeline || null, interes || null);
  return new Response(JSON.stringify({ ok: true, id: result.lastInsertRowid }));
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  initDb();
  const db = getDb();
  const { id } = await request.json();
  db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  return new Response(JSON.stringify({ ok: true }));
};
