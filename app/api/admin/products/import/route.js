import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';
import { UNITS } from '@/lib/format';

// Har line: نام, قیمت, یونٹ, کیٹیگری   (مثال: آلو, 90, kg, سبزی)
export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'login chahiye' }, { status: 401 });
  const { text } = await req.json();
  const urduToKey = Object.fromEntries(Object.entries(UNITS).map(([k, v]) => [v, k]));
  let created = 0, updated = 0;
  const errors = [];

  const lines = String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  for (const [n, line] of lines.entries()) {
    const [name, priceRaw, unitRaw = 'kg', catRaw] = line.split(',').map((s) => s.trim());
    const price = Math.round(Number(priceRaw));
    const unit = UNITS[unitRaw] ? unitRaw : urduToKey[unitRaw] || 'kg';
    if (!name || !(price >= 0) || !catRaw) { errors.push(`لائن ${n + 1}: ${line}`); continue; }
    const cat = await prisma.category.upsert({ where: { name: catRaw }, update: {}, create: { name: catRaw } });
    const existing = await prisma.product.findFirst({ where: { name, categoryId: cat.id } });
    if (existing) { await prisma.product.update({ where: { id: existing.id }, data: { price, unit } }); updated++; }
    else { await prisma.product.create({ data: { name, price, unit, categoryId: cat.id } }); created++; }
  }
  return NextResponse.json({ created, updated, errors });
}
