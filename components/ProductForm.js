'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UNITS } from '@/lib/format';

export default function ProductForm({ categories, product }) {
  const router = useRouter();
  const [f, setF] = useState({
    name: product?.name || '',
    price: product?.price ?? '',
    unit: product?.unit || 'kg',
    categoryId: product?.categoryId || categories[0]?.id || '',
    image: product?.image || '',
    inStock: product?.inStock ?? true,
  });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const r = await fetch(product ? '/api/admin/products/' + product.id : '/api/admin/products', {
      method: product ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    if (!r.ok) return setErr((await r.json()).error || 'محفوظ نہیں ہوا');
    router.push('/admin/products');
    router.refresh();
  }
  async function remove() {
    if (!confirm('واقعی حذف کریں؟')) return;
    const r = await fetch('/api/admin/products/' + product.id, { method: 'DELETE' });
    if (!r.ok) return setErr((await r.json()).error);
    router.push('/admin/products');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input required className="input" placeholder="نام" value={f.name} onChange={set('name')} />
      <input required type="number" className="input" placeholder="قیمت (روپے)" value={f.price} onChange={set('price')} />
      <select className="input" value={f.unit} onChange={set('unit')}>
        {Object.entries(UNITS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <select className="input" value={f.categoryId} onChange={set('categoryId')}>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="input" dir="ltr" placeholder="تصویر کا لنک (اختیاری)" value={f.image} onChange={set('image')} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.inStock} onChange={(e) => setF({ ...f, inStock: e.target.checked })} /> موجود ہے
      </label>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <div className="flex gap-2">
        <button className="btn">محفوظ کریں</button>
        {product && <button type="button" onClick={remove} className="btn-light text-red-700">حذف</button>}
      </div>
    </form>
  );
}
