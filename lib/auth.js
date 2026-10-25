import crypto from 'crypto';
import { cookies } from 'next/headers';

const secret = () => process.env.SESSION_SECRET || 'dev-secret';
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('hex');

export function makeToken() {
  const v = String(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 din
  return v + '.' + sign(v);
}

export function verifyToken(token) {
  if (!token) return false;
  const [v, s] = token.split('.');
  if (!v || !s) return false;
  const good = sign(v);
  if (s.length !== good.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good))) return false;
  return Number(v) > Date.now();
}

export function isAdmin() {
  return verifyToken(cookies().get('admin')?.value);
}
