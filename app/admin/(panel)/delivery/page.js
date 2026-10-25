import { prisma } from '@/lib/prisma';
import OrderCard from '@/components/OrderCard';

export const dynamic = 'force-dynamic';

// Delivery boys ke liye: sirf wo orders jo pack ho chuke ya raaste mein hain
export default async function Delivery() {
  const orders = await prisma.order.findMany({
    where: { status: { in: ['PACKED', 'OUT'] } },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  });
  return (
    <>
      <h1 className="font-bold">🚚 ڈیلیوری لسٹ ({orders.length})</h1>
      {orders.length === 0 && <p className="text-center text-stone-500 py-10">کوئی ڈیلیوری باقی نہیں</p>}
      {orders.map((o) => <OrderCard key={o.id} o={o} showMap />)}
    </>
  );
}
