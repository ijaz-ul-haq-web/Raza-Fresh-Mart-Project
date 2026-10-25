import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'login chahiye' }, { status: 401 });
  const b = await req.json();
  const name = String(b.name || '').trim();
  const price = Math.round(Number(b.price));
  if (!name || !(price >= 0) || !Number(b.categoryId)) return NextResponse.json({ error: 'نام، قیمت اور کیٹیگری ضروری ہے' }, { status: 400 });
  const p = await prisma.product.create({
    data: { name, price, unit: b.unit || 'kg', image: b.image || null, inStock: b.inStock !== false, categoryId: Number(b.categoryId) },
  });
  return NextResponse.json(p);
}
