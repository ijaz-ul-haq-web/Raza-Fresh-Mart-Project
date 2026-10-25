'use client';
import Link from 'next/link';
import { useCart } from './CartContext';

export default function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-10 bg-green-700 text-white shadow">
      <div className="max-w-3xl mx-auto flex items-center justify-between p-3">
        <Link href="/" className="font-bold text-lg">🥬 رضا فریش مارٹ</Link>
        <Link href="/cart" className="bg-white text-green-800 rounded-full px-4 py-1 text-sm font-bold">
          🛒 {count}
        </Link>
      </div>
    </header>
  );
}
