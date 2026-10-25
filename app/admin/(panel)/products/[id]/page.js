import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductForm from '@/components/ProductForm';

export const dynamic = 'force-dynamic';

export default async function EditProduct({ params }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: Number(params.id) } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);
  if (!product) notFound();
  const p = { id: product.id, name: product.name, price: product.price, unit: product.unit, image: product.image, inStock: product.inStock, categoryId: product.categoryId };
  return (
    <>
      <h1 className="font-bold">سامان ایڈٹ</h1>
      <ProductForm categories={categories} product={p} />
    </>
  );
}
