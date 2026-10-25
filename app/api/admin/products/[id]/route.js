import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

const deny = () => NextResponse.json({ error: 'login chahiye' }, { status: 401 });

export async function PATCH(req, { params }) {
  if (!isAdmin()) return deny();
  const b = await req.json();
  const data = {};
  if ('name' in b) data.name = String(b.name).trim();
  if ('price' in b) {
    const n = Math.round(Number(b.price));
    if (!(n >= 0)) return NextResponse.json({ error: 'قیمت غلط ہے' }, { status: 400 });
    data.price = n;
  }
  if ('unit' in b) data.unit = String(b.unit);
  if ('image' in b) data.image = b.image || null;
  if ('inStock' in b) data.inStock = Boolean(b.inStock);
  if ('categoryId' in b) data.categoryId = Number(b.categoryId);
  const p = await prisma.product.update({ where: { id: Number(params.id) }, data });
  return NextResponse.json(p);
}

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return deny();
  try {
    await prisma.product.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'یہ سامان پرانے آرڈرز میں ہے، حذف کرنے کی بجائے "ختم ہے" کر دیں' }, { status: 400 });
  }
}
