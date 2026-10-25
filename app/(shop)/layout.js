import { CartProvider } from '@/components/CartContext';
import Header from '@/components/Header';

export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <Header />
      <main className="max-w-3xl mx-auto p-3">{children}</main>
    </CartProvider>
  );
}
