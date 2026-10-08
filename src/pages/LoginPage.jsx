// MiniMart AI - Login Page

import React, { useState } from 'react';
import { Store, Sparkles, ArrowRight, Lock, Mail, AlertCircle, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const LoginPage = ({ onNavigateToSignup, onNavigateToDemo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginAsDemo } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      showToast(`Welcome back, ${res.user.displayName}! 👋`, 'success');
    } else {
      setError(res.error || 'Invalid credentials. Try demo mode or create a new store.');
    }
  };

  const handleQuickDemo = () => {
    loginAsDemo();
    showToast('Logged into DailyBasket Supermart (Demo Mode) ✨', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1F6B4F] flex items-center justify-center text-white mx-auto shadow-md mb-4">
          <Store className="w-7 h-7" />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1E2521] tracking-tight">
          Welcome back to MiniMart AI
        </h2>
        <p className="mt-2 text-sm text-[#697A71]">
          Sign in to access your store dashboard and AI manager.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Login */}
          <div className="mb-6 p-4 rounded-2xl bg-[#FEF6E8] border border-[#FCDDB0]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#B06B08]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Immediate Exploration</span>
              </div>
              <span className="text-[10px] font-extrabold bg-[#F2A93B]/20 text-[#B06B08] px-2 py-0.5 rounded-full uppercase">
                1-Click
              </span>
            </div>
            <p className="text-xs text-[#526259] mb-3">
              Explore the full system with pre-loaded realistic store data:
            </p>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full btn-accent text-xs font-bold py-2.5 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch DailyBasket Demo Store</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EBE7DC]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#8A9A90] font-semibold">Or sign in with account</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourstore.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#425149] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-sm font-bold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Store'}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-[#EFECE2]">
            <p className="text-xs text-[#697A71]">
              Don't have a store account yet?{' '}
              <button
                onClick={onNavigateToSignup}
                className="font-bold text-[#1F6B4F] hover:underline"
              >
                Create your store now →
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
