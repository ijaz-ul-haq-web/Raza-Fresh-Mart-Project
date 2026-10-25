import './globals.css';
import { Noto_Naskh_Arabic } from 'next/font/google';

// Nastaliq chahiye to Noto_Nastaliq_Urdu use kar sakte hain (line-height zyada hoti hai)
const font = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '700'], display: 'swap' });

export const metadata = {
  title: 'رضا فریش مارٹ - آن لائن گروسری',
  description: 'پشاور میں گھر بیٹھے سبزی، پھل اور راشن آرڈر کریں',
};
export const viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="ur" dir="rtl">
      <body className={font.className + ' bg-stone-50 text-stone-800'}>{children}</body>
    </html>
  );
}
