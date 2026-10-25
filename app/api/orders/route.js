import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deliveryFee } from '@/lib/config';
import { notifyOwner } from '@/lib/whatsapp';
import { UNITS, rs } from '@/lib/format';

const bad = (msg) => NextResponse.json({ error: msg }, { status: 400 });

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return bad('درخواست درست نہیں'); }

  const name = String(b.name || '').trim();
  const phone = String(b.phone || '').replace(/[\s-]/g, '');
  const address = String(b.address || '').trim();
  if (name.length < 2 || !/^03\d{9}$/.test(phone) || address.length < 8) return bad('نام، موبائل نمبر اور مکمل پتہ ضروری ہے');

  const items = Array.isArray(b.items) ? b.items : [];
  if (items.length === 0 || items.length > 100) return bad('ٹوکری خالی ہے');

  // Price hamesha database se lo, customer ke bheje hue price par bharosa nahi
  const products = await prisma.product.findMany({ where: { id: { in: items.map((i) => Number(i.id)) } } });
  const map = new Map(products.map((p) => [p.id, p]));

  const lines = [];
  for (const i of items) {
    const p = map.get(Number(i.id));
    const qty = Number(i.qty);
    if (!p || !(qty > 0) || qty > 100) return bad('ٹوکری میں غلط چیز ہے');
    if (!p.inStock) return bad(`${p.name} ابھی دستیاب نہیں، اسے ٹوکری سے نکال دیں`);
    lines.push({ productId: p.id, name: p.name, qty, price: p.price });
  }

  const subtotal = Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0));
  const fee = deliveryFee(subtotal);
  const total = subtotal + fee;
  const pay = b.paymentMethod === 'EASYPAISA' ? 'EASYPAISA' : 'COD';

  const order = await prisma.order.create({
    data: {
      customerName: name,
      phone,
      address,
      note: String(b.note || '').trim() || null,
      subtotal,
      deliveryFee: fee,
      total,
      paymentMethod: pay,
      txnId: pay === 'EASYPAISA' ? String(b.txnId || '').trim() || null : null,
      items: { create: lines },
    },
  });

  const text =
    `🛒 نیا آرڈر #${order.id}\n${name} - ${phone}\n${address}\n\n` +
    lines.map((l) => `• ${l.name} × ${l.qty}`).join('\n') +
    `\n\nکل: ${rs(total)} (${pay === 'COD' ? 'کیش آن ڈیلیوری' : 'ایزی پیسہ'})`;
  await notifyOwner(text);

  return NextResponse.json({ code: order.code, id: order.id });
}
