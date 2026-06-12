'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/utils/store';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      const data = await response.json();
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?${params}`
      );
      const data = await response.json();
      setProducts(data.data || []);
      setTotal(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">محصولات</h1>

        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">دسته‌بندی‌ها</h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setPage(1);
                  }}
                  className={`block w-full text-right px-4 py-2 rounded ${
                    !selectedCategory
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  تمام محصولات
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setPage(1);
                    }}
                    className={`block w-full text-right px-4 py-2 rounded ${
                      selectedCategory === category._id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {product.images && product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="mb-4">
                      {product.discountPrice ? (
                        <div className="flex gap-2">
                          <span className="text-blue-600 font-bold">
                            {product.discountPrice.toLocaleString('fa-IR')} تومان
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            {product.price.toLocaleString('fa-IR')} تومان
                          </span>
                        </div>
                      ) : (
                        <span className="text-blue-600 font-bold">
                          {product.price.toLocaleString('fa-IR')} تومان
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-center"
                      >
                        جزئیات
                      </Link>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        افزودن به سبد
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded ${
                    page === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}