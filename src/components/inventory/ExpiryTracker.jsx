// MiniMart AI - FMCG Expiry Date & Freshness Batch Tracker Component

import React, { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle2, Sparkles, Tag, Plus, Calendar, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ExpiryTracker = ({ onOpenAIMessage }) => {
  const { products, currency, createPromotion } = useStore();
  const { showToast } = useToast();

  // Realistic FMCG batches
  const [batches, setBatches] = useState([
    {
      id: 'batch-001',
      productId: 'prod-006',
      productName: 'Amul Taaza Milk 1L',
      batchNumber: 'LOT-AMUL-982',
      quantity: 3,
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days
      cost: 48,
      price: 56,
    },
    {
      id: 'batch-002',
      productId: 'prod-004',
      productName: 'Britannia Whole Wheat Bread',
      batchNumber: 'LOT-BRIT-412',
      quantity: 4,
      expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days
      cost: 35,
      price: 50,
    },
    {
      id: 'batch-003',
      productId: 'prod-005',
      productName: 'Amul Butter 500g',
      batchNumber: 'LOT-AMUL-331',
      quantity: 9,
      expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 8 days
      cost: 235,
      price: 275,
    },
    {
      id: 'batch-004',
      productId: 'prod-003',
      productName: 'Tropicana Orange Juice 1L',
      batchNumber: 'LOT-TROP-109',
      quantity: 14,
      expiryDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 22 days
      cost: 90,
      price: 120,
    },
  ]);

  const getDaysRemaining = (expStr) => {
    const exp = new Date(expStr).getTime();
    const now = new Date().getTime();
    return Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
  };

  const handleApplyClearancePromo = (batch) => {
    createPromotion({
      title: `⚡ Flash Clearance: ${batch.productName}`,
      description: `20% Clearance Discount on expiring batch ${batch.batchNumber}`,
      discountPercent: 20,
      bundledProducts: [batch.productId],
      startDate: new Date().toISOString(),
      endDate: batch.expiryDate,
    });
    showToast(`20% Clearance Promotion active for ${batch.productName}! 🎉`, 'success');
  };

  return (
    <div className="card p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0ECE1] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FEF6E8] text-[#B06B08]">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-[#1E2521]">
              Freshness & Expiry Batch Tracker
            </h3>
          </div>
          <p className="text-xs text-[#697A71] mt-0.5">
            Zero-waste food monitoring with automated AI clearance discount formulas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-warning text-xs">
            2 Batches Expiring This Week
          </span>
        </div>
      </div>

      {/* Batch List */}
      <div className="divide-y divide-[#F2EFE7]">
        {batches.map((batch) => {
          const daysLeft = getDaysRemaining(batch.expiryDate);
          const isCritical = daysLeft <= 3;
          const isWarning = daysLeft > 3 && daysLeft <= 7;

          return (
            <div key={batch.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                    isCritical
                      ? 'bg-red-100 text-red-600'
                      : isWarning
                      ? 'bg-[#FEF6E8] text-[#B06B08]'
                      : 'bg-[#E4F5E9] text-[#156B3A]'
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#1E2521]">{batch.productName}</p>
                    <span className="font-mono text-[10px] bg-[#F2EFE7] text-[#526259] px-1.5 py-0.5 rounded">
                      {batch.batchNumber}
                    </span>
                  </div>
                  <p className="text-xs text-[#697A71] mt-0.5">
                    Quantity: <strong>{batch.quantity} units</strong> • Value: {formatCurrency(batch.quantity * batch.price, currency)}
                  </p>
                  <p className="text-[11px] text-[#8A9A90] mt-0.5">
                    Expiry Date: {formatDate(batch.expiryDate, 'medium')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      isCritical
                        ? 'bg-red-100 text-red-700'
                        : isWarning
                        ? 'bg-[#FEF6E8] text-[#B06B08]'
                        : 'bg-[#E4F5E9] text-[#156B3A]'
                    }`}
                  >
                    {daysLeft <= 0 ? 'Expired' : `${daysLeft} days left`}
                  </span>
                </div>

                {isCritical && (
                  <button
                    onClick={() => handleApplyClearancePromo(batch)}
                    className="btn-accent text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 min-h-[38px]"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Apply 20% Clearance</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Freshness Advice */}
      <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] flex items-center justify-between gap-3 text-xs text-[#526259]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#F2A93B] flex-shrink-0" />
          <span>
            AI Recommendation: Apply early flash discounts on dairy items 48h before expiry to recover 85% of cost value.
          </span>
        </div>
      </div>
    </div>
  );
};
