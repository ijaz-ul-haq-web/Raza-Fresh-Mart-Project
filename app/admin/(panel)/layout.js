import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

export default function PanelLayout({ children }) {
  if (!isAdmin()) redirect('/admin/login');
  const link = 'bg-white/10 rounded px-3 py-1';
  return (
    <div>
      <nav className="bg-stone-800 text-white text-sm">
        <div className="max-w-3xl mx-auto p-3 flex flex-wrap gap-2 items-center">
          <Link href="/admin" className={link}>آرڈرز</Link>
          <Link href="/admin/delivery" className={link}>ڈیلیوری لسٹ</Link>
          <Link href="/admin/products" className={link}>ریٹ / سامان</Link>
          <Link href="/admin/categories" className={link}>کیٹیگریز</Link>
          <Link href="/" className={link}>دکان</Link>
          <form action="/api/admin/logout" method="post" className="mr-auto">
            <button className={link}>لاگ آؤٹ</button>
          </form>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto p-3 space-y-3">{children}</main>
    </div>
  );
}
