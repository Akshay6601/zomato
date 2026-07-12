'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiShoppingBag, FiArrowRight } from 'react-icons/fi';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'N/A';

  return (
    <div className="min-h-screen pb-16 bg-neutral-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 text-center select-none"
        >
          {/* Animated checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
            className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100"
          >
            <FiCheckCircle className="w-10 h-10" />
          </motion.div>

          <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
            Thank you for ordering with us. Your meal is being prepared and will be delivered shortly.
          </p>

          {/* Order Details box */}
          <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 mb-8 text-left space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <span>ORDER ID</span>
              <span className="font-mono text-neutral-800">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <span>STATUS</span>
              <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-md text-[10px]">
                COMPLETED
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
              <span>PAYMENT</span>
              <span className="text-neutral-800">Simulated Success</span>
            </div>
          </div>

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/profile#orders"
              className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <FiShoppingBag className="w-4 h-4" />
              View Orders
            </Link>
            <Link
              href="/"
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-100 transition-all"
            >
              Order More
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
