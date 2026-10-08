// MiniMart AI - Keyboard Shortcuts Cheat Sheet Modal

import React from 'react';
import { Keyboard, X, Sparkles, Command, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HotkeysModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ K  /  Ctrl K', label: 'Omnibox Global Search & AI Query', category: 'Navigation' },
    { key: '?', label: 'Open Shortcuts Cheatsheet', category: 'Navigation' },
    { key: 'F2 / Space', label: 'Quick POS New Sale Cart', category: 'POS & Orders' },
    { key: 'B', label: 'Open Barcode Camera Scanner', category: 'POS & Orders' },
    { key: 'P', label: 'Print Thermal Receipt (58mm/80mm)', category: 'POS & Orders' },
    { key: 'Z', label: 'Cash Register Drawer & Day Closing', category: 'Cash Register' },
    { key: 'L', label: 'Lock POS Cashier Kiosk Mode', category: 'Security' },
    { key: 'Esc', label: 'Close Active Modal / Clear Search', category: 'General' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1E2521]/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-[#E6E2D8] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2D8] bg-[#FAF8F3]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1F6B4F]/10 border border-[#1F6B4F]/20 flex items-center justify-center text-[#1F6B4F]">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-[#1E2521]">
                Retail Keyboard Shortcuts
              </h3>
              <p className="text-xs text-[#697A71]">
                Speed up counter checkout and daily operations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A9A90] hover:text-[#1E2521] hover:bg-[#F0ECE1] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF8F3] border border-[#EAE6DA] text-xs hover:border-[#1F6B4F]/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1E2521]">{s.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EDE9DE] text-[#697A71] font-semibold">
                  {s.category}
                </span>
              </div>
              <kbd className="px-2.5 py-1 rounded-xl bg-white border border-[#DDD7C8] font-mono text-[11px] font-bold text-[#1F6B4F] shadow-2xs">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#FAF8F3] border-t border-[#E6E2D8] flex items-center justify-between text-xs text-[#697A71]">
          <span>Tip: Press <kbd className="font-mono font-bold text-[#1E2521]">?</kbd> anywhere to toggle this guide</span>
          <button
            onClick={onClose}
            className="btn-primary text-xs font-bold py-1.5 px-4"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
