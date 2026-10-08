// MiniMart AI - App Layout Wrapper

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from './GlobalSearchModal';

export const AppLayout = ({ activePage, setActivePage, onOpenAIMessage, onSelectSearchItem, children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSelect = (category, item) => {
    if (category === 'OPEN_SEARCH') {
      setIsSearchOpen(true);
      return;
    }
    if (category === 'products') {
      setActivePage('products');
    } else if (category === 'orders') {
      setActivePage('orders');
      if (onSelectSearchItem) onSelectSearchItem(item);
    } else if (category === 'customers') {
      setActivePage('customers');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col lg:flex-row text-[#1E2521]">
      {/* 1. Desktop Left Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        {/* Dynamic Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* 3. Mobile Persistent Bottom Navigation */}
      <MobileNav activePage={activePage} setActivePage={setActivePage} />

      {/* 4. Global Omnibox Search Modal (⌘K / /) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </div>
  );
};
