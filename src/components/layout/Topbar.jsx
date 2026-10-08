// MiniMart AI - Responsive Topbar Header with Branch Switcher, Cashier Mode, and Hotkeys

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  RotateCcw, 
  Sparkles, 
  Store, 
  Check, 
  ChevronDown, 
  ExternalLink,
  ShieldCheck,
  Lock,
  Unlock,
  Banknote,
  Keyboard,
  Building2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { NotificationDrawer } from './NotificationDrawer';
import { CashierLockModal } from '../pos/CashierLockModal';
import { CashDrawerModal } from '../pos/CashDrawerModal';
import { HotkeysModal } from '../common/HotkeysModal';

export const Topbar = ({ onOpenSearch, activePage, setActivePage }) => {
  const { 
    notifications, 
    profile, 
    currency, 
    updateProfile, 
    resetDemoData,
    branches,
    activeBranch,
    activeBranchId,
    setActiveBranchId,
    isCashierMode,
    setIsCashierMode,
    isOnline,
    isHotkeysOpen,
    setIsHotkeysOpen,
  } = useStore();
  const { currentUser, isDemo } = useAuth();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  
  // Modals
  const [isCashierModalOpen, setIsCashierModalOpen] = useState(false);
  const [isCashDrawerOpen, setIsCashDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  ];

  const handleCurrencySelect = (code) => {
    updateProfile({ currency: code });
    setShowCurrencyMenu(false);
  };

  const getPageTitle = () => {
    if (isCashierMode) return 'POS Cashier Mode (Locked)';
    switch (activePage) {
      case 'dashboard': return 'Store Dashboard';
      case 'orders': return 'Orders & POS Checkout';
      case 'inventory': return 'Inventory & Stock';
      case 'products': return 'Product Catalog';
      case 'customers': return 'Customer Directory';
      case 'analytics': return 'Analytics & Trends';
      case 'ai-manager': return 'AI Store Manager';
      case 'reports': return 'Business Reports';
      case 'settings': return 'Store Settings';
      default: return 'Store Dashboard';
    }
  };

  const handleToggleCashierMode = () => {
    if (isCashierMode) {
      // In Cashier mode -> prompt for PIN to unlock
      setIsCashierModalOpen(true);
    } else {
      // Lock into Cashier Mode -> switch to orders page
      setIsCashierMode(true);
      setActivePage('orders');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF8F3]/95 backdrop-blur-md border-b border-[#E6E2D8] px-3 sm:px-6 py-2.5 transition-all">
        <div className="flex items-center justify-between gap-2 sm:gap-3 max-w-7xl mx-auto">
          {/* Left: Mobile Brand & Page Title / Branch Switcher */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1F6B4F] flex items-center justify-center text-white font-bold shadow-xs">
                <Store className="w-4 h-4" />
              </div>
              <span className="font-display font-bold text-sm text-[#1E2521]">MiniMart</span>
            </div>

            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-lg text-[#1E2521] leading-tight">
                  {getPageTitle()}
                </h1>
                {isCashierMode && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
                    LOCKED
                  </span>
                )}
              </div>

              {/* Branch Selector Dropdown */}
              <div className="relative inline-block mt-0.5">
                <button
                  onClick={() => setShowBranchMenu(!showBranchMenu)}
                  className="flex items-center gap-1.5 text-xs text-[#526259] hover:text-[#1F6B4F] font-medium transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#1F6B4F]" />
                  <span className="font-semibold text-[#1E2521]">{activeBranch?.name || 'Indiranagar Flagship'}</span>
                  <ChevronDown className="w-3 h-3 text-[#8A9A90]" />
                </button>

                {showBranchMenu && (
                  <div 
                    className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-[#E6E2D8] py-1.5 z-50 animate-slide-up"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-[#8A9A90] uppercase tracking-wider border-b border-[#F0ECE1]">
                      Switch Store Location
                    </div>
                    {branches.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setActiveBranchId(b.id);
                          setShowBranchMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#F7F5EF] text-[#1E2521] transition-colors"
                      >
                        <div>
                          <span className="font-bold block">{b.name}</span>
                          <span className="text-[10px] text-[#8A9A90] block">{b.city} • {b.code}</span>
                        </div>
                        {activeBranchId === b.id && <Check className="w-4 h-4 text-[#1F6B4F]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center: Global Search Trigger */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-4">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3 py-1.5 sm:py-2 bg-white rounded-xl border border-[#DCD6C8] hover:border-[#1F6B4F]/40 shadow-2xs hover:shadow-xs transition-all text-left text-sm min-h-[38px]"
              aria-label="Search store products, orders, and customers"
            >
              <div className="flex items-center gap-2 text-[#697A71] truncate">
                <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8A9A90] flex-shrink-0" />
                <span className="truncate text-xs">Search items, orders, shoppers...</span>
              </div>
              <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-[#697A71] bg-[#F2EFE7] rounded border border-[#DDD7C8]">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Online/Offline Status Indicator */}
            <div 
              title={isOnline ? 'Online • Cloud Sync Live' : 'Offline • Local POS Cache Active'}
              className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
              <span className="hidden md:inline">{isOnline ? 'Live' : 'Offline'}</span>
            </div>

            {/* Cash Register Drawer Modal Trigger */}
            <button
              onClick={() => setIsCashDrawerOpen(true)}
              title="Open Cash Drawer & Day-End Z-Report"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-[#E3DFD5] text-xs font-bold text-[#1E2521] hover:bg-[#F7F5EF] hover:border-[#1F6B4F]/40 transition-all min-h-[38px]"
            >
              <Banknote className="w-4 h-4 text-[#1F6B4F]" />
              <span className="hidden md:inline">Cash Drawer</span>
            </button>

            {/* Cashier Mode Lock / Unlock Toggle */}
            <button
              onClick={handleToggleCashierMode}
              title={isCashierMode ? 'Exit Cashier Mode (PIN required)' : 'Lock into Cashier Mode'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] border ${
                isCashierMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-[#526259] border-[#E3DFD5] hover:text-[#1F6B4F] hover:bg-[#F7F5EF]'
              }`}
            >
              {isCashierMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCashierMode ? 'Cashier Mode' : 'Lock POS'}</span>
            </button>

            {/* Keyboard Shortcuts Trigger (?) */}
            <button
              onClick={() => setIsHotkeysOpen(true)}
              title="Keyboard Shortcuts Cheatsheet (?)"
              className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-white border border-[#E3DFD5] text-[#526259] hover:text-[#1F6B4F] hover:bg-[#F7F5EF] transition-all min-h-[38px] min-w-[38px]"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Quick Demo Reset Button (if in demo mode) */}
            {isDemo && !isCashierMode && (
              <button
                onClick={resetDemoData}
                title="Reset Demo Dataset"
                className="hidden xl:inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-[#E3DFD5] text-xs font-semibold text-[#526259] hover:text-[#1F6B4F] hover:bg-[#F2EFE7] transition-all min-h-[38px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Currency Switcher */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCurrencyMenu(!showCurrencyMenu);
                  setShowNotifications(false);
                  setShowBranchMenu(false);
                }}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white border border-[#E3DFD5] text-xs font-bold text-[#1E2521] hover:bg-[#F7F5EF] transition-all min-h-[38px]"
                aria-label="Select store currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#697A71]" />
              </button>

              {showCurrencyMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-dropdown border border-[#E6E2D8] py-1 z-50 animate-slide-up"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#8A9A90] uppercase tracking-wider border-b border-[#F0ECE1]">
                    Select Currency
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => handleCurrencySelect(c.code)}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left hover:bg-[#F7F5EF] text-[#1E2521]"
                    >
                      <span>{c.symbol} {c.name} ({c.code})</span>
                      {currency === c.code && <Check className="w-3.5 h-3.5 text-[#1F6B4F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Bell (Hidden if in cashier mode) */}
            {!isCashierMode && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowCurrencyMenu(false);
                    setShowBranchMenu(false);
                  }}
                  className="relative p-2 rounded-xl bg-white border border-[#E3DFD5] text-[#526259] hover:text-[#1F6B4F] hover:bg-[#F7F5EF] transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationDrawer
                    onClose={() => setShowNotifications(false)}
                    onNavigate={(route) => {
                      setShowNotifications(false);
                      if (route === '/inventory') setActivePage('inventory');
                      else if (route === '/orders') setActivePage('orders');
                      else if (route === '/customers') setActivePage('customers');
                      else if (route === '/reports') setActivePage('reports');
                      else if (route === '/dashboard') setActivePage('dashboard');
                    }}
                  />
                )}
              </div>
            )}

            {/* Mobile Owner Avatar */}
            {!isCashierMode && (
              <button
                onClick={() => setActivePage('settings')}
                className="lg:hidden w-8 h-8 rounded-xl bg-[#1F6B4F] text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
                aria-label="Open settings"
              >
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'N'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Cashier Unlock PIN Modal */}
      <CashierLockModal
        isOpen={isCashierModalOpen}
        onClose={() => setIsCashierModalOpen(false)}
        onUnlocked={() => setIsCashierMode(false)}
      />

      {/* Cash Drawer Reconciliation Modal */}
      <CashDrawerModal
        isOpen={isCashDrawerOpen}
        onClose={() => setIsCashDrawerOpen(false)}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <HotkeysModal
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
      />
    </>
  );
};

