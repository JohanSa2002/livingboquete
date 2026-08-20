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

const LEAD_TYPES = ['propietario', 'alquiler', 'guide'] as const;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const {
    nombre, email, celular, pais, retiro, timeline, interes, type, tipo_propiedad, ubicacion, mensaje,
    rental_id, rental_name, move_in, duracion, personas, mascotas,
  } = body;
  // Rental-request leads (from the PDP's 3-step flow) allow either email or
  // WhatsApp — the guide/owner forms still require an email address.
  const normalizedType = LEAD_TYPES.includes(type) ? type : 'guide';
  if (!nombre || (normalizedType === 'alquiler' ? !email && !celular : !email)) {
    return new Response(JSON.stringify({ error: 'nombre and (email or celular) required' }), { status: 400 });
  }
  const { data, error } = await getSupabase()
    .from('leads')
    .insert({
      nombre,
      email: email || null,
      celular: celular || null,
      pais: pais || null,
      retiro: retiro || null,
      timeline: timeline || null,
      interes: interes || null,
      type: normalizedType,
      tipo_propiedad: tipo_propiedad || null,
      ubicacion: ubicacion || null,
      mensaje: mensaje || null,
      rental_id: rental_id || null,
      rental_name: rental_name || null,
      move_in: move_in || null,
      duracion: duracion || null,
      personas: personas ? Number(personas) : null,
      mascotas: typeof mascotas === 'boolean' ? mascotas : null,
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
