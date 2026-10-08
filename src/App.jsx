// MiniMart AI - Root Application & View Router

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AIManagerPage } from './pages/AIManagerPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

function AppContent() {
  const { isAuthenticated, loginAsDemo } = useAuth();
  
  // Public view navigation: 'landing', 'login', 'signup'
  const [publicView, setPublicView] = useState('landing');
  
  // Authenticated internal app page: 'dashboard', 'orders', 'inventory', 'products', 'customers', 'analytics', 'ai-manager', 'reports', 'settings'
  const [activePage, setActivePage] = useState('dashboard');
  
  // Context state passed across views
  const [aiInitialPrompt, setAiInitialPrompt] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenAIMessage = (prompt) => {
    setAiInitialPrompt(prompt);
    setActivePage('ai-manager');
  };

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setActivePage('orders');
  };

  // If user is not logged in
  if (!isAuthenticated) {
    if (publicView === 'login') {
      return (
        <LoginPage
          onNavigateToSignup={() => setPublicView('signup')}
          onNavigateToDemo={() => loginAsDemo()}
        />
      );
    }
    if (publicView === 'signup') {
      return (
        <SignupPage
          onNavigateToLogin={() => setPublicView('login')}
          onNavigateToDemo={() => loginAsDemo()}
        />
      );
    }
    return (
      <LandingPage
        onGetStarted={() => setPublicView('signup')}
        onTryDemo={() => loginAsDemo()}
        onLogin={() => setPublicView('login')}
      />
    );
  }

  // Authenticated Store Operating Environment
  return (
    <AppLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onOpenAIMessage={handleOpenAIMessage}
      onSelectSearchItem={(order) => setSelectedOrder(order)}
    >
      {activePage === 'dashboard' && (
        <DashboardPage
          onNavigate={setActivePage}
          onOpenAIMessage={handleOpenAIMessage}
          onSelectOrder={handleSelectOrder}
        />
      )}

      {activePage === 'orders' && (
        <OrdersPage
          selectedOrderFromDashboard={selectedOrder}
          onClearSelectedOrder={() => setSelectedOrder(null)}
        />
      )}

      {activePage === 'inventory' && <InventoryPage />}

      {activePage === 'products' && <ProductsPage />}

      {activePage === 'customers' && (
        <CustomersPage onOpenAIMessage={handleOpenAIMessage} />
      )}

      {activePage === 'analytics' && (
        <AnalyticsPage onOpenAIMessage={handleOpenAIMessage} />
      )}

      {activePage === 'ai-manager' && (
        <AIManagerPage
          initialPrompt={aiInitialPrompt}
          onClearInitialPrompt={() => setAiInitialPrompt(null)}
          onNavigate={setActivePage}
        />
      )}

      {activePage === 'reports' && <ReportsPage />}

      {activePage === 'settings' && <SettingsPage />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
