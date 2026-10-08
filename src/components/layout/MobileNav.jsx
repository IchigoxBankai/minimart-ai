// MiniMart AI - Mobile Bottom Navigation & Slide-up Drawer

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Sparkles, 
  Menu, 
  X, 
  Package, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  LogOut,
  Store,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = ({ activePage, setActivePage }) => {
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const { metrics, profile, isCashierMode } = useStore();
  const { currentUser, isDemo, logout } = useAuth();

  const handleSelect = (pageId) => {
    if (isCashierMode && pageId !== 'orders') return;
    setActivePage(pageId);
    setMoreDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const moreItems = [
    { id: 'products', label: 'Products Catalog', icon: Package, desc: 'Manage catalog & pricing' },
    { id: 'customers', label: 'Customers', icon: Users, desc: 'Directory & lifetime spending' },
    { id: 'analytics', label: 'Analytics & Trends', icon: BarChart3, desc: 'Sales, margins & category stats' },
    { id: 'reports', label: 'Business Reports', icon: FileText, desc: 'Download PDF / CSV summaries' },
    { id: 'settings', label: 'Settings', icon: Settings, desc: 'Store profile & currency' },
  ];

  return (
    <>
      {/* Slide-up "More" Drawer Overlay */}
      {moreDrawerOpen && !isCashierMode && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity lg:hidden animate-fade-in"
          onClick={() => setMoreDrawerOpen(false)}
        >
          <div 
            className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-[#F7F5EF] rounded-t-3xl border-t border-[#E2DDD0] shadow-2xl p-5 overflow-y-auto animate-slide-up z-50 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-[#D2CCBC] rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1F6B4F] flex items-center justify-center text-white font-bold">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#1E2521] leading-tight">
                    {profile?.storeName || 'DailyBasket Supermart'}
                  </h3>
                  <p className="text-xs text-[#697A71]">Store Management Suite</p>
                </div>
              </div>
              <button
                onClick={() => setMoreDrawerOpen(false)}
                className="p-2 rounded-full bg-white border border-[#E3DFD5] text-[#697A71] hover:text-[#1E2521] min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Grid / List */}
            <div className="space-y-2 py-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left min-h-[48px] ${
                      isActive
                        ? 'bg-white border-[#1F6B4F] shadow-sm text-[#1F6B4F]'
                        : 'bg-white border-[#E6E1D4] text-[#1E2521] hover:bg-[#FAF8F3]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? 'bg-[#DCEBDD] text-[#1F6B4F]' : 'bg-[#F2EFE7] text-[#526259]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${isActive ? 'text-[#1F6B4F]' : 'text-[#1E2521]'}`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-[#697A71]">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A1AEA7]" />
                  </button>
                );
              })}
            </div>

            {/* User Session & Logout */}
            <div className="mt-4 pt-3 border-t border-[#E8E3D5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#1F6B4F] text-white font-bold text-xs flex items-center justify-center">
                  {currentUser?.displayName?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1E2521]">{currentUser?.displayName || 'Store Owner'}</p>
                  <p className="text-[10px] text-[#697A71]">{isDemo ? 'Demo Mode' : currentUser?.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setMoreDrawerOpen(false);
                  logout();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E0D4] z-40 px-2 py-1.5 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Home / Dashboard */}
          <button
            disabled={isCashierMode}
            onClick={() => handleSelect('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[56px] min-h-[44px] transition-all ${
              isCashierMode ? 'opacity-30 cursor-not-allowed' : activePage === 'dashboard' ? 'text-[#1F6B4F] font-bold' : 'text-[#697A71] font-medium'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* 2. Orders */}
          <button
            onClick={() => handleSelect('orders')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[56px] min-h-[44px] relative transition-all ${
              activePage === 'orders' ? 'text-[#1F6B4F] font-bold' : 'text-[#697A71] font-medium'
            }`}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">POS</span>
            {metrics?.todayOrdersCount > 0 && (
              <span className="absolute top-1 right-2.5 w-4 h-4 bg-[#1F6B4F] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {metrics.todayOrdersCount > 9 ? '9+' : metrics.todayOrdersCount}
              </span>
            )}
          </button>

          {/* 3. AI Store Manager (Floating Centerpiece) */}
          <button
            disabled={isCashierMode}
            onClick={() => handleSelect('ai-manager')}
            className={`flex flex-col items-center justify-center -mt-5 relative group min-h-[44px] ${isCashierMode ? 'opacity-30 cursor-not-allowed' : ''}`}
            aria-label="Open AI Store Manager"
          >
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
              activePage === 'ai-manager'
                ? 'bg-gradient-to-tr from-[#1F6B4F] to-[#2BA678] text-white ring-4 ring-[#DCEBDD]'
                : 'bg-gradient-to-tr from-[#1F6B4F] to-[#16523C] text-white shadow-[#1F6B4F]/30 ring-2 ring-white'
            }`}>
              <Sparkles className="w-6 h-6 text-[#F2A93B] animate-pulse" />
            </div>
            <span className={`text-[10px] font-bold mt-1 ${
              activePage === 'ai-manager' ? 'text-[#1F6B4F]' : 'text-[#1E2521]'
            }`}>
              AI Manager
            </span>
          </button>

          {/* 4. Inventory */}
          <button
            disabled={isCashierMode}
            onClick={() => handleSelect('inventory')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[56px] min-h-[44px] relative transition-all ${
              isCashierMode ? 'opacity-30 cursor-not-allowed' : activePage === 'inventory' ? 'text-[#1F6B4F] font-bold' : 'text-[#697A71] font-medium'
            }`}
          >
            <Boxes className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Inventory</span>
            {metrics?.lowStockCount > 0 && !isCashierMode && (
              <span className="absolute top-1 right-2.5 w-4 h-4 bg-[#F2A93B] text-slate-950 text-[9px] font-bold rounded-full flex items-center justify-center">
                {metrics.lowStockCount}
              </span>
            )}
          </button>

          {/* 5. More Menu Drawer */}
          <button
            disabled={isCashierMode}
            onClick={() => setMoreDrawerOpen(true)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[56px] min-h-[44px] transition-all ${
              isCashierMode ? 'opacity-30 cursor-not-allowed' : moreItems.some((i) => i.id === activePage) ? 'text-[#1F6B4F] font-bold' : 'text-[#697A71] font-medium'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </div>
    </>
  );
};
