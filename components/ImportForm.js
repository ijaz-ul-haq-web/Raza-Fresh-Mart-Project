'use client';
import { useState } from 'react';

export default function ImportForm() {
  const [text, setText] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    const r = await fetch('/api/admin/products/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    setRes(await r.json());
    setBusy(false);
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-stone-600">ہر لائن میں: نام, قیمت, یونٹ, کیٹیگری<br />مثال: <span dir="ltr">آلو, 90, kg, سبزی</span><br />یونٹ: kg / dozen / piece / litre / packet</p>
      <textarea dir="auto" rows={12} className="input font-mono" value={text} onChange={(e) => setText(e.target.value)} />
      <button disabled={busy} onClick={go} className="btn">{busy ? 'انتظار...' : 'درآمد کریں'}</button>
      {res && (
        <div className="bg-white rounded-lg p-3 text-sm">
          نئے: {res.created} • اپڈیٹ: {res.updated}
          {res.errors?.length > 0 && <ul className="text-red-600 mt-2">{res.errors.map((e) => <li key={e}>{e}</li>)}</ul>}
          {res.error && <p className="text-red-600">{res.error}</p>}
        </div>
      )}
    </div>
  );
}
