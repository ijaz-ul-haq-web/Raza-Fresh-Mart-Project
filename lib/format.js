export const UNITS = { kg: 'کلو', dozen: 'درجن', piece: 'عدد', litre: 'لیٹر', packet: 'پیکٹ' };
export const STATUS = {
  NEW: 'نیا',
  PACKED: 'پیک ہو گیا',
  OUT: 'راستے میں',
  DELIVERED: 'پہنچ گیا',
  CANCELLED: 'منسوخ',
};

export const rs = (n) => 'Rs ' + Number(n).toLocaleString('en-US');
export const stepFor = (unit) => (unit === 'kg' ? 0.5 : 1);
export const waNumber = (phone) => String(phone).replace(/^0/, '92');
export const mapsLink = (address) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(address + ' Peshawar');
