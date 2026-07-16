import type { APIRoute } from 'astro';
import { getSupabase } from '../../lib/supabase';
import { isAuthenticated } from '../../lib/auth';

const BUCKET = 'images';
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isAuthenticated(cookies)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return new Response(JSON.stringify({ error: 'file required' }), { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return new Response(JSON.stringify({ error: 'Tipo de archivo no permitido' }), { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return new Response(JSON.stringify({ error: 'La imagen supera el límite de 8MB' }), { status: 400 });
  }

  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await getSupabase()
    .storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return new Response(JSON.stringify({ error: uploadError.message }), { status: 500 });
  }

  const { data } = getSupabase().storage.from(BUCKET).getPublicUrl(path);
  return new Response(JSON.stringify({ url: data.publicUrl }));
};
