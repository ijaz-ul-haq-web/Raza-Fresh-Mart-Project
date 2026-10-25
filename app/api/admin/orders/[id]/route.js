import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { STATUS } from '@/lib/format';

export async function PATCH(req, { params }) {
  if (!isAdmin()) return NextResponse.json({ error: 'login chahiye' }, { status: 401 });
  const { status } = await req.json();
  if (!STATUS[status]) return NextResponse.json({ error: 'غلط حالت' }, { status: 400 });
  const o = await prisma.order.update({ where: { id: Number(params.id) }, data: { status } });
  return NextResponse.json(o);
}
