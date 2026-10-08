// MiniMart AI - Reusable Status Badge Component

import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const variantClasses = {
    success: 'bg-[#E4F5E9] text-[#156B3A] border-[#C5E9CE]',
    warning: 'bg-[#FEF6E8] text-[#B06B08] border-[#FCDDB0]',
    danger: 'bg-[#FDEEED] text-[#C92A2A] border-[#F9C9C6]',
    info: 'bg-[#EBF3FC] text-[#1965B8] border-[#CCE1FA]',
    neutral: 'bg-[#F0ECE1] text-[#4F5D54] border-[#DDD7C8]',
    primary: 'bg-[#DCEBDD] text-[#1F6B4F] border-[#BED6C0]',
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${
        variantClasses[variant] || variantClasses.neutral
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {children}
    </span>
  );
};
