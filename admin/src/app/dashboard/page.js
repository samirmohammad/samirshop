'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const secret = localStorage.getItem('adminSecret');

      if (!token || !secret) {
        router.push('/login');
        return;
      }

      // Verify token and fetch dashboard data
      const response = await api.get('/admin/dashboard', {
        headers: {
          'x-admin-secret': secret,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
        setRecentOrders(response.data.data.recentOrders || []);
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSecret');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminSecret');
    router.push('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">در حال بارگذاری...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">پنل مدیریت</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            خروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalProducts}
            </div>
            <p className="text-gray-600 mt-2">محصولات</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {stats.totalOrders}
            </div>
            <p className="text-gray-600 mt-2">سفارشات</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalRevenue.toLocaleString('fa-IR')}
            </div>
            <p className="text-gray-600 mt-2">درآمد کل</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <a
            href="/admin/products"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-center font-bold"
          >
            مدیریت محصولات
          </a>
          <a
            href="/admin/categories"
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-center font-bold"
          >
            مدیریت دسته‌بندی‌ها
          </a>
          <a
            href="/admin/orders"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg text-center font-bold"
          >
            مدیریت سفارشات
          </a>
          <a
            href="/admin/settings"
            className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-lg text-center font-bold"
          >
            تنظیمات
          </a>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">سفارشات اخیر</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    شماره سفارش
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    مشتری
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    مبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                    وضعیت
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-t">
                    <td className="px-6 py-3">{order.orderNumber}</td>
                    <td className="px-6 py-3">{order.user?.name}</td>
                    <td className="px-6 py-3">
                      {order.finalAmount.toLocaleString('fa-IR')} تومان
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}