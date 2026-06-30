import type { APIRoute } from 'astro';
import { verifyLogin } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const token = verifyLogin(body.password);
  if (!token) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
  }
  cookies.set('admin_token', token, { path: '/', httpOnly: true, maxAge: 86400 });
  return new Response(JSON.stringify({ ok: true }));
};
