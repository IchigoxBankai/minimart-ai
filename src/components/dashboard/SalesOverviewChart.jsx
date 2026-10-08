// MiniMart AI - Sales Overview Chart with 7D/30D/90D Timeframe Selectors

import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';
import { aiTools } from '../../services/ai/tools';
import { formatCurrency } from '../../utils/formatters';

export const SalesOverviewChart = ({ storeId, currency = 'INR' }) => {
  const [timeRange, setTimeRange] = useState(7); // 7, 30, 90

  const chartData = useMemo(() => {
    return aiTools.getSalesData(storeId, timeRange);
  }, [storeId, timeRange]);

  const totalPeriodRevenue = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.revenue, 0);
  }, [chartData]);

  const totalPeriodOrders = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.orders, 0);
  }, [chartData]);

  // Custom rich tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 rounded-2xl shadow-dropdown border border-[#E6E2D8] text-xs">
          <p className="font-bold text-[#1E2521] mb-1.5">{label}</p>
          <div className="space-y-1">
            <p className="text-[#1F6B4F] font-semibold flex items-center justify-between gap-4">
              <span>Revenue:</span>
              <span className="font-bold">{formatCurrency(payload[0].value, currency)}</span>
            </p>
            {payload[1] && (
              <p className="text-[#F2A93B] font-semibold flex items-center justify-between gap-4">
                <span>Orders:</span>
                <span className="font-bold">{payload[1].value} orders</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-5 sm:p-6 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-[#1E2521]">Sales Performance</h3>
            <span className="badge-success">
              <TrendingUp className="w-3 h-3" />
              +12.4% pace
            </span>
          </div>
          <p className="text-xs text-[#697A71] mt-0.5">
            Total {timeRange}d Revenue: <span className="font-bold text-[#1E2521]">{formatCurrency(totalPeriodRevenue, currency)}</span> ({totalPeriodOrders} orders)
          </p>
        </div>

        {/* Time range selector pills */}
        <div className="flex items-center bg-[#F4F1E8] p-1 rounded-xl border border-[#E5E0D4] self-stretch sm:self-auto justify-between sm:justify-start">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] flex-1 sm:flex-initial text-center ${
                timeRange === days
                  ? 'bg-white text-[#1F6B4F] shadow-xs'
                  : 'text-[#697A71] hover:text-[#1E2521]'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1F6B4F" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#1F6B4F" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE2" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A9A90', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#8A9A90', fontSize: 11 }}
              tickFormatter={(val) => `${currency === 'INR' ? '₹' : '$'}${val > 999 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1F6B4F"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
