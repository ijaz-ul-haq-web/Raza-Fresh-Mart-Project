'use client';
import { useRouter } from 'next/navigation';
import { STATUS } from '@/lib/format';

const NEXT = { NEW: ['PACKED', 'CANCELLED'], PACKED: ['OUT', 'CANCELLED'], OUT: ['DELIVERED'], DELIVERED: [], CANCELLED: [] };

export default function StatusButtons({ id, status }) {
  const router = useRouter();
  async function go(s) {
    await fetch('/api/admin/orders/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: s }),
    });
    router.refresh();
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {(NEXT[status] || []).map((s) => (
        <button key={s} onClick={() => go(s)} className={s === 'CANCELLED' ? 'btn-light' : 'btn'}>
          {STATUS[s]}
        </button>
      ))}
    </div>
  );
}
