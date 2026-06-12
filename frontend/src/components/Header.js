'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/utils/store';

export default function Header() {
  const cart = useStore((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          SamirShop
        </Link>

        <div className="hidden md:flex gap-8">
          <Link href="/" className="hover:text-blue-600">
            خانه
          </Link>
          <Link href="/products" className="hover:text-blue-600">
            محصولات
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            درباره ما
          </Link>
          <Link href="/contact" className="hover:text-blue-600">
            تماس با ما
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/cart" className="relative">
            <div className="text-2xl">🛒</div>
            {cartTotal > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartTotal}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 p-4 space-y-2">
          <Link href="/" className="block py-2 hover:text-blue-600">
            خانه
          </Link>
          <Link href="/products" className="block py-2 hover:text-blue-600">
            محصولات
          </Link>
          <Link href="/about" className="block py-2 hover:text-blue-600">
            درباره ما
          </Link>
          <Link href="/contact" className="block py-2 hover:text-blue-600">
            تماس با ما
          </Link>
        </div>
      )}
    </header>
  );
}