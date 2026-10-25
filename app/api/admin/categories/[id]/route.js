import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

export async function DELETE(_req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: 'login chahiye' }, { status: 401 });
  const id = Number(params.id);
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return NextResponse.json({ error: `اس میں ${count} سامان ہے، پہلے وہ ہٹائیں` }, { status: 400 });
  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
