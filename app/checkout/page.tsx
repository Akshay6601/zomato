'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { motion } from 'framer-motion';
import { FiMapPin, FiCreditCard, FiArrowRight, FiCheck } from 'react-icons/fi';

export default function CheckoutPage() {
  const { cartItems, loading, subtotal, tax, deliveryCharge, total, refreshCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!loading && cartItems.length === 0) {
      showToast('Your cart is empty', 'error');
      router.push('/');
    }
  }, [cartItems, loading]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast('Please enter your delivery address', 'error');
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryAddress: address,
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card Payment',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Order placed successfully!', 'success');
        // Clear local cart items context
        await refreshCart();
        // Redirect to success page
        router.push(`/checkout/success?orderId=${data.order.id}`);
      } else {
        showToast(data.error || 'Failed to place order', 'error');
      }
    } catch (err) {
      showToast('Network error, please try again.', 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-neutral-500">
            {loading ? 'Loading checkout...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-neutral-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Checkout Steps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Delivery Address */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-bold text-neutral-900">Delivery Address</h2>
              </div>

              <div className="relative">
                <textarea
                  required
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your complete flat/house details, building, street, and landmark..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                />
                <FiMapPin className="absolute left-4 top-4 text-neutral-400 w-5 h-5" />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-lg font-bold text-neutral-900">Payment Option</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Cash on Delivery */}
                <label className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <FiCheck className={`w-5 h-5 self-end mb-1 ${paymentMethod === 'cod' ? 'text-rose-500 opacity-100' : 'opacity-0'}`} />
                  <span className="font-bold text-neutral-950 text-sm">Cash on Delivery</span>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-1">Pay at your doorstep</span>
                </label>

                {/* UPI (Simulated) */}
                <label className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="sr-only"
                  />
                  <FiCheck className={`w-5 h-5 self-end mb-1 ${paymentMethod === 'upi' ? 'text-rose-500 opacity-100' : 'opacity-0'}`} />
                  <span className="font-bold text-neutral-950 text-sm">UPI (GPay / PhonePe)</span>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-1">Simulate UPI checkout</span>
                </label>

                {/* Card Payment (Simulated) */}
                <label className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-200 hover:bg-neutral-50'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <FiCheck className={`w-5 h-5 self-end mb-1 ${paymentMethod === 'card' ? 'text-rose-500 opacity-100' : 'opacity-0'}`} />
                  <FiCreditCard className="w-5 h-5 text-neutral-500 mb-1" />
                  <span className="font-bold text-neutral-950 text-sm">Credit / Debit Card</span>
                  <span className="text-[10px] text-neutral-400 font-semibold mt-1">Simulate card payment</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right side: Bill details & Checkout Summary */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-100 pb-3">
              Order Details
            </h3>

            {/* List of items */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm font-semibold">
                  <span className="text-neutral-600 truncate max-w-[150px]">
                    {item.foodItem.name} <span className="text-neutral-400">x{item.quantity}</span>
                  </span>
                  <span className="text-neutral-900 font-bold">
                    ₹{item.foodItem.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-neutral-100" />

            {/* Pricing details */}
            <div className="space-y-3.5 text-sm font-semibold text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-neutral-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes (5%)</span>
                <span className="text-neutral-800">₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-neutral-800 font-bold">
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
              <hr className="border-neutral-100" />
              <div className="flex justify-between text-base font-extrabold text-neutral-900">
                <span>Total to Pay</span>
                <span className="text-rose-600 text-lg">₹{total}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={placingOrder}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-100 hover:shadow-xl transition-all disabled:opacity-50"
            >
              {placingOrder ? 'Processing...' : 'Place Order'}
              {!placingOrder && <FiArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
