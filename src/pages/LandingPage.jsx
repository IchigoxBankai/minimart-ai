// MiniMart AI - Redesigned Clean & Cool Retail OS Landing Page

import React, { useState } from 'react';
import { 
  Store, 
  Sparkles, 
  TrendingUp, 
  Boxes, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  FileText, 
  Smartphone, 
  ChevronRight,
  Zap,
  Star,
  Check,
  Package,
  Layers,
  Activity,
  Play,
  ArrowUpRight,
  QrCode,
  Tag
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export const LandingPage = ({ onGetStarted, onTryDemo, onLogin }) => {
  // Interactive Simulator Tab state for the live preview in Hero
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'sales', 'promo', 'customers'

  const scenarios = {
    inventory: {
      badge: '⚡ Predictive Stockout Alert',
      title: 'Coca-Cola 750ml requires urgent reorder',
      subtitle: '8 units remaining • Velocity: 6.2 units/day • Stockout in ~1.3 days',
      aiMessage: 'Based on the last 14 days of sales and current stock, I recommend restocking 30 bottles from Hindustan Coca-Cola before Friday night peak.',
      actionTitle: 'Create Restock Task',
      actionPayload: 'Order 30 units (Est. ₹840)',
      metric1: { label: 'Stock Left', val: '8 units', alert: true },
      metric2: { label: 'Daily Sales', val: '6.2 / day' },
      metric3: { label: 'Suggested PO', val: '30 units' },
    },
    sales: {
      badge: '📈 Sales & Revenue Velocity',
      title: 'Weekly revenue pace is up +12.4%',
      subtitle: 'Gross revenue: ₹42,800 • Top Category: Beverages • Star Item: Coke 750ml',
      aiMessage: 'Beverages generated 38% of your revenue this week. However, 3 high-margin snacks are moving slower than usual. Consider running a combo promotion.',
      actionTitle: 'Diagnose Product Mix',
      actionPayload: 'View Category Share',
      metric1: { label: 'Weekly Gross', val: '₹42,800' },
      metric2: { label: 'Pace vs Last Wk', val: '+12.4%', highlight: true },
      metric3: { label: 'Est. Net Margin', val: '28.5%' },
    },
    promo: {
      badge: '🎯 Smart AI Bundle Builder',
      title: 'Launch "Crunch & Chill" Snack Combo',
      subtitle: 'Pair high-velocity Coke 750ml with slow-moving Kurkure Munch (8% discount)',
      aiMessage: 'This combo accelerates Kurkure stock turnover by 2.4x while increasing your average order basket value from ₹180 to ₹220 with a healthy 22% margin.',
      actionTitle: 'Activate Bundle in POS',
      actionPayload: 'Apply 8% Discount across Checkout',
      metric1: { label: 'Target AOV', val: '+18%' },
      metric2: { label: 'Bundle Discount', val: '8% OFF' },
      metric3: { label: 'Combined Margin', val: '22%' },
    },
    customers: {
      badge: '👥 Lapsed Customer Recovery',
      title: '3 regular customers haven\'t visited in >30 days',
      subtitle: 'Identified: Rahul Sharma, Priya Patel & Vikram Joshi',
      aiMessage: 'These 3 customers previously spent over ₹15,000 at your store. I suggest sending a personalized "We Miss You" 10% coupon broadcast to bring them back.',
      actionTitle: 'Send Win-Back Campaign',
      actionPayload: 'Generate 10% Re-engagement Code',
      metric1: { label: 'Lapsed Spenders', val: '3 VIPs', alert: true },
      metric2: { label: 'Lost Revenue Risk', val: '₹4,500/mo' },
      metric3: { label: 'Retention Target', val: '65%' },
    },
  };

  const currentScenario = scenarios[activeTab];

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1E2521] selection:bg-[#DCEBDD] selection:text-[#1F6B4F] relative overflow-x-hidden font-sans">
      {/* Background Subtle Gradient & Mesh Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40 blur-3xl -z-10 bg-gradient-to-b from-[#1F6B4F]/20 via-[#DCEBDD]/30 to-transparent" />

      {/* 1. Header: Floating Pill Navigation */}
      <header className="sticky top-4 z-50 px-4 max-w-7xl mx-auto">
        <div className="bg-white/85 backdrop-blur-xl border border-[#E6E1D4] shadow-dropdown rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between transition-all">
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F6B4F] flex items-center justify-center text-white shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg sm:text-xl text-[#1E2521] tracking-tight">MiniMart</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#DCEBDD] text-[#1F6B4F] text-[10px] font-extrabold uppercase tracking-wider">AI</span>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#526259]">
            <a href="#features" className="hover:text-[#1F6B4F] transition-colors">Features</a>
            <a href="#simulator" className="hover:text-[#1F6B4F] transition-colors">Live Co-pilot</a>
            <a href="#how-it-works" className="hover:text-[#1F6B4F] transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-[#1F6B4F] transition-colors">Why MiniMart</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onLogin}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#526259] hover:text-[#1F6B4F] hover:bg-[#EAF3ED] transition-all min-h-[38px]"
            >
              Sign In
            </button>
            <button
              onClick={onTryDemo}
              className="hidden sm:inline-flex btn-secondary text-xs font-bold px-3.5 py-1.5 min-h-[38px]"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>See Demo</span>
            </button>
            <button
              onClick={onGetStarted}
              className="btn-primary text-xs font-bold px-4 py-1.5 shadow-sm shadow-[#1F6B4F]/25 min-h-[38px]"
            >
              <span>Try MiniMart AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-12 pb-16 sm:pt-18 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Modern Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E3DFD5] shadow-2xs text-xs font-bold text-[#1E2521] mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#1F6B4F] animate-pulse" />
          <span className="text-[#697A71]">Next-Gen Retail Intelligence</span>
          <span className="text-[#E0E6E2]">•</span>
          <span className="text-[#1F6B4F]">Autonomous AI Store Manager</span>
        </div>

        {/* Dynamic Display Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#1E2521] tracking-tight max-w-4xl mx-auto leading-[1.08] mb-6">
          Run your retail store <br className="hidden sm:inline" />
          <span className="relative inline-block text-[#1F6B4F]">
            smarter with AI.
            <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F2A93B]" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-[#526259] max-w-2xl mx-auto leading-relaxed mb-9">
          MiniMart AI helps small retail businesses understand sales, manage inventory, eliminate stockouts, and make profitable decisions with an intelligent digital store co-pilot.
        </p>

        {/* Main CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto mb-14">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto btn-primary px-7 py-3.5 text-sm sm:text-base font-bold shadow-lg shadow-[#1F6B4F]/25 min-h-[50px]"
          >
            <span>Try MiniMart AI Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onTryDemo}
            className="w-full sm:w-auto btn-outline px-6 py-3.5 text-sm sm:text-base font-bold border-[#D5CFBF] min-h-[50px] flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current text-[#1F6B4F]" />
            <span>See Live Demo Store</span>
          </button>
        </div>

        {/* 4 Trust Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="card p-4 bg-white/80 border-[#E8E4D9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B4F]">
              <Zap className="w-4 h-4 text-[#F2A93B]" />
              <span>Zero Stockouts</span>
            </div>
            <p className="font-display font-extrabold text-xl text-[#1E2521] mt-1">99.4% Uptime</p>
            <p className="text-[11px] text-[#697A71]">Predictive velocity restocking</p>
          </div>

          <div className="card p-4 bg-white/80 border-[#E8E4D9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B4F]">
              <TrendingUp className="w-4 h-4 text-[#1F6B4F]" />
              <span>Revenue Uplift</span>
            </div>
            <p className="font-display font-extrabold text-xl text-[#1E2521] mt-1">+14.2% Growth</p>
            <p className="text-[11px] text-[#697A71]">Average monthly store pacing</p>
          </div>

          <div className="card p-4 bg-white/80 border-[#E8E4D9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B4F]">
              <ShieldCheck className="w-4 h-4 text-[#1965B8]" />
              <span>Real Store Data</span>
            </div>
            <p className="font-display font-extrabold text-xl text-[#1E2521] mt-1">100% Grounded</p>
            <p className="text-[11px] text-[#697A71]">Zero fabricated statistics</p>
          </div>

          <div className="card p-4 bg-white/80 border-[#E8E4D9]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B4F]">
              <Smartphone className="w-4 h-4 text-[#8E44AD]" />
              <span>Mobile First</span>
            </div>
            <p className="font-display font-extrabold text-xl text-[#1E2521] mt-1">Touch Ready</p>
            <p className="text-[11px] text-[#697A71]">Phone, tablet & laptop ready</p>
          </div>
        </div>
      </section>

      {/* 3. Live Interactive Product & AI Simulator Showcase */}
      <section id="simulator" className="py-12 bg-white border-y border-[#E6E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#D0E4D6]">
              Interactive Showcase
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-4xl text-[#1E2521] mt-2.5 tracking-tight">
              Experience the AI Store Manager in Action
            </h2>
            <p className="text-xs sm:text-sm text-[#697A71] mt-2">
              Select a real business scenario below to test how MiniMart AI diagnoses and resolves store challenges.
            </p>
          </div>

          {/* Interactive Scenario Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            {[
              { id: 'inventory', label: '⚡ Stockout Prevention', icon: Boxes },
              { id: 'sales', label: '📈 Sales Diagnosis', icon: TrendingUp },
              { id: 'promo', label: '🎯 Smart Bundle Promo', icon: Tag },
              { id: 'customers', label: '👥 Lapsed Customer Winback', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap min-h-[42px] flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#1F6B4F] text-white shadow-md shadow-[#1F6B4F]/20'
                      : 'bg-[#F4F1E8] text-[#526259] hover:bg-[#EAE6DB]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Live Scenario Card Showcase */}
          <div className="max-w-4xl mx-auto card p-5 sm:p-7 bg-[#FAF8F3] border-[#DDD7C8] shadow-card">
            {/* Top Widget Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E4D9] gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F6B4F] bg-[#EAF3ED] px-2.5 py-0.5 rounded-full border border-[#D0E4D6]">
                  {currentScenario.badge}
                </span>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#1E2521] mt-1.5">
                  {currentScenario.title}
                </h3>
                <p className="text-xs text-[#697A71]">{currentScenario.subtitle}</p>
              </div>

              {/* Mini Metrics */}
              <div className="flex items-center gap-2">
                <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E3DFD5] text-center">
                  <span className="text-[10px] text-[#8A9A90] block">{currentScenario.metric1.label}</span>
                  <span className={`text-xs font-bold ${currentScenario.metric1.alert ? 'text-[#C92A2A]' : 'text-[#1E2521]'}`}>
                    {currentScenario.metric1.val}
                  </span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E3DFD5] text-center">
                  <span className="text-[10px] text-[#8A9A90] block">{currentScenario.metric2.label}</span>
                  <span className={`text-xs font-bold ${currentScenario.metric2.highlight ? 'text-[#156B3A]' : 'text-[#1E2521]'}`}>
                    {currentScenario.metric2.val}
                  </span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-[#E3DFD5] text-center">
                  <span className="text-[10px] text-[#8A9A90] block">{currentScenario.metric3.label}</span>
                  <span className="text-xs font-bold text-[#1F6B4F]">
                    {currentScenario.metric3.val}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Reasoning Box */}
            <div className="my-5 p-4 rounded-2xl bg-white border border-[#E6E1D4] flex items-start gap-3.5 shadow-soft">
              <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] text-[#F2A93B] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider">
                  AI Store Manager Reasoning
                </p>
                <p className="text-xs sm:text-sm text-[#1E2521] leading-relaxed mt-1 font-medium">
                  "{currentScenario.aiMessage}"
                </p>
              </div>
            </div>

            {/* AI Action Card with Approve Trigger */}
            <div className="p-4 rounded-2xl bg-[#EAF3ED] border border-[#CDE1D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#1F6B4F]">
                  Proposed Strategic Action
                </span>
                <p className="font-bold text-sm text-[#1E2521] mt-0.5">{currentScenario.actionTitle}</p>
                <p className="text-xs text-[#526259]">{currentScenario.actionPayload}</p>
              </div>
              <button
                onClick={onTryDemo}
                className="btn-primary text-xs font-bold px-4 py-2 min-h-[40px] shadow-sm flex items-center gap-1.5 whitespace-nowrap"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Test Action in Live Demo Store</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Features Bento Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#D0E4D6]">
            Architected for Modern Retail
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E2521] mt-3 tracking-tight">
            Complete Command Over Your Retail Business
          </h2>
          <p className="text-sm sm:text-base text-[#697A71] mt-2.5">
            Everything you need to eliminate guesswork, stockouts, and manual spreadsheets.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento 1: Predictive Inventory (Large 2 Cols on tablet/desktop) */}
          <div className="md:col-span-2 card p-7 bg-white border-[#E6E1D4] flex flex-col justify-between card-hover">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#DCEBDD] text-[#1F6B4F] flex items-center justify-center">
                  <Boxes className="w-6 h-6" />
                </div>
                <span className="badge-warning text-xs font-bold">Predictive Velocity Reorder</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-[#1E2521] mb-2">
                Predictive Inventory & Reorder Intelligence
              </h3>
              <p className="text-sm text-[#526259] leading-relaxed max-w-xl">
                MiniMart AI calculates the exact daily sales velocity for every single SKU and alerts you days before items deplete, preventing lost sales.
              </p>

              {/* Micro UI Sample */}
              <div className="grid grid-cols-3 gap-2.5 mt-5 p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] text-xs">
                <div>
                  <span className="text-[#8A9A90] text-[10px] uppercase font-bold">Item</span>
                  <p className="font-bold text-[#1E2521] truncate">Coca-Cola 750ml</p>
                </div>
                <div>
                  <span className="text-[#8A9A90] text-[10px] uppercase font-bold">Velocity</span>
                  <p className="font-bold text-[#1F6B4F]">6.2 / day</p>
                </div>
                <div>
                  <span className="text-[#8A9A90] text-[10px] uppercase font-bold">Safety Order</span>
                  <p className="font-bold text-[#B06B08]">30 bottles</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0ECE1] flex items-center justify-between text-xs font-bold text-[#1F6B4F]">
              <span>Automatic Restock Purchase Orders</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento 2: AI Co-Pilot */}
          <div className="card p-7 bg-gradient-to-br from-white to-[#F6FBF8] border-[#CFE4D5] flex flex-col justify-between card-hover">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1F6B4F] text-[#F2A93B] flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E2521] mb-2">
                Autonomous AI Store Co-Pilot
              </h3>
              <p className="text-xs sm:text-sm text-[#526259] leading-relaxed">
                Your 24/7 digital store manager that answers queries, drafts bundle deals, and executes tasks upon your approval.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8EFEA] text-xs font-bold text-[#1F6B4F] flex items-center justify-between">
              <span>Action Confirmation Protection</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento 3: Financial & Profit Margin Analytics */}
          <div className="card p-7 bg-white border-[#E6E1D4] flex flex-col justify-between card-hover">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FEF6E8] text-[#F2A93B] flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E2521] mb-2">
                Sales & Profit Analytics
              </h3>
              <p className="text-xs sm:text-sm text-[#526259] leading-relaxed">
                Real-time COGS profit estimation, product margin leaderboards, and category volume breakdowns.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-xs font-bold text-[#1F6B4F] flex items-center justify-between">
              <span>Downloadable PDF & CSV Audits</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento 4: POS & Rapid Checkout */}
          <div className="card p-7 bg-white border-[#E6E1D4] flex flex-col justify-between card-hover">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3FC] text-[#1965B8] flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E2521] mb-2">
                POS & Lightning Checkout
              </h3>
              <p className="text-xs sm:text-sm text-[#526259] leading-relaxed">
                Log walk-in sales in seconds with automatic stock deduction, multi-payment support (UPI, Cash, Card), and receipts.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-xs font-bold text-[#1F6B4F] flex items-center justify-between">
              <span>Audit Timeline & Statuses</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Bento 5: Customer Retention */}
          <div className="card p-7 bg-white border-[#E6E1D4] flex flex-col justify-between card-hover">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FDEEED] text-[#C92A2A] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1E2521] mb-2">
                Customer Directory & Retention
              </h3>
              <p className="text-xs sm:text-sm text-[#526259] leading-relaxed">
                Identify VIP spenders and automatically detect lapsed shoppers who haven't ordered in 30+ days for win-back campaigns.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F0ECE1] text-xs font-bold text-[#1F6B4F] flex items-center justify-between">
              <span>Lapsed Shopper Winbacks</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works: 3 Step Workflow */}
      <section id="how-it-works" className="py-20 bg-white border-y border-[#E6E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#D0E4D6]">
              Frictionless Setup
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E2521] mt-3 tracking-tight">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F3] border border-[#E8E4D9] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] text-white font-display font-bold text-base flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="font-display font-bold text-lg text-[#1E2521] mb-2">
                  Create Catalog & Reorder Levels
                </h3>
                <p className="text-xs sm:text-sm text-[#697A71] leading-relaxed">
                  Enter your products, cost prices, selling prices, and supplier contacts, or start immediately with our pre-loaded supermarket template.
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-[#1F6B4F] flex items-center gap-1">
                <span>Setup takes &lt; 2 minutes</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F3] border border-[#E8E4D9] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] text-white font-display font-bold text-base flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="font-display font-bold text-lg text-[#1E2521] mb-2">
                  Record Daily POS Sales
                </h3>
                <p className="text-xs sm:text-sm text-[#697A71] leading-relaxed">
                  Log customer purchases through fast checkout. Stock levels, velocity calculations, and revenue graphs update automatically.
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-[#1F6B4F] flex items-center gap-1">
                <span>Live auto-deduction</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#FAF8F3] border border-[#E8E4D9] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] text-white font-display font-bold text-base flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="font-display font-bold text-lg text-[#1E2521] mb-2">
                  Ask AI Co-Pilot & Approve Tasks
                </h3>
                <p className="text-xs sm:text-sm text-[#697A71] leading-relaxed">
                  Ask questions like "Which items should I reorder?" or "Suggest a promotion." Review action cards and approve with a single tap.
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-[#1F6B4F] flex items-center gap-1">
                <span>Decisive action with 1 tap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Comparison Section: Old Way vs MiniMart AI */}
      <section id="comparison" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider bg-[#EAF3ED] px-3 py-1 rounded-full border border-[#D0E4D6]">
            The Value Proposition
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1E2521] mt-3 tracking-tight">
            Why Local Store Owners Switch to MiniMart AI
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Traditional Way */}
          <div className="card p-6 sm:p-8 bg-white border-red-200">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>Traditional Store Management</span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#697A71]">
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Manual pen-and-paper ledgers or clunky 90s desktop software.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Discovering out-of-stock items only after customers walk away disappointed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>No visibility into profit margins or slow-moving inventory tied up in cash.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Lapsed customers disappear unnoticed without any win-back effort.</span>
              </li>
            </ul>
          </div>

          {/* MiniMart AI Way */}
          <div className="card p-6 sm:p-8 bg-gradient-to-br from-white to-[#F2F8F4] border-[#1F6B4F]/40 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F6B4F] uppercase tracking-wider mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F6B4F]" />
              <span>With MiniMart AI Platform</span>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#1E2521] font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F6B4F] flex-shrink-0 mt-0.5" />
                <span>Real-time cloud database accessible from your phone anywhere.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F6B4F] flex-shrink-0 mt-0.5" />
                <span>Predictive restock alerts days ahead of weekend sales surges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F6B4F] flex-shrink-0 mt-0.5" />
                <span>AI analyzes margins, product mix, and generates bundle promotions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#1F6B4F] flex-shrink-0 mt-0.5" />
                <span>Automated retention tracking pinpoints inactive buyers for coupons.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Final High-Impact CTA Section */}
      <section className="py-20 bg-gradient-to-b from-[#1F6B4F] to-[#124230] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 text-[#F2A93B] border border-white/20">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-4 text-white">
            Give your retail business an unfair advantage.
          </h2>
          <p className="text-base sm:text-lg text-[#DCEBDD] max-w-xl mx-auto mb-8 leading-relaxed">
            Eliminate stockout losses, optimize product margins, and boost repeat shoppers with MiniMart AI today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#F2A93B] hover:bg-[#E09626] text-slate-950 font-bold text-sm sm:text-base shadow-lg transition-all min-h-[50px]"
            >
              Start Free Store Setup
            </button>
            <button
              onClick={onTryDemo}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 transition-all min-h-[50px]"
            >
              Explore Live Demo Store
            </button>
          </div>
        </div>
      </section>

      {/* 8. Modern Minimalist Footer */}
      <footer className="bg-[#FAF8F3] border-t border-[#E6E2D8] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1F6B4F] flex items-center justify-center text-white font-bold text-xs">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-[#1E2521]">MiniMart AI</span>
            <span className="text-xs text-[#697A71]">© 2026 MiniMart AI.</span>
          </div>
          <p className="text-xs text-[#697A71]">
            Intelligent retail operations & autonomous AI digital store manager.
          </p>
        </div>
      </footer>
    </div>
  );
};
