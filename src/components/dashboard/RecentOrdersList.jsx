// MiniMart AI - Recent Orders Dashboard Component

import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RecentOrdersList = ({ orders = [], currency = 'INR', onNavigate, onSelectOrder }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="badge-success">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="badge-info">
            <Clock className="w-3 h-3" />
            Processing
          </span>
        );
      case 'Pending':
        return (
          <span className="badge-warning">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="badge-danger">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return <span className="badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EBF3FC] text-[#1965B8]">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <h3 className="font-display font-bold text-base text-[#1E2521]">Recent Orders</h3>
        </div>
        <button
          onClick={() => onNavigate('orders')}
          className="text-xs font-semibold text-[#1F6B4F] hover:underline flex items-center gap-1 min-h-[36px]"
        >
          <span>All Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-[#F4F1E8] my-2">
        {orders.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#697A71]">
            No recent orders recorded today.
          </div>
        ) : (
          orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder && onSelectOrder(order)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF8F3] -mx-2 px-2 rounded-xl transition-all cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#1E2521]">
                    #{order.id}
                  </span>
                  <span className="text-xs font-semibold text-[#526259] truncate">
                    {order.customerName}
                  </span>
                </div>
                <p className="text-[11px] text-[#8A9A90] mt-0.5">
                  {formatDate(order.date, 'time')} • {order.items?.length || 1} items • {order.paymentMethod}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <p className="text-xs sm:text-sm font-bold text-[#1E2521]">
                  {formatCurrency(order.total, currency)}
                </p>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 text-center border-t border-[#F0ECE1]">
        <p className="text-[11px] text-[#8A9A90]">
          Auto-updates instantly with inventory reduction.
        </p>
      </div>
    </div>
  );
};
