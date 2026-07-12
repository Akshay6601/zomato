'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showToast('Logged in successfully!', 'success');
    } else {
      showToast(result.error || 'Invalid credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-rose-50 to-neutral-100 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-neutral-100"
      >
        <div className="text-center mb-8">
          <span className="text-4xl font-extrabold italic text-rose-600 tracking-wider select-none">
            zomato
          </span>
          <h2 className="mt-4 text-2xl font-bold text-neutral-900">Welcome Back</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Log in to discover and order delicious food.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-100 hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
            {!loading && <FiArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
            Register now
          </Link>
        </p>

        {/* Demo Credentials hint */}
        <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-center">
          <p className="text-xs font-bold text-neutral-500 mb-1">DEMO ACCOUNT</p>
          <p className="text-xs text-neutral-600">
            Email: <code className="font-mono bg-neutral-200/60 px-1 py-0.5 rounded text-neutral-800">user@example.com</code>
          </p>
          <p className="text-xs text-neutral-600 mt-1">
            Password: <code className="font-mono bg-neutral-200/60 px-1 py-0.5 rounded text-neutral-800">Password123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
