// MiniMart AI - Reusable Responsive Modal Component (Desktop Center / Mobile Bottom Sheet)

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-white w-full ${maxWidth} rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E3DFD5] max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-slide-up`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-[#D2CCBC] rounded-full mx-auto mt-3 mb-1" />

        {/* Modal Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EFECE2]">
            <div>
              {title && (
                <h3 className="font-display font-bold text-lg text-[#1E2521] leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-[#697A71] mt-0.5">{subtitle}</p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#697A71] hover:text-[#1E2521] hover:bg-[#F2EFE7] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
