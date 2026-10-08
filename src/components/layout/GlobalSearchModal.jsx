// MiniMart AI - Global Omnibox Search Modal

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowRight, 
  X, 
  CornerDownLeft,
  Sparkles 
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const GlobalSearchModal = ({ isOpen, onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const { products, orders, customers, currency } = useStore();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelect('OPEN_SEARCH');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const filteredOrders = q
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.paymentMethod.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const filteredCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const hasResults =
    filteredProducts.length > 0 ||
    filteredOrders.length > 0 ||
    filteredCustomers.length > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-[#E3DFD5] w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EBE7DC] gap-3">
          <Search className="w-5 h-5 text-[#1F6B4F] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by SKU/name, orders by ID, or customers by phone/name..."
            className="w-full bg-transparent text-[#1E2521] text-base placeholder-[#8A9A90] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#697A71] hover:text-[#1E2521] rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-[#697A71] bg-[#F2EFE7] rounded border border-[#DDD7C8]">
            ESC
          </kbd>
        </div>

        {/* Search Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center text-[#697A71]">
              <Sparkles className="w-8 h-8 text-[#1F6B4F]/40 mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1E2521]">Quick Store Omnibox Search</p>
              <p className="text-xs text-[#8A9A90] mt-1">
                Type product names like "Coke", "Bread", SKU codes, order numbers, or customer names.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center text-[#697A71]">
              <p className="text-sm font-semibold text-[#1E2521]">No matching records found</p>
              <p className="text-xs text-[#8A9A90] mt-1">
                Try searching with a different keyword or SKU.
              </p>
            </div>
          ) : (
            <>
              {/* Products Section */}
              {filteredProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">
                    <Package className="w-3.5 h-3.5 text-[#1F6B4F]" />
                    <span>Products ({filteredProducts.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelect('products', p);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F3] border border-transparent hover:border-[#E8E4D9] transition-all text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-[#1E2521] group-hover:text-[#1F6B4F]">
                              {p.name}
                            </p>
                            <p className="text-xs text-[#697A71]">
                              SKU: {p.sku} • Stock: {p.stock} units • {p.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#1E2521]">
                            {formatCurrency(p.sellingPrice, currency)}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            p.stock <= p.reorderLevel ? 'bg-[#FEF6E8] text-[#B06B08]' : 'bg-[#E4F5E9] text-[#156B3A]'
                          }`}>
                            {p.stock <= p.reorderLevel ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {filteredOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#1F6B4F]" />
                    <span>Orders ({filteredOrders.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredOrders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => {
                          onSelect('orders', o);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F3] border border-transparent hover:border-[#E8E4D9] transition-all text-left group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#1E2521] group-hover:text-[#1F6B4F]">
                            Order #{o.id} — {o.customerName}
                          </p>
                          <p className="text-xs text-[#697A71]">
                            {formatDate(o.date, 'short')} • {o.items?.length || 0} items • {o.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#1E2521]">
                            {formatCurrency(o.total, currency)}
                          </p>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            o.status === 'Completed' ? 'bg-[#E4F5E9] text-[#156B3A]' : 'bg-[#FEF6E8] text-[#B06B08]'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Section */}
              {filteredCustomers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8A9A90] uppercase tracking-wider mb-2">
                    <Users className="w-3.5 h-3.5 text-[#1F6B4F]" />
                    <span>Customers ({filteredCustomers.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelect('customers', c);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F3] border border-transparent hover:border-[#E8E4D9] transition-all text-left group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#DCEBDD] text-[#1F6B4F] font-bold text-xs flex items-center justify-center">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1E2521] group-hover:text-[#1F6B4F]">
                              {c.name}
                            </p>
                            <p className="text-xs text-[#697A71]">{c.phone} • {c.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#1E2521]">
                            {formatCurrency(c.totalSpent, currency)}
                          </p>
                          <p className="text-[10px] text-[#697A71]">{c.totalOrders} orders</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF8F3] border-t border-[#EBE7DC] flex items-center justify-between text-xs text-[#697A71]">
          <span>Tip: Click any item to view full records & actions</span>
          <span className="flex items-center gap-1 font-mono">
            <span>navigate</span> <CornerDownLeft className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
