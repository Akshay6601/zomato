'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiShoppingBag, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="text-3xl font-extrabold italic text-rose-600 tracking-wider">zomato</div>
        <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </header>
  );
}

function NavbarContent() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery) {
        params.set('search', searchQuery);
      } else {
        params.delete('search');
      }
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 select-none">
          <span className="text-3xl font-extrabold italic text-rose-600 tracking-wider">zomato</span>
          <span className="text-[10px] bg-rose-100 text-rose-600 font-bold px-1.5 py-0.5 rounded ml-1">PREMIUM</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl relative">
          <input
            type="text"
            placeholder="Search for restaurant, cuisine or a dish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          />
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        </form>

        {/* Action Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-neutral-600 hover:text-rose-600 transition-colors">
            <FiShoppingCart className="w-6 h-6" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* User profile / Auth actions */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-neutral-700 hover:text-rose-600 transition-colors py-2 cursor-pointer focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-100">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm hidden sm:inline max-w-[120px] truncate">
                  {user.name}
                </span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white border border-neutral-100 rounded-xl shadow-xl z-20 py-1"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/profile#orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <FiShoppingBag className="w-4 h-4" />
                        Previous Orders
                      </Link>
                      <hr className="border-neutral-100 my-1" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer border-none bg-transparent"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-neutral-600 hover:text-rose-600 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-rose-600 text-white px-4 py-2.5 rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-100"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export const Navbar: React.FC = () => (
  <Suspense fallback={<NavbarFallback />}>
    <NavbarContent />
  </Suspense>
);

export default Navbar;
