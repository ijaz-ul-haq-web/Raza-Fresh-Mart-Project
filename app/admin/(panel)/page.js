import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import OrderCard from '@/components/OrderCard';
import { STATUS } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function Orders({ searchParams }) {
  const status = searchParams.status || 'NEW';
  const orders = await prisma.order.findMany({
    where: status === 'ALL' ? {} : { status },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  const tab = (active) => 'rounded-full px-3 py-1 text-sm ' + (active ? 'bg-green-700 text-white' : 'bg-white border');

  return (
    <>
      <div className="flex gap-2 overflow-x-auto">
        {Object.entries(STATUS).map(([k, v]) => <Link key={k} href={`/admin?status=${k}`} className={tab(status === k)}>{v}</Link>)}
        <Link href="/admin?status=ALL" className={tab(status === 'ALL')}>سب</Link>
      </div>
      {orders.length === 0 && <p className="text-center text-stone-500 py-10">کوئی آرڈر نہیں</p>}
      {orders.map((o) => <OrderCard key={o.id} o={o} />)}
    </>
  );
}
