// MiniMart AI - Signup & Store Profile Creation Page

import React, { useState } from 'react';
import { Store, User, Mail, Lock, Building, DollarSign, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignupPage = ({ onNavigateToLogin, onNavigateToDemo }) => {
  const [formData, setFormData] = useState({
    ownerName: '',
    storeName: '',
    email: '',
    password: '',
    businessType: 'Supermarket / Grocery',
    currency: 'INR',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const { showToast } = useToast();

  const businessTypes = [
    'Supermarket / Grocery',
    'Kirana / Convenience Store',
    'FMCG Retail Outlet',
    'Bakery & Confectionery',
    'Pharmacy & Personal Care',
    'General Retail Store',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.storeName || !formData.email || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    const res = await signup(formData);
    setLoading(false);
    if (res.success) {
      showToast(`Welcome to MiniMart AI! Store "${formData.storeName}" created 🎉`, 'success');
    } else {
      setError(res.error || 'Failed to create store. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1F6B4F] flex items-center justify-center text-white mx-auto shadow-md mb-4">
          <Store className="w-7 h-7" />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
          Create Your Store on MiniMart AI
        </h2>
        <p className="mt-1.5 text-sm text-[#697A71]">
          Setup your retail business and unlock your intelligent AI store manager.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="card p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                  Owner Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Nihar Puthran"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                  Store Name *
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    placeholder="e.g. DailyMart Indiranagar"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                  Business Type
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="input-field pl-10 appearance-none bg-white"
                  >
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                  Currency
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="input-field pl-10 appearance-none bg-white"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="AED">AED - UAE Dirham</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="owner@yourstore.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Password (min 6 chars) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-sm font-bold mt-3 py-3"
            >
              {loading ? 'Creating Store...' : 'Complete Registration & Open Store'}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-[#EFECE2] flex flex-col gap-2">
            <p className="text-xs text-[#697A71]">
              Already registered?{' '}
              <button
                onClick={onNavigateToLogin}
                className="font-bold text-[#1F6B4F] hover:underline"
              >
                Sign In here →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
