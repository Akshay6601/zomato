'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';
import { FiMail, FiCalendar, FiMapPin, FiCreditCard, FiShoppingBag, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrders(data.orders || []);
          }
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-neutral-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left panel: Profile Info Card */}
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-extrabold text-3xl border border-rose-200 mx-auto mb-4 select-none">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h2 className="font-extrabold text-xl text-neutral-900 truncate">{user?.name}</h2>
              <p className="text-xs text-neutral-400 font-semibold mt-1">Customer Profile</p>
            </div>

            <hr className="border-neutral-100" />

            <div className="space-y-4 text-sm font-semibold text-neutral-600">
              <div className="flex items-center gap-2.5">
                <FiMail className="text-neutral-400 w-4 h-4 flex-shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiCalendar className="text-neutral-400 w-4 h-4 flex-shrink-0" />
                <span>
                  {user?.createdAt
                    ? `Joined ${new Date(user.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                      })}`
                    : 'Member'}
                </span>
              </div>
            </div>

            <hr className="border-neutral-100" />

            <button
              onClick={logout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>

          {/* Right panel: Order History */}
          <div className="lg:col-span-3 space-y-6" id="orders">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h2 className="text-2xl font-extrabold text-neutral-900">Previous Orders</h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20 bg-white border border-neutral-100 rounded-3xl">
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-3xl">
                <div className="w-12 h-12 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                  <FiShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">No Orders Yet</h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-6">
                  You haven&apos;t placed any food orders yet. Start exploring restaurants around you!
                </p>
                <Link
                  href="/"
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer transition-colors inline-block"
                >
                  Order Food Now
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-xs space-y-5">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-100 pb-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={order.restaurant.logo}
                          alt={order.restaurant.name}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-100 shadow-xs flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-neutral-900 text-base">{order.restaurant.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                            {order.restaurant.cuisine}
                          </span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-neutral-400 font-bold block mb-1">ORDERED ON</span>
                        <span className="text-neutral-800 font-bold text-xs sm:text-sm">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Order items listing */}
                    <div className="space-y-3">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm font-semibold">
                          <div className="flex items-center gap-2">
                            <span className={`w-3.5 h-3.5 border flex items-center justify-center rounded-xs ${
                              item.foodItem.isVeg ? 'border-emerald-500' : 'border-rose-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.foodItem.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                              }`} />
                            </span>
                            <span className="text-neutral-700">
                              {item.foodItem.name} <span className="text-neutral-400">x{item.quantity}</span>
                            </span>
                          </div>
                          <span className="text-neutral-900 font-bold">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="border-neutral-100" />

                    {/* Order Footer summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1 text-sm font-semibold">
                      <div className="flex flex-wrap gap-4 text-xs text-neutral-500 font-bold">
                        <div className="flex items-center gap-1.5">
                          <FiMapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <span className="max-w-[200px] truncate">{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FiCreditCard className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                          <span>{order.paymentMethod}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-neutral-500 font-bold text-xs uppercase tracking-wide">
                          Paid: <span className="text-rose-600 font-extrabold text-base ml-1">₹{order.total}</span>
                        </span>
                        <span className={`font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 border select-none ${
                          order.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {order.status === 'COMPLETED' ? 'Completed' : order.status}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
