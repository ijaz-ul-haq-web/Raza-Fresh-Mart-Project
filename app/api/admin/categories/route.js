import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'login chahiye' }, { status: 401 });
  const { name } = await req.json();
  const n = String(name || '').trim();
  if (!n) return NextResponse.json({ error: 'نام لکھیں' }, { status: 400 });
  try {
    return NextResponse.json(await prisma.category.create({ data: { name: n } }));
  } catch {
    return NextResponse.json({ error: 'یہ کیٹیگری پہلے سے موجود ہے' }, { status: 400 });
  }
}
