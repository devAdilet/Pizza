import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { CartSidebar } from '@/components/CartSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PIZZA.CO',
  description: 'High-performance pizza delivery application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F5F5F5] text-[#424242] min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <CartSidebar />
        </Providers>
      </body>
    </html>
  );
}
