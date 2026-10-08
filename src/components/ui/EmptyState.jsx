// MiniMart AI - Empty State and Loading Skeleton UI Components

import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records matching your current filter or query.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="card p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-[#EAF3ED] text-[#1F6B4F] flex items-center justify-center mb-4 shadow-xs">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-display font-bold text-lg text-[#1E2521] mb-1.5">{title}</h3>
      <p className="text-sm text-[#697A71] max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-5 border border-[#EBE7DC] shadow-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFECE2]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#EFECE2] rounded w-1/3" />
              <div className="h-3 bg-[#F5F2EA] rounded w-1/2" />
            </div>
            <div className="w-16 h-6 bg-[#EFECE2] rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
