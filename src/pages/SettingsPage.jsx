// MiniMart AI - Store Settings & AI Configuration Page

import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  User, 
  DollarSign, 
  Sparkles, 
  Bell, 
  RotateCcw, 
  Key, 
  Check, 
  ShieldCheck, 
  LogOut,
  Building,
  Save,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { aiStoreManager } from '../services/ai/AIStoreManager';

export const SettingsPage = () => {
  const { profile, currency, updateProfile, resetDemoData } = useStore();
  const { currentUser, isDemo, logout } = useAuth();
  const { showToast } = useToast();

  const [storeName, setStoreName] = useState(profile?.storeName || 'DailyBasket Supermart');
  const [ownerName, setOwnerName] = useState(profile?.ownerName || 'Store Owner');
  const [businessType, setBusinessType] = useState(profile?.businessType || 'Supermarket / Grocery');
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'INR');
  const [phone, setPhone] = useState(profile?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || profile?.email || 'owner@store.com');
  const [geminiKey, setGeminiKey] = useState(aiStoreManager.getApiKey() || '');
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyDailyDigest, setNotifyDailyDigest] = useState(true);

  const [cashierPin, setCashierPin] = useState(profile?.cashierPin || '1234');
  const [loyaltyRate, setLoyaltyRate] = useState(profile?.loyaltyRate || 20);

  // New branch state
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCity, setNewBranchCity] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');

  const { branches, addBranch } = useStore();

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      storeName,
      ownerName,
      businessType,
      currency: selectedCurrency,
      phone,
      email,
      cashierPin,
      loyaltyRate: Number(loyaltyRate),
    });
  };

  const handleAddBranchSubmit = (e) => {
    e.preventDefault();
    if (!newBranchName || !newBranchCity) return;
    addBranch({
      name: newBranchName,
      city: newBranchCity,
      code: newBranchCode || `BR-${Math.floor(100 + Math.random() * 900)}`,
      isPrimary: false,
    });
    setNewBranchName('');
    setNewBranchCity('');
    setNewBranchCode('');
  };

  const handleSaveAIKey = (e) => {
    e.preventDefault();
    aiStoreManager.setApiKey(geminiKey);
    showToast('AI co-pilot API configuration updated! ✨', 'success');
  };

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR ₹)' },
    { code: 'USD', symbol: '$', name: 'US Dollar (USD $)' },
    { code: 'EUR', symbol: '€', name: 'Euro (EUR €)' },
    { code: 'GBP', symbol: '£', name: 'British Pound (GBP £)' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
          Store Settings & Preferences
        </h2>
        <p className="text-sm text-[#697A71] mt-1">
          Manage your retail business profile, branches, cashier PIN, loyalty rewards, and AI engine.
        </p>
      </div>

      {/* 1. Store Profile & Information */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0ECE1] mb-5">
          <div className="p-2 rounded-xl bg-[#DCEBDD] text-[#1F6B4F]">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E2521]">
              Business Profile
            </h3>
            <p className="text-xs text-[#697A71]">Store identification and storefront details</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Store Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Store Owner Name *
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Business Category
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="input-field appearance-none bg-white"
              >
                <option value="Supermarket / Grocery">Supermarket / Grocery</option>
                <option value="FMCG Retail Outlet">FMCG Retail Outlet</option>
                <option value="Kirana & Convenience">Kirana & Convenience</option>
                <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                <option value="Pharmacy & Personal Care">Pharmacy & Personal Care</option>
                <option value="General Retail Store">General Retail Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Primary Operating Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="input-field appearance-none bg-white font-bold"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Contact Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Notification Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Cashier Mode PIN & Loyalty Settings */}
          <div className="pt-4 border-t border-[#F0ECE1] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Cashier Kiosk Unlock PIN (4 Digits)
              </label>
              <input
                type="password"
                maxLength="4"
                value={cashierPin}
                onChange={(e) => setCashierPin(e.target.value)}
                className="input-field font-mono text-center tracking-widest text-base font-bold"
                placeholder="1234"
              />
              <p className="text-[11px] text-[#8A9A90] mt-1">Used to unlock POS Cashier mode back to Owner Admin.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Loyalty Point Earn Rate
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#697A71]">1 Point for every</span>
                <input
                  type="number"
                  min="5"
                  value={loyaltyRate}
                  onChange={(e) => setLoyaltyRate(e.target.value)}
                  className="input-field w-24 font-bold text-center"
                />
                <span className="text-xs font-semibold text-[#697A71]">{selectedCurrency} spent</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button type="submit" className="btn-primary text-xs font-bold px-5 py-2.5">
              <Save className="w-4 h-4" />
              <span>Save Business Details</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Multi-Store Branch Outlets Manager */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0ECE1] mb-5">
          <div className="p-2 rounded-xl bg-[#EAF3ED] text-[#1F6B4F]">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E2521]">
              Multi-Store Branch Locations
            </h3>
            <p className="text-xs text-[#697A71]">Manage physical supermarket outlets and branch codes</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {(branches || []).map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#EAE6DA] text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1E2521] text-sm">{b.name}</span>
                  {b.isPrimary && (
                    <span className="px-2 py-0.5 rounded-md bg-[#1F6B4F] text-white text-[10px] font-bold uppercase">
                      Primary HQ
                    </span>
                  )}
                </div>
                <p className="text-[#697A71] text-xs mt-0.5">{b.address || b.city} • Code: <strong className="font-mono text-[#1E2521]">{b.code}</strong></p>
              </div>
              <span className="text-emerald-700 font-bold text-xs">Active Outlet</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddBranchSubmit} className="p-4 rounded-2xl bg-white border border-[#DDD7C8] space-y-3">
          <h4 className="font-bold text-xs text-[#1E2521] uppercase tracking-wider">
            + Add New Branch Outlet
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Branch Name (e.g. HSR Layout)"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="input-field text-xs"
            />
            <input
              type="text"
              required
              placeholder="City (e.g. Bengaluru)"
              value={newBranchCity}
              onChange={(e) => setNewBranchCity(e.target.value)}
              className="input-field text-xs"
            />
            <input
              type="text"
              placeholder="Branch Code (e.g. BLR-HSR-04)"
              value={newBranchCode}
              onChange={(e) => setNewBranchCode(e.target.value)}
              className="input-field text-xs font-mono"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="btn-secondary text-xs font-bold py-1.5 px-4">
              Add Store Branch
            </button>
          </div>
        </form>
      </div>

      {/* 3. AI Store Manager Intelligence Settings */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0ECE1] mb-5">
          <div className="p-2 rounded-xl bg-[#FEF6E8] text-[#B06B08]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E2521]">
              AI Store Manager Engine
            </h3>
            <p className="text-xs text-[#697A71]">Configure AI models & live reasoning parameters</p>
          </div>
        </div>

        <form onSubmit={handleSaveAIKey} className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9] space-y-2 text-xs">
            <p className="font-bold text-[#1E2521]">
              🧠 Built-in Analytical Reasoning Engine
            </p>
            <p className="text-[#526259] leading-relaxed">
              MiniMart AI includes a powerful real-time retail intelligence engine that queries your store records directly and formulates exact reorder calculations, margin analyses, and bundle promotions without external keys.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Google Gemini API Key (Optional LLM Upgrade)
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="input-field pl-10 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-[#8A9A90] mt-1">
              Keys are stored securely in your local environment.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="btn-secondary text-xs font-bold px-4 py-2">
              <Check className="w-4 h-4" />
              <span>Update AI Key</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Demo Data Management */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-white to-[#FEFBF4]">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F0ECE1] mb-4">
          <div className="p-2 rounded-xl bg-[#FEF6E8] text-[#B06B08]">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-[#1E2521]">
              Demo Dataset Controls
            </h3>
            <p className="text-xs text-[#697A71]">Reset or reload sample products, orders, and customer data</p>
          </div>
        </div>

        <p className="text-xs text-[#526259] leading-relaxed mb-4">
          Need to test the platform from a clean state? Resetting will reload the full DailyBasket Supermart catalog (16 products, 30+ orders, low stock items, and AI digest data).
        </p>

        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <span className="text-xs font-semibold text-[#8A9A90]">
            Current Store Mode: <strong className="text-[#1F6B4F]">{isDemo ? 'Live Demo Store' : 'Custom Registered Store'}</strong>
          </span>
          <button
            type="button"
            onClick={resetDemoData}
            className="btn-outline text-xs font-bold px-4 py-2 text-[#B06B08] border-[#FCDDB0] hover:bg-[#FEF6E8] min-h-[40px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Store Data</span>
          </button>
        </div>
      </div>

      {/* 4. Session & Logout */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-[#1E2521]">Account Session</h4>
          <p className="text-xs text-[#697A71]">
            Logged in as <strong>{currentUser?.displayName || 'Store Owner'}</strong> ({currentUser?.email || 'demo@minimart.ai'})
          </p>
        </div>
        <button
          onClick={logout}
          className="btn-outline text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 px-4 py-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Store</span>
        </button>
      </div>
    </div>
  );
};
