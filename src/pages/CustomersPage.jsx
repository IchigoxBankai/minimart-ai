// MiniMart AI - Customer Directory & Retention Analytics Page

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserX,
  Award
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../utils/formatters';

export const CustomersPage = ({ onOpenAIMessage }) => {
  const { customers, orders, addCustomer, updateCustomer, currency } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, ACTIVE, INACTIVE, VIP
  
  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // New customer form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: '',
    status: 'Active',
  });

  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const inactiveCount = customers.filter((c) => c.status === 'Inactive').length;
  const totalCustomerSpend = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
  const totalOrders = customers.reduce((sum, c) => sum + (c.totalOrders || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalCustomerSpend / totalOrders) : 380;

  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q);

        if (!matchesQuery) return false;

        if (filterTab === 'ACTIVE') return c.status === 'Active';
        if (filterTab === 'INACTIVE') return c.status === 'Inactive';
        if (filterTab === 'VIP') return c.totalSpent >= 4000;

        return true;
      })
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
  }, [customers, searchQuery, filterTab]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    addCustomer({
      ...formData,
      totalOrders: 0,
      totalSpent: 0,
      lastPurchaseDate: new Date().toISOString(),
    });

    setIsAddOpen(false);
    setFormData({ name: '', phone: '', email: '', notes: '', status: 'Active' });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
            Customer Directory
          </h2>
          <p className="text-sm text-[#697A71] mt-1">
            Build customer loyalty, monitor repeat visits, and re-engage inactive buyers.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-primary text-sm font-bold shadow-md shadow-[#1F6B4F]/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* 4 Retention Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between text-xs text-[#697A71] font-semibold">
            <span>Total Shoppers</span>
            <Users className="w-4 h-4 text-[#1F6B4F]" />
          </div>
          <p className="font-display font-bold text-2xl text-[#1E2521] mt-2">
            {customers.length}
          </p>
          <p className="text-[11px] text-[#8A9A90] mt-1">Directory size</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between text-xs text-[#156B3A] font-semibold">
            <span>Active Shoppers</span>
            <UserCheck className="w-4 h-4 text-[#156B3A]" />
          </div>
          <p className="font-display font-bold text-2xl text-[#156B3A] mt-2">
            {activeCount}
          </p>
          <p className="text-[11px] text-[#156B3A] mt-1">Visited in last 30d</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between text-xs text-[#B06B08] font-semibold">
            <span>Inactive Lapsed</span>
            <UserX className="w-4 h-4 text-[#F2A93B]" />
          </div>
          <p className="font-display font-bold text-2xl text-[#B06B08] mt-2">
            {inactiveCount}
          </p>
          <p className="text-[11px] text-[#B06B08] mt-1">No visit in 30+ days</p>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between text-xs text-[#1F6B4F] font-semibold">
            <span>Average Ticket (AOV)</span>
            <DollarSign className="w-4 h-4 text-[#1F6B4F]" />
          </div>
          <p className="font-display font-bold text-2xl text-[#1F6B4F] mt-2">
            {formatCurrency(avgOrderValue, currency)}
          </p>
          <p className="text-[11px] text-[#8A9A90] mt-1">Per transaction average</p>
        </div>
      </div>

      {/* AI Customer Re-engagement Banner */}
      {inactiveCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EAF3ED] to-[#FAF8F3] border border-[#CDE1D3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1F6B4F] text-[#F2A93B] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1F6B4F] uppercase tracking-wider">
                AI Customer Retention Insight
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#1E2521] mt-0.5">
                {inactiveCount} customers haven't purchased in 30+ days. Send an AI win-back promotion with a 10% discount.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenAIMessage('Which customers haven\'t purchased recently and need re-engagement?')}
            className="btn-primary text-xs font-bold whitespace-nowrap min-h-[40px] px-4"
          >
            Ask AI Manager to Re-engage →
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer by name, mobile phone, or email..."
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'ALL', label: `All Shoppers (${customers.length})` },
              { id: 'ACTIVE', label: `Active (${activeCount})` },
              { id: 'INACTIVE', label: `Inactive (${inactiveCount})` },
              { id: 'VIP', label: 'VIP / Gold / Platinum' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap min-h-[38px] ${
                  filterTab === tab.id
                    ? 'bg-[#1F6B4F] text-white shadow-xs'
                    : 'bg-[#F2EFE7] text-[#526259] hover:bg-[#EAE6DB]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customers List: Desktop Table & Mobile Cards */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers match your filter"
          description="Try clearing your search query or add a new customer to your database."
          actionLabel="Add Customer"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF8F3] text-[#697A71] text-xs font-bold uppercase tracking-wider border-b border-[#EBE7DC]">
                  <tr>
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Phone / Contact</th>
                    <th className="py-3.5 px-4">Loyalty Tier & Pts</th>
                    <th className="py-3.5 px-4">Total Orders</th>
                    <th className="py-3.5 px-4">Lifetime Spend</th>
                    <th className="py-3.5 px-4">Last Purchase</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE7]">
                  {filteredCustomers.map((cust) => {
                    const tier = cust.loyaltyTier || (cust.totalSpent >= 10000 ? 'Platinum' : cust.totalSpent >= 5000 ? 'Gold' : cust.totalSpent >= 2500 ? 'Silver' : 'Bronze');
                    const tierColor =
                      tier === 'Platinum'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : tier === 'Gold'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : tier === 'Silver'
                        ? 'bg-slate-100 text-slate-800 border-slate-200'
                        : 'bg-amber-50 text-amber-900 border-amber-100';

                    return (
                      <tr
                        key={cust.id}
                        onClick={() => setSelectedCustomer(cust)}
                        className="hover:bg-[#FAF8F3]/70 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-[#DCEBDD] text-[#1F6B4F] font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {cust.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E2521]">{cust.name}</p>
                              <p className="text-xs text-[#8A9A90]">{cust.email || '—'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-xs text-[#526259]">
                          {cust.phone || '—'}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${tierColor}`}>
                              {tier}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#1F6B4F]">
                              {cust.loyaltyPoints || Math.floor((cust.totalSpent || 0) / 20)} pts
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-[#1E2521]">
                          {cust.totalOrders || 0} orders
                        </td>

                        <td className="py-3 px-4 font-display font-bold text-base text-[#1E2521]">
                          {formatCurrency(cust.totalSpent || 0, currency)}
                        </td>

                        <td className="py-3 px-4 text-xs text-[#697A71]">
                          {formatDate(cust.lastPurchaseDate, 'relative')}
                        </td>

                        <td className="py-3 px-4">
                          {cust.status === 'Active' ? (
                            <Badge variant="success">Active</Badge>
                          ) : cust.status === 'Inactive' ? (
                            <Badge variant="warning">Inactive (&gt;30d)</Badge>
                          ) : (
                            <Badge variant="info">New</Badge>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(cust);
                            }}
                            className="btn-outline text-xs font-bold px-3 py-1 min-h-[36px]"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomer(cust)}
                className="card p-4 flex flex-col justify-between cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#DCEBDD] text-[#1F6B4F] font-bold text-base flex items-center justify-center flex-shrink-0">
                    {cust.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-[#1E2521] truncate">
                        {cust.name}
                      </h4>
                      {cust.status === 'Active' ? (
                        <Badge variant="success" size="sm">Active</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Inactive</Badge>
                      )}
                    </div>
                    <p className="text-xs text-[#697A71] mt-0.5">{cust.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#8A9A90]">
                      Last visit: {formatDate(cust.lastPurchaseDate, 'relative')}
                    </p>
                    <p className="font-display font-bold text-base text-[#1E2521]">
                      {formatCurrency(cust.totalSpent || 0, currency)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(cust);
                    }}
                    className="btn-outline text-xs font-bold px-3 py-1.5 min-h-[44px]"
                  >
                    View History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Customer to Directory"
        subtitle="Record contact details and preferences for order tracking"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Customer Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98201 00000"
                className="input-field pl-10 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
              Customer Notes / Preferences
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Morning shopper, prefers UPI, favorite brands..."
              className="input-field resize-none py-2"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EFECE2]">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Customer
            </button>
          </div>
        </form>
      </Modal>

      {/* Customer Profile & Purchase History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.name}
          subtitle={`Customer ID: ${selectedCustomer.id} | Phone: ${selectedCustomer.phone || 'N/A'}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9]">
                <p className="text-xs text-[#697A71]">Total Spending</p>
                <p className="font-display font-bold text-lg text-[#1F6B4F] mt-1">
                  {formatCurrency(selectedCustomer.totalSpent || 0, currency)}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9]">
                <p className="text-xs text-[#697A71]">Total Orders</p>
                <p className="font-display font-bold text-lg text-[#1E2521] mt-1">
                  {selectedCustomer.totalOrders || 0}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-[#E8E4D9]">
                <p className="text-xs text-[#697A71]">Avg Ticket</p>
                <p className="font-display font-bold text-lg text-[#1E2521] mt-1">
                  {formatCurrency(
                    selectedCustomer.totalOrders > 0
                      ? Math.round(selectedCustomer.totalSpent / selectedCustomer.totalOrders)
                      : 0,
                    currency
                  )}
                </p>
              </div>
            </div>

            {/* Notes & Status */}
            <div className="p-4 rounded-2xl bg-white border border-[#EAE6DB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#425149]">Retention Status:</span>
                {selectedCustomer.status === 'Active' ? (
                  <Badge variant="success">Active Shopper</Badge>
                ) : (
                  <Badge variant="warning">Inactive (&gt;30 days)</Badge>
                )}
              </div>
              <p className="text-xs text-[#526259]">
                <strong>Notes:</strong> {selectedCustomer.notes || 'Standard retail customer.'}
              </p>
              {selectedCustomer.preferredCategories?.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#697A71]">Favorites:</span>
                  {selectedCustomer.preferredCategories.map((cat, i) => (
                    <span key={i} className="text-[10px] bg-[#EAF3ED] text-[#1F6B4F] px-2 py-0.5 rounded-full font-bold">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Recommendation for this customer */}
            <div className="p-3.5 rounded-2xl bg-[#FEF6E8] border border-[#FCDDB0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#526259]">
                <Sparkles className="w-4 h-4 text-[#F2A93B] flex-shrink-0" />
                <span>
                  {selectedCustomer.status === 'Inactive'
                    ? 'Recommended: Send a personalized 10% re-activation coupon.'
                    : 'Recommended: Target with new Beverage arrivals.'}
                </span>
              </div>
            </div>

            {/* Loyalty Points & Membership Tier Status Card */}
            <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E2DDD0] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E2521] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#1F6B4F]" />
                  Loyalty Points Balance
                </span>
                <span className="font-mono text-sm font-black text-[#1F6B4F]">
                  {selectedCustomer.loyaltyPoints || Math.floor((selectedCustomer.totalSpent || 0) / 20)} Points
                </span>
              </div>

              {/* Tier Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#697A71] font-semibold">
                  <span>Current Tier: <strong className="text-[#1E2521]">{selectedCustomer.loyaltyTier || 'Bronze'}</strong></span>
                  <span>Next: <strong>Gold (₹5,000)</strong></span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5E0D4] overflow-hidden">
                  <div
                    className="h-full bg-[#1F6B4F] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round(((selectedCustomer.totalSpent || 0) / 5000) * 100))}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-[#8A9A90] text-right">
                  {Math.min(100, Math.round(((selectedCustomer.totalSpent || 0) / 5000) * 100))}% towards Gold Tier rewards
                </p>
              </div>
            </div>

            {/* WhatsApp Winback Campaign Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  const cust = selectedCustomer;
                  const phoneNum = cust.phone ? cust.phone.replace(/[^0-9]/g, '') : '';
                  const msg = `Hello ${cust.name}! 😊 We noticed it's been a while since your last visit to DailyBasket Supermart. Here is a special *10% OFF discount coupon (CODE: WELCOMEBACK10)* for your next store visit! We look forward to seeing you soon.`;
                  const url = phoneNum
                    ? `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`
                    : `https://wa.me/?text=${encodeURIComponent(msg)}`;
                  window.open(url, '_blank');
                }}
                className="w-full btn-secondary text-xs font-bold py-2.5 bg-[#E4F5E9] text-[#156B3A] hover:bg-[#D0EED8] flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>💬 Send 10% Win-back Coupon via WhatsApp</span>
              </button>
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
              className="w-full btn-outline mt-2"
            >
              Close Profile
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
