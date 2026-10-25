import StatusButtons from './StatusButtons';
import { STATUS, UNITS, rs, waNumber, mapsLink } from '@/lib/format';

export default function OrderCard({ o, showMap = false }) {
  const time = new Date(o.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Karachi', hour12: true });
  const collect = o.paymentMethod === 'COD' ? `وصول کریں: ${rs(o.total)}` : 'ایزی پیسہ (ادا شدہ؟ چیک کریں)';
  return (
    <div className="bg-white rounded-lg p-3 text-sm space-y-1 shadow-sm">
      <div className="flex justify-between">
        <b>#{o.id} • {o.customerName}</b>
        <span className="text-xs bg-stone-100 rounded px-2">{STATUS[o.status]}</span>
      </div>
      <div className="text-xs text-stone-500">{time}</div>
      <div>📞 <a className="text-green-700" dir="ltr" href={`tel:${o.phone}`}>{o.phone}</a>{' '}
        <a className="text-green-700 text-xs" href={`https://wa.me/${waNumber(o.phone)}`}>واٹس ایپ</a></div>
      <div>📍 {o.address}
        {showMap && <> <a className="text-green-700 text-xs" target="_blank" href={mapsLink(o.address)}>نقشہ</a></>}
      </div>
      {o.note && <div className="text-amber-700">📝 {o.note}</div>}
      <ul className="list-disc pr-5">
        {o.items.map((i) => <li key={i.id}>{i.name} × {i.qty}</li>)}
      </ul>
      <div className="font-bold">{rs(o.total)} <span className="font-normal text-stone-500">({o.deliveryFee ? 'ڈیلیوری ' + rs(o.deliveryFee) : 'ڈیلیوری مفت'})</span></div>
      <div className="text-stone-600">{collect}{o.txnId ? ` • TID: ${o.txnId}` : ''}</div>
      <StatusButtons id={o.id} status={o.status} />
    </div>
  );
}
