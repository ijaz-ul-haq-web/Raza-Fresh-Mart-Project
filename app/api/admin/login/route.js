import { NextResponse } from 'next/server';
import { makeToken } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: 'پاس ورڈ غلط ہے' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin', makeToken(), {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
