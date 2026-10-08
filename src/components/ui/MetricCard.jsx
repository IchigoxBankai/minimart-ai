// MiniMart AI - Reusable Metric Card

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  change,
  isPositive,
  icon: Icon,
  iconBg = 'bg-[#DCEBDD]',
  iconColor = 'text-[#1F6B4F]',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`card p-5 flex flex-col justify-between ${
        onClick ? 'cursor-pointer card-hover' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold text-[#697A71]">{title}</span>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="font-display font-bold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
          {value}
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {change !== undefined && change !== null && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                isPositive === true
                  ? 'bg-[#E4F5E9] text-[#156B3A]'
                  : isPositive === false
                  ? 'bg-[#FDEEED] text-[#C92A2A]'
                  : 'bg-[#F0ECE1] text-[#526259]'
              }`}
            >
              {isPositive === true && <TrendingUp className="w-3 h-3" />}
              {isPositive === false && <TrendingDown className="w-3 h-3" />}
              {isPositive === null && <Minus className="w-3 h-3" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-[#8A9A90] font-medium">{subtitle}</span>
          )}
        </div>
      </div>
    </div>
  );
};
