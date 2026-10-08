// MiniMart AI - Low Stock Dashboard Component

import React, { useState } from 'react';
import { AlertTriangle, Plus, ArrowRight, PackagePlus } from 'lucide-react';
import { RestockModal } from '../inventory/RestockModal';
import { useStore } from '../../context/StoreContext';

export const LowStockList = ({ products = [], onNavigate }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const { restockProduct, currency } = useStore();

  const lowStockItems = products
    .filter((p) => p.stock <= p.reorderLevel)
    .sort((a, b) => a.stock - b.stock);

  const handleOpenRestock = (prod) => {
    setSelectedProduct(prod);
    setIsRestockOpen(true);
  };

  return (
    <>
      <div className="card p-5 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FEF6E8] text-[#B06B08]">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[#1E2521]">
              Low Stock Alerts ({lowStockItems.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs font-semibold text-[#1F6B4F] hover:underline flex items-center gap-1 min-h-[36px]"
          >
            <span>Inventory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#F4F1E8] my-2">
          {lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#697A71]">
              🎉 Excellent! All products are well stocked above reorder thresholds.
            </div>
          ) : (
            lowStockItems.slice(0, 4).map((p) => {
              const isOut = p.stock === 0;
              return (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#1E2521] truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-[#697A71] truncate">
                        SKU: {p.sku} • Reorder at: {p.reorderLevel} units
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isOut
                            ? 'bg-[#FDEEED] text-[#C92A2A]'
                            : 'bg-[#FEF6E8] text-[#B06B08]'
                        }`}
                      >
                        {p.stock} left
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenRestock(p)}
                      className="btn-primary text-xs font-bold px-3 py-1.5 rounded-xl min-h-[36px] flex items-center gap-1"
                    >
                      <PackagePlus className="w-3.5 h-3.5" />
                      <span>Restock</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 text-center border-t border-[#F0ECE1]">
          <p className="text-[11px] text-[#8A9A90]">
            AI recalculates days of inventory every 15 minutes.
          </p>
        </div>
      </div>

      {/* Restock Action Modal */}
      <RestockModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        product={selectedProduct}
        currency={currency}
        onRestockSubmit={(payload) => restockProduct(payload)}
      />
    </>
  );
};
