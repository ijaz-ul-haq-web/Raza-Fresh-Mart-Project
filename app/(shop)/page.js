import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }) {
  const q = (searchParams.q || '').trim();
  const cat = Number(searchParams.cat) || null;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where: {
        ...(cat ? { categoryId: cat } : {}),
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      },
      orderBy: [{ inStock: 'desc' }, { name: 'asc' }],
    }),
  ]);

  const chip = (active) =>
    'whitespace-nowrap rounded-full px-4 py-1 text-sm ' +
    (active ? 'bg-green-700 text-white' : 'bg-white border border-stone-300');

  return (
    <div>
      <form action="/" className="flex gap-2 mb-3">
        <input name="q" defaultValue={q} placeholder="سامان تلاش کریں..." className="input" />
        {cat ? <input type="hidden" name="cat" value={cat} /> : null}
        <button className="btn">تلاش</button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        <Link href="/" className={chip(!cat)}>سب</Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/?cat=${c.id}`} className={chip(cat === c.id)}>{c.name}</Link>
        ))}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-sm mb-3">
        🚚 Rs 1,000 سے اوپر آرڈر پر ڈیلیوری مفت، ورنہ Rs 100
      </div>

      {products.length === 0 ? (
        <p className="text-center text-stone-500 py-10">کوئی سامان نہیں ملا</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} p={{ id: p.id, name: p.name, price: p.price, unit: p.unit, image: p.image, inStock: p.inStock }} />
          ))}
        </div>
      )}
    </div>
  );
}
