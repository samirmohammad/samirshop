'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/utils/store';
import api from '@/utils/api';

export default function Cart() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total > 500000 ? 0 : 10000;
  const finalAmount = total + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('لطفاً تمام اطلاعات را پر کنید');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await api.post('/orders', {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: total,
        shippingCost: shipping,
        finalAmount,
        paymentMethod: 'bank_melli',
        user: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'Iran',
        },
      });

      if (orderRes.data.success) {
        const orderId = orderRes.data.data._id;

        // Create payment
        const paymentRes = await api.post('/payment/create-payment', {
          orderId,
          amount: finalAmount,
          returnUrl: `${window.location.origin}/payment-success`,
        });

        if (paymentRes.data.success) {
          clearCart();
          window.location.href = paymentRes.data.paymentUrl;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('خطا در ایجاد سفارش');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">سبد خریدتان خالی است</h1>
          <button
            onClick={() => router.push('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            بازگشت به محصولات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">سبد خریدتان</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="col-span-2 bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">محصولات</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border-b pb-4"
                >
                  {item.images && item.images[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.quantity} × {item.price.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-lg p-6 h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-6">پرداخت</h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckout();
              }}
              className="space-y-4 mb-6"
            >
              <input
                type="text"
                name="name"
                placeholder="نام کامل"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="ایمیل"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="شماره تماس"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="street"
                placeholder="خیابان"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="city"
                placeholder="شهر"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="کد پستی"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>جمع:</span>
                  <span>{total.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between">
                  <span>ارسال:</span>
                  <span>{shipping.toLocaleString('fa-IR')} تومان</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>جمع کل:</span>
                  <span>{finalAmount.toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg"
              >
                {loading ? 'در حال پردازش...' : 'پرداخت'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}