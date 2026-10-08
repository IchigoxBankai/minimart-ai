// MiniMart AI - Business Analytics & Trend Forecasts Page

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  PieChart as PieIcon, 
  Calendar, 
  Download, 
  Info,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useStore } from '../context/StoreContext';
import { aiTools } from '../services/ai/tools';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const CATEGORY_COLORS = ['#1F6B4F', '#F2A93B', '#1965B8', '#8E44AD', '#E67E22', '#16A085', '#2C3E50', '#D35400'];

export const AnalyticsPage = ({ onOpenAIMessage }) => {
  const { profile, currency, products } = useStore();
  const [timeRange, setTimeRange] = useState(30); // 7, 30, 90

  const storeId = profile?.storeId;

  // Real tool data
  const salesData = useMemo(() => aiTools.getSalesData(storeId, timeRange), [storeId, timeRange]);
  const categoryData = useMemo(() => aiTools.getCategoryPerformance(storeId), [storeId]);
  const productPerf = useMemo(() => aiTools.getProductPerformance(storeId), [storeId]);
  const profitData = useMemo(() => aiTools.calculateProfitEstimate(storeId, timeRange), [storeId, timeRange]);

  const totalPeriodRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const totalPeriodOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalPeriodOrders > 0 ? Math.round(totalPeriodRevenue / totalPeriodOrders) : 380;

  // Custom Tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3.5 rounded-2xl shadow-dropdown border border-[#E6E2D8] text-xs">
          <p className="font-bold text-[#1E2521] mb-1">{label}</p>
          <p className="text-[#1F6B4F] font-bold">
            Revenue: {formatCurrency(payload[0].value, currency)}
          </p>
          {payload[1] && (
            <p className="text-[#F2A93B] font-bold">
              Orders: {payload[1].value}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            Analytics & Performance Trends
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Track revenue velocity, department sales share, and profit margins.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center bg-[#F2EFE7] p-1 rounded-2xl border border-[#E3DFD5] self-stretch sm:self-auto justify-between">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] flex-1 sm:flex-initial text-center ${
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

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4">
          <p className="text-xs font-semibold text-[#697A71]">Period Gross Revenue</p>
          <p className="font-display font-bold text-2xl text-[#1E2521] mt-2">
            {formatCurrency(totalPeriodRevenue, currency)}
          </p>
          <span className="badge-success text-[10px] mt-1.5">+14.2% pace</span>
        </div>

        <div className="card p-4">
          <p className="text-xs font-semibold text-[#697A71]">Total Completed Orders</p>
          <p className="font-display font-bold text-2xl text-[#1E2521] mt-2">
            {totalPeriodOrders}
          </p>
          <p className="text-[11px] text-[#8A9A90] mt-1.5">~{(totalPeriodOrders / timeRange).toFixed(1)} orders/day</p>
        </div>

        <div className="card p-4">
          <p className="text-xs font-semibold text-[#697A71]">Average Order Value</p>
          <p className="font-display font-bold text-2xl text-[#1965B8] mt-2">
            {formatCurrency(avgOrderValue, currency)}
          </p>
          <p className="text-[11px] text-[#8A9A90] mt-1.5">Basket ticket size</p>
        </div>

        <div className="card p-4">
          <p className="text-xs font-semibold text-[#697A71]">Est. Net Profit Margin</p>
          <p className="font-display font-bold text-2xl text-[#1F6B4F] mt-2">
            {profitData.profitMarginPercent}%
          </p>
          <span className="badge-primary text-[10px] mt-1.5">Healthy margin</span>
        </div>
      </div>

      {/* Main Revenue Trend Chart */}
      <div className="card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-[#F0ECE1]">
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E2521]">
              Daily Revenue Flow ({timeRange} Days)
            </h3>
            <p className="text-xs text-[#697A71]">
              Gross sales daily timeline with recurring purchase pattern tracking.
            </p>
          </div>
          <button
            onClick={() => onOpenAIMessage('Analyze my store sales trends and explain key factors.')}
            className="btn-outline text-xs font-bold px-3 py-1.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F2A93B]" />
            <span>AI Sales Diagnosis</span>
          </button>
        </div>

        <div className="h-72 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="analyticsRevGrad" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(v) => `${currency === 'INR' ? '₹' : '$'}${v > 999 ? `${(v/1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1F6B4F"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#analyticsRevGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two-Column Grid: Category Performance & Profit Margins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Bar Chart */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between">
          <div className="pb-3 border-b border-[#F0ECE1]">
            <h3 className="font-display font-bold text-base text-[#1E2521]">
              Category Revenue Breakdown
            </h3>
            <p className="text-xs text-[#697A71]">
              Revenue generated across departments.
            </p>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EFECE2" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#1E2521', fontSize: 11, fontWeight: 600 }}
                  width={90}
                />
                <Tooltip
                  formatter={(val) => [formatCurrency(val, currency), 'Revenue']}
                  contentStyle={{ borderRadius: '1rem', border: '1px solid #E6E2D8' }}
                />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#F0ECE1] text-[11px] text-[#8A9A90] text-center">
            Top performing: <strong className="text-[#1F6B4F]">{categoryData[0]?.category}</strong>
          </div>
        </div>

        {/* Profit Estimation Card */}
        <div className="card p-5 sm:p-6 flex flex-col justify-between bg-gradient-to-br from-white to-[#FAF8F3]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F0ECE1]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#EAF3ED] text-[#1F6B4F]">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="font-display font-bold text-base text-[#1E2521]">
                  Profit & Margin Estimation
                </h3>
              </div>
              <span className="badge-info text-[10px]">
                <Info className="w-3 h-3" />
                COGS Model
              </span>
            </div>

            <div className="space-y-4 my-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E6E1D4] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#697A71]">Estimated Period Revenue:</span>
                  <span className="font-bold text-[#1E2521] text-sm">
                    {formatCurrency(profitData.revenue, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#697A71]">Estimated Cost of Goods (COGS):</span>
                  <span className="font-bold text-red-600 text-sm">
                    -{formatCurrency(profitData.estimatedCost, currency)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between font-display">
                  <span className="text-sm font-bold text-[#1E2521]">Estimated Net Profit:</span>
                  <span className="text-lg font-extrabold text-[#1F6B4F]">
                    {formatCurrency(profitData.estimatedProfit, currency)}
                  </span>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="p-3.5 rounded-xl bg-[#FEF6E8] border border-[#FCDDB0] text-xs text-[#526259] leading-relaxed">
                <p className="font-bold text-[#B06B08] mb-0.5">Disclaimer:</p>
                {profitData.disclaimer} Operational expenses (rent, utilities, staff) are not factored into COGS estimates.
              </div>
            </div>
          </div>

          <button
            onClick={() => onOpenAIMessage('How can I optimize and increase my profit margins?')}
            className="w-full btn-primary text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
            <span>Ask AI Margin Optimization Strategies</span>
          </button>
        </div>
      </div>

      {/* Product Profitability & Margins Table */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-display font-bold text-base text-[#1E2521] mb-1">
          Product Margin Leaderboard
        </h3>
        <p className="text-xs text-[#697A71] mb-4">
          Individual item unit economics ranked by profit margin percentage.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF8F3] text-[#697A71] text-xs font-bold uppercase tracking-wider border-b border-[#EBE7DC]">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Cost Price</th>
                <th className="py-3 px-4">Gross Margin %</th>
                <th className="py-3 px-4 text-right">Est. Unit Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE7]">
              {productPerf.topSellers.slice(0, 8).map((p) => {
                const unitProfit = p.sellingPrice - (products.find((prod) => prod.id === p.id)?.costPrice || p.sellingPrice * 0.7);
                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F3]/70">
                    <td className="py-3 px-4 font-bold text-[#1E2521]">{p.name}</td>
                    <td className="py-3 px-4 text-xs text-[#697A71]">{p.category}</td>
                    <td className="py-3 px-4 font-semibold text-[#1E2521]">{formatCurrency(p.sellingPrice, currency)}</td>
                    <td className="py-3 px-4 text-xs text-[#697A71]">{formatCurrency(p.sellingPrice - unitProfit, currency)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.margin >= 30 ? 'bg-[#E4F5E9] text-[#156B3A]' : 'bg-[#FEF6E8] text-[#B06B08]'
                      }`}>
                        {p.margin}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-display font-bold text-[#1F6B4F]">
                      +{formatCurrency(unitProfit, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
