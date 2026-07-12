'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function CartPage() {
  const {
    cartItems,
    loading,
    subtotal,
    tax,
    deliveryCharge,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { showToast } = useToast();

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
      showToast('Cart cleared successfully', 'info');
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-neutral-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 mb-8">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl max-w-lg mx-auto">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Your Cart is Empty</h2>
            <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
              Add delicious meals from top restaurants in your area to get started!
            </p>
            <Link
              href="/"
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-md inline-block cursor-pointer transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-2">
                <span className="text-sm font-bold text-neutral-600">
                  Ordering from {cartItems[0].foodItem.restaurant.name}
                </span>
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Empty Cart
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-white border border-neutral-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span
                              className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                                item.foodItem.isVeg ? 'border-emerald-500' : 'border-rose-500'
                              }`}
                            >
                              <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    item.foodItem.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                />
                            </span>
                            <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                              {item.foodItem.name}
                            </h3>
                          </div>
                          <span className="text-xs font-bold text-neutral-500">
                            ₹{item.foodItem.price} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-2.5 py-1.5 bg-neutral-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer focus:outline-none border-none bg-transparent"
                          >
                            <FiMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-bold text-neutral-800 w-5 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer focus:outline-none border-none bg-transparent"
                          >
                            <FiPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price & Delete */}
                        <div className="text-right flex items-center gap-4">
                          <span className="font-extrabold text-neutral-900 text-sm sm:text-base">
                            ₹{item.foodItem.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-neutral-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition-all cursor-pointer border-none bg-transparent"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm sticky top-28 space-y-5">
              <h3 className="font-extrabold text-neutral-900 text-lg border-b border-neutral-100 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3.5 text-sm font-semibold text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-800">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST / Restaurant Taxes (5%)</span>
                  <span className="text-neutral-800">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-neutral-800 font-bold">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <hr className="border-neutral-100" />
                <div className="flex justify-between text-base font-extrabold text-neutral-900">
                  <span>Grand Total</span>
                  <span className="text-rose-600 text-lg">₹{total}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-100 transition-colors mt-4 text-center"
              >
                Proceed to Checkout
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
