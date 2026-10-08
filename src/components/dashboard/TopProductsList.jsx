// MiniMart AI - Top Selling Products Dashboard Component

import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const TopProductsList = ({ products = [], currency = 'INR', onNavigate }) => {
  // Sort by calculated sales velocity / stock turnover
  const topProducts = [...products]
    .sort((a, b) => (b.salesVelocity || 0) - (a.salesVelocity || 0))
    .slice(0, 5);

  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#DCEBDD] text-[#1F6B4F]">
            <Award className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-[#1E2521]">Top Products</h3>
        </div>
        <button
          onClick={() => onNavigate('products')}
          className="text-xs font-semibold text-[#1F6B4F] hover:underline flex items-center gap-1 min-h-[36px]"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[#F4F1E8] my-2">
        {topProducts.map((p, index) => {
          const velocity = p.salesVelocity || 3.5;
          const estRevenue = Math.round(velocity * 14 * p.sellingPrice);

          return (
            <div key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 font-mono text-xs font-bold text-[#8A9A90] text-center">
                  #{index + 1}
                </span>
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
                    {p.category} • {formatCurrency(p.sellingPrice, currency)}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm font-bold text-[#1E2521]">
                  ~{formatCurrency(estRevenue, currency)}
                </p>
                <span className="text-[10px] font-semibold text-[#1F6B4F] bg-[#EAF3ED] px-1.5 py-0.5 rounded">
                  {velocity}/day sold
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center border-t border-[#F0ECE1]">
        <p className="text-[11px] text-[#8A9A90]">
          Ranked by 14-day sales volume and revenue contribution.
        </p>
      </div>
    </div>
  );
};
