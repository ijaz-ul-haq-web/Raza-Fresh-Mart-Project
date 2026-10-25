'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { UNITS } from '@/lib/format';

function Row({ p }) {
  const [price, setPrice] = useState(p.price);
  const [inStock, setInStock] = useState(p.inStock);
  const [msg, setMsg] = useState('');
  const saved = useRef(p.price);

  async function save(data) {
    setMsg('...');
    const r = await fetch('/api/admin/products/' + p.id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setMsg(r.ok ? '✓' : '✗');
    setTimeout(() => setMsg(''), 1500);
    return r.ok;
  }
  async function savePrice() {
    const n = Math.round(Number(price));
    if (!(n >= 0) || n === saved.current) return;
    if (await save({ price: n })) saved.current = n;
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-2">
      <Link href={`/admin/products/${p.id}`} className="flex-1 text-sm">
        {p.name} <span className="text-xs text-stone-400">/ {UNITS[p.unit]}</span>
      </Link>
      <input
        type="number" inputMode="numeric" dir="ltr"
        className="w-20 rounded border border-stone-300 px-2 py-1 text-sm text-center"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        onBlur={savePrice}
        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
      />
      <button
        className={'rounded px-2 py-1 text-xs font-bold ' + (inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700')}
        onClick={() => { const v = !inStock; setInStock(v); save({ inStock: v }); }}
      >
        {inStock ? 'موجود' : 'ختم'}
      </button>
      <span className="w-4 text-xs">{msg}</span>
    </div>
  );
}

export default function PriceList({ products }) {
  const [q, setQ] = useState('');
  const shown = products.filter((p) => p.name.includes(q.trim()));
  return (
    <div className="space-y-2">
      <input className="input" placeholder="سامان تلاش کریں..." value={q} onChange={(e) => setQ(e.target.value)} />
      {shown.map((p) => <Row key={p.id} p={p} />)}
      {shown.length === 0 && <p className="text-center text-stone-500 py-6">کچھ نہیں ملا</p>}
    </div>
  );
}
