'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { stepFor } from '@/lib/format';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('cart') || '[]')); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem('cart', JSON.stringify(items));
  }, [items, ready]);

  const add = (p) =>
    setItems((list) =>
      list.some((i) => i.id === p.id)
        ? list.map((i) => (i.id === p.id ? { ...i, qty: i.qty + stepFor(i.unit) } : i))
        : [...list, { id: p.id, name: p.name, price: p.price, unit: p.unit, qty: stepFor(p.unit) }]
    );
  const setQty = (id, qty) =>
    setItems((list) => (qty <= 0 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty } : i))));
  const clear = () => setItems([]);
  const subtotal = Math.round(items.reduce((s, i) => s + i.price * i.qty, 0));

  return (
    <Ctx.Provider value={{ items, add, setQty, clear, subtotal, count: items.length, ready }}>
      {children}
    </Ctx.Provider>
  );
}
