import type { Metadata } from 'next';
import { Baloo_2, Nunito } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';
import BottomCartBar from '@/components/BottomCartBar';

const baloo = Baloo_2({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Veer Ji Malai Chaap Wale | Order Online - Noida',
  description:
    "Order Noida's finest Malai Chaap, Tandoori Chaap, Seekh Kebab and North Indian vegetarian delicacies online. Fresh, hot delivery in 30-35 mins.",
  keywords: 'malai chaap, tandoori chaap, veer ji, noida food delivery, soy chaap, vegetarian',
  openGraph: {
    title: 'Veer Ji Malai Chaap Wale',
    description: "Noida's finest Malai Chaap & North Indian Vegetarian Delicacies",
    images: ['https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=1200&q=80'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="font-body bg-white text-gray-900 antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <CartSidebar />
        <BottomCartBar />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1A1A1A',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 20px',
              fontFamily: 'var(--font-body)',
            },
            success: {
              iconTheme: { primary: '#FF6B35', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
