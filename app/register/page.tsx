'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      showToast('Account created successfully!', 'success');
    } else {
      showToast(result.error || 'Registration failed', 'error');
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
          <h2 className="mt-4 text-2xl font-bold text-neutral-900">Create an Account</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Sign up to get started and track your orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
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
            {loading ? 'Creating account...' : 'Sign Up'}
            {!loading && <FiArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-rose-600 hover:text-rose-700 transition-colors">
            Log in instead
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
