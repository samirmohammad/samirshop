'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">SamirShop</h3>
            <p className="text-gray-400">
              بهترین فروشگاه آنلاین برای خریدن پوشاک با کیفیت
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">فروشگاه</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products">محصولات</Link>
              </li>
              <li>
                <Link href="/products?category=mens">پوشاک مردانه</Link>
              </li>
              <li>
                <Link href="/products?category=womens">پوشاک زنانه</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">اطلاعات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about">درباره ما</Link>
              </li>
              <li>
                <Link href="/shipping">نحوه ارسال</Link>
              </li>
              <li>
                <Link href="/privacy">حریم خصوصی</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">تماس</h4>
            <ul className="space-y-2 text-gray-400">
              <li>☎️ 021-XXXXXXXX</li>
              <li>📧 info@samirshop.com</li>
              <li>📍 تهران، ایران</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 SamirShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}