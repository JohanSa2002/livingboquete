import type { APIRoute } from 'astro';
import { getSupabase } from '../../lib/supabase';
import { isAuthenticated } from '../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { data: leads, error } = await getSupabase()
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(leads));
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { nombre, email, celular, pais, retiro, timeline, interes } = body;
  if (!nombre || !email) {
    return new Response(JSON.stringify({ error: 'nombre and email required' }), { status: 400 });
  }
  const { data, error } = await getSupabase()
    .from('leads')
    .insert({
      nombre,
      email,
      celular: celular || null,
      pais: pais || null,
      retiro: retiro || null,
      timeline: timeline || null,
      interes: interes || null,
    })
    .select('id')
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true, id: data.id }));
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }
  const { id } = await request.json();
  const { error } = await getSupabase().from('leads').delete().eq('id', id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true }));
};
