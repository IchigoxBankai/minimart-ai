// MiniMart AI - Toast Notification System & Confetti triggers

import React, { createContext, useContext, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (type === 'success' || message.includes('🎉') || message.includes('✅')) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#1F6B4F', '#DCEBDD', '#F2A93B', '#16523C'],
        });
      } catch (e) {
        // Ignore confetti error if any
      }
    }

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#1F6B4F] flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#F2A93B] flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-[#1F6B4F] flex-shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-[#1F6B4F]/30 bg-white';
      case 'warning':
        return 'border-[#F2A93B]/40 bg-white';
      case 'error':
        return 'border-red-300 bg-white';
      default:
        return 'border-[#DCEBDD] bg-white';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-dropdown border ${getBorderColor(
              toast.type
            )} animate-slide-up transition-all`}
          >
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-[#1E2521] flex-1 leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#697A71] hover:text-[#1E2521] transition-colors p-0.5 rounded-lg"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
