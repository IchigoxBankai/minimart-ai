// MiniMart AI - Cashier PIN Kiosk Lock Modal

import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, AlertCircle, Delete, KeyRound, Store } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';

export const CashierLockModal = ({ isOpen, onClose, onUnlocked }) => {
  const { verifyCashierPin, setIsCashierMode, profile } = useStore();
  const { showToast } = useToast();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleDigitClick = (digit) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(false);

      // Auto check when 4 digits reached
      if (nextPin.length === 4) {
        if (verifyCashierPin(nextPin)) {
          showToast('Owner PIN verified! Exited Cashier Mode ✨', 'success');
          setIsCashierMode(false);
          setPin('');
          if (onUnlocked) onUnlocked();
          onClose();
        } else {
          setError(true);
          showToast('Incorrect PIN. Default is 1234', 'error');
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2521]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#E6E2D8] overflow-hidden p-6 sm:p-8 animate-scale-in text-center">
        {/* Lock Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-[#F7F5EF] border border-[#DDD7C8] flex items-center justify-center mx-auto text-[#1F6B4F] shadow-inner mb-4">
          <Lock className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="font-display font-black text-xl text-[#1E2521]">
          Cashier Kiosk Locked
        </h3>
        <p className="text-xs text-[#697A71] mt-1 mb-6">
          Enter 4-digit Owner PIN to exit Cashier mode and access business analytics.
        </p>

        {/* PIN Dots Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  error
                    ? 'bg-rose-500 scale-110 animate-shake'
                    : isFilled
                    ? 'bg-[#1F6B4F] scale-125 ring-4 ring-[#1F6B4F]/20'
                    : 'bg-[#E3DFD5]'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-600 mb-4 flex items-center justify-center gap-1.5 animate-fade-in">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Invalid PIN. Try '1234' (default)</span>
          </p>
        )}

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigitClick(String(num))}
              className="w-full h-14 rounded-2xl bg-[#F7F5EF] hover:bg-[#EAE6DA] active:scale-95 text-[#1E2521] font-display font-bold text-xl flex items-center justify-center transition-all shadow-2xs border border-[#E6E2D8]"
            >
              {num}
            </button>
          ))}

          {/* Bottom row: Clear, 0, Backspace */}
          <button
            onClick={handleClear}
            className="w-full h-14 rounded-2xl bg-white hover:bg-[#F2EFE7] active:scale-95 text-xs font-bold text-[#697A71] flex items-center justify-center transition-all border border-[#E6E2D8]"
          >
            Clear
          </button>
          <button
            onClick={() => handleDigitClick('0')}
            className="w-full h-14 rounded-2xl bg-[#F7F5EF] hover:bg-[#EAE6DA] active:scale-95 text-[#1E2521] font-display font-bold text-xl flex items-center justify-center transition-all shadow-2xs border border-[#E6E2D8]"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            aria-label="Backspace"
            className="w-full h-14 rounded-2xl bg-white hover:bg-[#F2EFE7] active:scale-95 text-[#697A71] flex items-center justify-center transition-all border border-[#E6E2D8]"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Cancel / Keep Locked Button */}
        <button
          onClick={onClose}
          className="text-xs font-semibold text-[#8A9A90] hover:text-[#1E2521] transition-colors py-1"
        >
          Keep Locked (Continue as Cashier)
        </button>
      </div>
    </div>
  );
};
