'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CategoryManager({ categories }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [err, setErr] = useState('');

  async function add(e) {
    e.preventDefault();
    const r = await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) });
    if (!r.ok) return setErr((await r.json()).error);
    setName(''); setErr(''); router.refresh();
  }
  async function del(id) {
    const r = await fetch('/api/admin/categories/' + id, { method: 'DELETE' });
    if (!r.ok) return setErr((await r.json()).error);
    setErr(''); router.refresh();
  }

  return (
    <div className="space-y-2">
      <form onSubmit={add} className="flex gap-2">
        <input className="input" placeholder="نئی کیٹیگری" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn">شامل</button>
      </form>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      {categories.map((c) => (
        <div key={c.id} className="bg-white rounded-lg p-2 flex justify-between items-center text-sm">
          <span>{c.name} <span className="text-xs text-stone-400">({c._count.products})</span></span>
          <button className="btn-light text-red-700" onClick={() => del(c.id)}>حذف</button>
        </div>
      ))}
    </div>
  );
}
