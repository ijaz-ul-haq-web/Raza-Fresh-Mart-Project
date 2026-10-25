import { prisma } from '@/lib/prisma';
import CategoryManager from '@/components/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function Categories() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <h1 className="font-bold">کیٹیگریز</h1>
      <CategoryManager categories={categories} />
    </>
  );
}
