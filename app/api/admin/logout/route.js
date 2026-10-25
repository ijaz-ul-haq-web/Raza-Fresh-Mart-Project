import { NextResponse } from 'next/server';

export async function POST(req) {
  const res = NextResponse.redirect(new URL('/admin/login', req.url), 303);
  res.cookies.delete('admin');
  return res;
}
