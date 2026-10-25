import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import PriceList from '@/components/PriceList';

export const dynamic = 'force-dynamic';

export default async function Products() {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  return (
    <>
      <div className="flex gap-2 items-center">
        <h1 className="font-bold flex-1">ریٹ اپڈیٹ ({products.length})</h1>
        <Link href="/admin/products/new" className="btn">+ نیا</Link>
        <Link href="/admin/products/import" className="btn-light">درآمد</Link>
      </div>
      <p className="text-xs text-stone-500">قیمت بدل کر باہر ٹیپ کریں یا Enter دبائیں، خود محفوظ ہو جائے گی۔</p>
      <PriceList products={products.map((p) => ({ id: p.id, name: p.name, price: p.price, unit: p.unit, inStock: p.inStock }))} />
    </>
  );
}
