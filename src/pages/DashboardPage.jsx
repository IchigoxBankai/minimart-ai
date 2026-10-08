// MiniMart AI - Main Store Dashboard Page

import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  ArrowRight,
  Package,
  Boxes,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/ui/MetricCard';
import { SalesOverviewChart } from '../components/dashboard/SalesOverviewChart';
import { TopProductsList } from '../components/dashboard/TopProductsList';
import { LowStockList } from '../components/dashboard/LowStockList';
import { RecentOrdersList } from '../components/dashboard/RecentOrdersList';
import { AIInsightsCarousel } from '../components/dashboard/AIInsightsCarousel';
import { formatCurrency } from '../utils/formatters';

export const DashboardPage = ({ onNavigate, onOpenAIMessage, onSelectOrder }) => {
  const { products, orders, metrics, currency, profile } = useStore();
  const { currentUser, isDemo } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const ownerName = currentUser?.displayName || profile?.ownerName || 'Store Owner';

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* 1. Header with greeting and primary action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            {getGreeting()}, {ownerName} 👋
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Here's what's happening in your store today at <strong className="text-[#1E2521]">{profile?.storeName || 'DailyBasket Supermart'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('orders')}
            className="btn-outline text-xs font-bold px-3.5 py-2 min-h-[42px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </button>
          <button
            onClick={() => onNavigate('ai-manager')}
            className="btn-primary text-xs font-bold px-4 py-2 shadow-sm shadow-[#1F6B4F]/20 min-h-[42px]"
          >
            <Sparkles className="w-4 h-4 text-[#F2A93B]" />
            <span>AI Manager</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Business Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Card 1: Today's Revenue */}
        <MetricCard
          title="Today's Revenue"
          value={formatCurrency(metrics?.todayRevenue || 8420, currency)}
          change="+14.2%"
          isPositive={true}
          subtitle="vs yesterday"
          icon={DollarSign}
          iconBg="bg-[#DCEBDD]"
          iconColor="text-[#1F6B4F]"
          onClick={() => onNavigate('analytics')}
        />

        {/* Card 2: Today's Orders */}
        <MetricCard
          title="Today's Orders"
          value={`${metrics?.todayOrdersCount || 42}`}
          change="+8 orders"
          isPositive={true}
          subtitle="vs yesterday"
          icon={ShoppingBag}
          iconBg="bg-[#EBF3FC]"
          iconColor="text-[#1965B8]"
          onClick={() => onNavigate('orders')}
        />

        {/* Card 3: Low Stock Items */}
        <MetricCard
          title="Low Stock Items"
          value={`${metrics?.lowStockCount || 0}`}
          change={metrics?.lowStockCount > 0 ? "Action needed" : "All good"}
          isPositive={metrics?.lowStockCount === 0}
          subtitle="needs reorder"
          icon={AlertTriangle}
          iconBg={metrics?.lowStockCount > 0 ? "bg-[#FEF6E8]" : "bg-[#DCEBDD]"}
          iconColor={metrics?.lowStockCount > 0 ? "text-[#F2A93B]" : "text-[#1F6B4F]"}
          onClick={() => onNavigate('inventory')}
        />

        {/* Card 4: Sales Growth */}
        <MetricCard
          title="Sales Growth"
          value={`+${metrics?.weeklyGrowth || 12.4}%`}
          change="Strong pace"
          isPositive={true}
          subtitle="vs last week"
          icon={TrendingUp}
          iconBg="bg-[#EAF3ED]"
          iconColor="text-[#1F6B4F]"
          onClick={() => onNavigate('analytics')}
        />
      </div>

      {/* 3. AI Insights Carousel */}
      <AIInsightsCarousel onOpenAIMessage={onOpenAIMessage} />

      {/* 4. Sales Overview Chart */}
      <SalesOverviewChart storeId={profile?.storeId} currency={currency} />

      {/* 5. Two-column grid: Top Products & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsList
          products={products}
          currency={currency}
          onNavigate={onNavigate}
        />
        <LowStockList
          products={products}
          onNavigate={onNavigate}
        />
      </div>

      {/* 6. Recent Orders Section */}
      <RecentOrdersList
        orders={orders}
        currency={currency}
        onNavigate={onNavigate}
        onSelectOrder={onSelectOrder}
      />
    </div>
  );
};
