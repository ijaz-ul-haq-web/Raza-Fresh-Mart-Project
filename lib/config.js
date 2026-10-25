export const SHOP = {
  name: 'رضا فریش مارٹ',
  whatsapp: process.env.NEXT_PUBLIC_SHOP_WHATSAPP || '923001234567',
  easypaisa: process.env.NEXT_PUBLIC_EASYPAISA || '0300-1234567',
};

export const FREE_DELIVERY_ABOVE = 1000; // is se upar delivery free
export const DELIVERY_FEE = 100;

export function deliveryFee(subtotal) {
  return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
}
