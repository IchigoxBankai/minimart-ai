// MiniMart AI - Desktop Sidebar Component

import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Package, 
  Users, 
  BarChart3, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut,
  Store,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activePage, setActivePage }) => {
  const { metrics, profile } = useStore();
  const { currentUser, isDemo, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: metrics?.todayOrdersCount > 0 ? metrics.todayOrdersCount : null },
    { id: 'inventory', label: 'Inventory', icon: Boxes, badge: metrics?.lowStockCount > 0 ? metrics.lowStockCount : null, badgeVariant: 'warning' },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-manager', label: 'AI Store Manager', icon: Sparkles, highlight: true },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#E6E2D8] h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#EFECE2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1F6B4F] flex items-center justify-center shadow-sm text-white">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg text-[#1E2521] tracking-tight">MiniMart</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#DCEBDD] text-[#1F6B4F] text-[10px] font-extrabold uppercase tracking-wider">AI</span>
            </div>
            <p className="text-xs text-[#697A71] font-medium truncate max-w-[130px]">
              {profile?.storeName || 'DailyBasket Supermart'}
            </p>
          </div>
        </div>
      </div>

      {/* Demo Mode Banner (if active) */}
      {isDemo && (
        <div className="mx-4 mt-3 px-3 py-1.5 rounded-xl bg-[#FEF6E8] border border-[#FCDDB0] flex items-center justify-between text-xs text-[#B06B08] font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F2A93B] animate-ping" />
            Demo Store Active
          </span>
          <span className="text-[10px] font-bold uppercase bg-[#F2A93B]/20 px-1.5 py-0.5 rounded">Live</span>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold text-[#8A9A90] uppercase tracking-wider flex items-center justify-between">
          <span>{isCashierMode ? 'Cashier Station' : 'Store Operations'}</span>
          {isCashierMode && <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">PIN Protected</span>}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const isLockedInCashier = isCashierMode && item.id !== 'orders';

          if (item.highlight) {
            return (
              <div key={item.id} className="pt-2 pb-2">
                <button
                  disabled={isLockedInCashier}
                  onClick={() => !isLockedInCashier && setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                    isLockedInCashier
                      ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                      : isActive
                      ? 'bg-gradient-to-r from-[#1F6B4F] to-[#16523C] text-white shadow-md shadow-[#1F6B4F]/20'
                      : 'bg-gradient-to-r from-[#EAF3ED] to-[#FAF8F3] text-[#1F6B4F] border border-[#CDE1D3] hover:border-[#1F6B4F]/40 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-[#1F6B4F] text-white'}`}>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F2A93B] text-slate-950'
                  }`}>
                    PRO
                  </span>
                </button>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              disabled={isLockedInCashier}
              onClick={() => !isLockedInCashier && setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                isLockedInCashier
                  ? 'opacity-35 cursor-not-allowed text-gray-400'
                  : isActive
                  ? 'bg-[#EAF3ED] text-[#1F6B4F] font-semibold shadow-xs'
                  : 'text-[#425149] hover:bg-[#F7F5EF] hover:text-[#1E2521]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1F6B4F]' : 'text-[#697A71]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && !isLockedInCashier && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  item.badgeVariant === 'warning'
                    ? 'bg-[#FEF6E8] text-[#B06B08]'
                    : 'bg-[#DCEBDD] text-[#1F6B4F]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Card */}
      <div className="p-4 border-t border-[#EFECE2]">
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF8F3] border border-[#EBE7DC]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#1F6B4F] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'O'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1E2521] truncate">
                {currentUser?.displayName || 'Store Owner'}
              </p>
              <p className="text-[11px] text-[#697A71] truncate">
                {profile?.businessType || 'Retail Owner'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 text-[#697A71] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
