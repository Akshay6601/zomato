'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={`p-4 rounded-xl shadow-lg border flex items-center justify-between pointer-events-auto ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-900'
                  : toast.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-900'
                  : 'bg-blue-50 text-blue-800 border-blue-100 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <FiCheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />}
                {toast.type === 'error' && <FiAlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />}
                {toast.type === 'info' && <FiInfo className="text-blue-500 w-5 h-5 flex-shrink-0" />}
                <p className="text-sm font-medium">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-4 cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
