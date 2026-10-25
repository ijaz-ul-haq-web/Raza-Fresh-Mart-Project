'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/CartContext';
import { UNITS, rs, stepFor } from '@/lib/format';
import { deliveryFee, FREE_DELIVERY_ABOVE, SHOP } from '@/lib/config';

export default function CartPage() {
  const { items, setQty, clear, subtotal } = useCart();
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', address: '', paymentMethod: 'COD', txnId: '', note: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const fee = subtotal > 0 ? deliveryFee(subtotal) : 0;
  const total = subtotal + fee;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const phone = f.phone.replace(/[\s-]/g, '');
    if (!/^03\d{9}$/.test(phone)) return setErr('درست موبائل نمبر لکھیں (مثال: 03001234567)');
    setBusy(true);
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, phone, items: items.map((i) => ({ id: i.id, qty: i.qty })) }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return setErr(data.error || 'کچھ غلط ہو گیا، دوبارہ کوشش کریں');
    clear();
    router.push('/order/' + data.code);
  }

  if (items.length === 0)
    return (
      <div className="text-center py-16">
        <p className="mb-4">آپ کی ٹوکری خالی ہے</p>
        <Link href="/" className="btn">خریداری شروع کریں</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="font-bold text-lg">🛒 آپ کی ٹوکری</h1>

      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.id} className="bg-white rounded-lg p-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-bold text-sm">{i.name}</div>
              <div className="text-xs text-stone-500">{rs(i.price)} / {UNITS[i.unit]}</div>
            </div>
            <button type="button" className="btn-light" onClick={() => setQty(i.id, i.qty - stepFor(i.unit))}>−</button>
            <span className="text-sm w-14 text-center">{i.qty} {UNITS[i.unit]}</span>
            <button type="button" className="btn-light" onClick={() => setQty(i.id, i.qty + stepFor(i.unit))}>+</button>
            <div className="w-20 text-left text-sm font-bold">{rs(Math.round(i.price * i.qty))}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-3 text-sm space-y-1">
        <div className="flex justify-between"><span>سامان</span><span>{rs(subtotal)}</span></div>
        <div className="flex justify-between"><span>ڈیلیوری</span><span>{fee === 0 ? 'مفت' : rs(fee)}</span></div>
        <div className="flex justify-between font-bold border-t pt-1"><span>کل</span><span>{rs(total)}</span></div>
        {fee > 0 && (
          <p className="text-xs text-green-700">مزید {rs(FREE_DELIVERY_ABOVE - subtotal)} کا سامان لیں تو ڈیلیوری مفت!</p>
        )}
      </div>

      <div className="space-y-2">
        <input required className="input" placeholder="آپ کا نام" value={f.name} onChange={set('name')} />
        <input required className="input" inputMode="tel" placeholder="موبائل نمبر (03001234567)" value={f.phone} onChange={set('phone')} />
        <textarea required rows={3} className="input" placeholder="مکمل پتہ (علاقہ، گلی، مکان نمبر، قریبی نشانی)" value={f.address} onChange={set('address')} />
        <input className="input" placeholder="کوئی ہدایت (اختیاری)" value={f.note} onChange={set('note')} />
      </div>

      <div className="bg-white rounded-lg p-3 text-sm space-y-2">
        <div className="font-bold">ادائیگی</div>
        <label className="flex items-center gap-2">
          <input type="radio" checked={f.paymentMethod === 'COD'} onChange={() => setF({ ...f, paymentMethod: 'COD' })} />
          کیش آن ڈیلیوری
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={f.paymentMethod === 'EASYPAISA'} onChange={() => setF({ ...f, paymentMethod: 'EASYPAISA' })} />
          ایزی پیسہ
        </label>
        {f.paymentMethod === 'EASYPAISA' && (
          <div className="bg-green-50 rounded p-2">
            <p>رقم {rs(total)} اس نمبر پر بھیجیں: <b dir="ltr">{SHOP.easypaisa}</b></p>
            <input className="input mt-2" placeholder="ٹرانزیکشن آئی ڈی" value={f.txnId} onChange={set('txnId')} />
          </div>
        )}
      </div>

      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button disabled={busy} className="btn w-full py-3">{busy ? 'انتظار کریں...' : `آرڈر کریں (${rs(total)})`}</button>
    </form>
  );
}
