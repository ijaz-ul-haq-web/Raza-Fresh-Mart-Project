import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SHOP } from '@/lib/config';
import { STATUS, UNITS, rs } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function OrderDone({ params }) {
  const o = await prisma.order.findUnique({ where: { code: params.code }, include: { items: true } });
  if (!o) notFound();

  return (
    <div className="space-y-3">
      <div className="bg-green-100 text-green-900 rounded-lg p-4 text-center">
        <div className="text-3xl">✅</div>
        <div className="font-bold">شکریہ {o.customerName}! آپ کا آرڈر مل گیا</div>
        <div className="text-sm">آرڈر نمبر #{o.id} • حالت: {STATUS[o.status]}</div>
      </div>

      <div className="bg-white rounded-lg p-3 text-sm space-y-1">
        {o.items.map((i) => (
          <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{rs(Math.round(i.price * i.qty))}</span></div>
        ))}
        <div className="flex justify-between border-t pt-1"><span>ڈیلیوری</span><span>{o.deliveryFee === 0 ? 'مفت' : rs(o.deliveryFee)}</span></div>
        <div className="flex justify-between font-bold"><span>کل</span><span>{rs(o.total)}</span></div>
        <div className="text-stone-500">{o.paymentMethod === 'COD' ? 'کیش آن ڈیلیوری' : `ایزی پیسہ (${SHOP.easypaisa})`}</div>
        <div className="text-stone-500">پتہ: {o.address}</div>
      </div>

      <a
        className="btn block text-center"
        href={`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent('آرڈر نمبر #' + o.id + ' کے بارے میں پوچھنا ہے')}`}
      >
        واٹس ایپ پر دکاندار سے بات کریں
      </a>
      <Link href="/" className="block text-center text-sm text-green-700">← مزید خریداری</Link>
    </div>
  );
}
