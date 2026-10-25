'use client';
import { useCart } from './CartContext';
import { UNITS, rs, stepFor } from '@/lib/format';

export default function ProductCard({ p }) {
  const { items, add, setQty } = useCart();
  const inCart = items.find((i) => i.id === p.id);
  const step = stepFor(p.unit);

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex flex-col">
      <div className="h-24 flex items-center justify-center bg-green-50 rounded-lg mb-2 overflow-hidden">
        {p.image ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" /> : <span className="text-4xl">🥬</span>}
      </div>
      <div className="font-bold">{p.name}</div>
      <div className="text-green-700 text-sm mb-2">{rs(p.price)} / {UNITS[p.unit] || p.unit}</div>
      {!p.inStock ? (
        <div className="text-center text-sm bg-stone-200 text-stone-500 rounded-lg py-1">ختم ہے</div>
      ) : inCart ? (
        <div className="flex items-center justify-between bg-green-50 rounded-lg p-1">
          <button className="btn-light" onClick={() => setQty(p.id, inCart.qty - step)}>−</button>
          <span className="font-bold text-sm">{inCart.qty} {UNITS[p.unit]}</span>
          <button className="btn-light" onClick={() => setQty(p.id, inCart.qty + step)}>+</button>
        </div>
      ) : (
        <button className="btn" onClick={() => add(p)}>شامل کریں</button>
      )}
    </div>
  );
}
