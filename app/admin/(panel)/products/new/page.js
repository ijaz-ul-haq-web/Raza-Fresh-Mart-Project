import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  return (
    <>
      <h1 className="font-bold">نیا سامان</h1>
      {categories.length === 0 ? <p>پہلے کیٹیگری بنائیں</p> : <ProductForm categories={categories} />}
    </>
  );
}
