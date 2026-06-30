import jwt from 'jsonwebtoken';
import type { AstroCookies } from 'astro';

const SECRET = import.meta.env.ADMIN_SECRET || 'boquete-admin-2026';
const ADMIN_PASS = import.meta.env.ADMIN_PASS || 'admin123';

export function verifyLogin(password: string): string | null {
  if (password !== ADMIN_PASS) return null;
  return jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const token = cookies.get('admin_token')?.value;
  if (!token) return false;
  return verifyToken(token);
}
