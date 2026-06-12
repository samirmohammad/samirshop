'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/utils/store';

export default function Home() {
  const products = useStore((state) => state.products);
  const setProducts = useStore((state) => state.setProducts);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?limit=6`
      );
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">خوش‌آمدید به SamirShop</h1>
          <p className="text-xl mb-8">بهترین پوشاک‌های مدرن با قیمت‌های مناسب</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold"
          >
            مشاهده محصولات
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">محصولات برگزیده</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product) => (
              <Link key={product._id} href={`/products/${product.slug}`}>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                      {product.stock > 0 ? (
                        <span className="text-green-600 text-sm">موجود</span>
                      ) : (
                        <span className="text-red-600 text-sm">ناموجود</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">چرا SamirShop؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-bold mb-2">ارسال سریع</h3>
              <p className="text-gray-600">ارسال رایگان برای سفارشات بالاتر از ۵۰۰ هزار تومان</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="font-bold mb-2">پرداخت امن</h3>
              <p className="text-gray-600">درگاه پرداخت بانک ملت با رمزگذاری SSL</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-bold mb-2">بازگ��ت ۳۰ روزه</h3>
              <p className="text-gray-600">اگر راضی نیستید، بازگشت بدون سوال</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}