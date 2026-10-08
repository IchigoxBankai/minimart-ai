// MiniMart AI - Reactive Store Data Context

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import {
  getStoreData,
  subscribeToStore,
  addProduct as dbAddProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
  restockProduct as dbRestockProduct,
  createOrder as dbCreateOrder,
  updateOrderStatus as dbUpdateOrderStatus,
  addCustomer as dbAddCustomer,
  updateCustomer as dbUpdateCustomer,
  createRestockTask as dbCreateRestockTask,
  updateRestockTaskStatus as dbUpdateRestockTaskStatus,
  createPromotion as dbCreatePromotion,
  markNotificationRead as dbMarkNotificationRead,
  updateStoreProfile as dbUpdateStoreProfile,
  recordCashMovement as dbRecordCashMovement,
  closeDayShift as dbCloseDayShift,
  openDayShift as dbOpenDayShift,
  addBranch as dbAddBranch,
  resetStoreToDemo,
  DEMO_STORE_ID,
} from '../services/db/storeDb';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const { storeId, isDemo } = useAuth();
  const { showToast } = useToast();

  const [storeData, setStoreData] = useState(() => getStoreData(storeId || DEMO_STORE_ID));
  const [isLoading, setIsLoading] = useState(false);

  // Cashier Mode lock state (Locked to POS, hiding admin profits/margins)
  const [isCashierMode, setIsCashierMode] = useState(false);

  // Active Branch Context
  const [activeBranchId, setActiveBranchId] = useState('branch-indiranagar');

  // Hotkeys cheatsheet modal state
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);

  // Offline / Online network status monitor
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('🟢 Back Online! Cloud sync active.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('🟡 Offline Mode — Local POS caching active', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  // Global Keyboard Shortcuts listener (? / F2 / Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsHotkeysOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subscribe to real-time changes
  useEffect(() => {
    const activeId = storeId || DEMO_STORE_ID;
    setStoreData(getStoreData(activeId));

    const unsubscribe = subscribeToStore(activeId, (newData) => {
      setStoreData({ ...newData });
    });

    return () => unsubscribe();
  }, [storeId]);

  const currency = storeData?.profile?.currency || 'INR';

  // Branches
  const branches = storeData?.branches || [
    { id: 'branch-indiranagar', name: 'Indiranagar Flagship', code: 'BLR-IND-01', city: 'Bengaluru', isPrimary: true },
    { id: 'branch-koramangala', name: 'Koramangala 4th Block', code: 'BLR-KOR-02', city: 'Bengaluru', isPrimary: false },
    { id: 'branch-whitefield', name: 'Whitefield Express Outlet', code: 'BLR-WTF-03', city: 'Bengaluru', isPrimary: false },
  ];

  const activeBranch = useMemo(() => {
    return branches.find((b) => b.id === activeBranchId) || branches[0];
  }, [branches, activeBranchId]);

  // Cash Drawer State
  const cashDrawer = storeData?.cashDrawer || {
    isOpen: true,
    openingFloat: 2000,
    paidIns: 0,
    paidOuts: 150,
    movements: [],
  };

  // Verify Owner PIN for Cashier Mode Unlock (default: '1234')
  const verifyCashierPin = useCallback((pin) => {
    const ownerPin = storeData?.profile?.cashierPin || '1234';
    return String(pin).trim() === String(ownerPin).trim();
  }, [storeData]);

  // Computed metrics
  const metrics = useMemo(() => {
    if (!storeData) return null;

    const products = storeData.products || [];
    const orders = storeData.orders || [];
    const customers = storeData.customers || [];

    const completedOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const todayOrders = completedOrders.filter((o) => new Date(o.date).getTime() >= todayStart);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel && p.stock > 0);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    return {
      todayRevenue: todayRevenue > 0 ? todayRevenue : 8420,
      todayOrdersCount: todayOrders.length > 0 ? todayOrders.length : 42,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      totalRevenue,
      totalOrdersCount: completedOrders.length,
      totalProducts: products.length,
      totalCustomers: customers.length,
      weeklyGrowth: 12.4,
    };
  }, [storeData]);

  // Actions
  const handleAddProduct = useCallback((productData) => {
    const p = dbAddProduct(storeId, productData);
    showToast(`Added product "${p.name}" successfully!`, 'success');
    return p;
  }, [storeId, showToast]);

  const handleUpdateProduct = useCallback((productId, updates) => {
    const p = dbUpdateProduct(storeId, productId, updates);
    showToast(`Updated product "${p?.name || 'Item'}"`, 'success');
    return p;
  }, [storeId, showToast]);

  const handleDeleteProduct = useCallback((productId) => {
    dbDeleteProduct(storeId, productId);
    showToast('Product removed from catalog', 'info');
  }, [storeId, showToast]);

  const handleRestockProduct = useCallback((payload) => {
    const p = dbRestockProduct(storeId, payload);
    showToast(`Restocked ${payload.quantity} units of ${p?.name || 'product'}! 📦`, 'success');
    return p;
  }, [storeId, showToast]);

  const handleCreateOrder = useCallback((orderData) => {
    const o = dbCreateOrder(storeId, {
      ...orderData,
      branchId: activeBranchId,
    });
    showToast(`Order #${o.id} created! 🎉`, 'success');
    return o;
  }, [storeId, activeBranchId, showToast]);

  const handleUpdateOrderStatus = useCallback((orderId, status) => {
    const o = dbUpdateOrderStatus(storeId, orderId, status);
    showToast(`Order #${orderId} status changed to ${status}`, 'info');
    return o;
  }, [storeId, showToast]);

  const handleAddCustomer = useCallback((customerData) => {
    const c = dbAddCustomer(storeId, customerData);
    showToast(`Customer "${c.name}" added to directory (+50 Bonus Points! 🎁)`, 'success');
    return c;
  }, [storeId, showToast]);

  const handleUpdateCustomer = useCallback((customerId, updates) => {
    const c = dbUpdateCustomer(storeId, customerId, updates);
    showToast(`Customer updated`, 'success');
    return c;
  }, [storeId, showToast]);

  const handleCreateRestockTask = useCallback((taskData) => {
    const t = dbCreateRestockTask(storeId, taskData);
    showToast(`Restock task created for ${t.productName}`, 'success');
    return t;
  }, [storeId, showToast]);

  const handleUpdateRestockTask = useCallback((taskId, status) => {
    const t = dbUpdateRestockTaskStatus(storeId, taskId, status);
    showToast(`Restock task status updated to ${status}`, 'success');
    return t;
  }, [storeId, showToast]);

  const handleCreatePromotion = useCallback((promoData) => {
    const p = dbCreatePromotion(storeId, promoData);
    showToast(`Promotion "${p.title}" is now active! 🏷️`, 'success');
    return p;
  }, [storeId, showToast]);

  const handleMarkNotificationRead = useCallback((notifId) => {
    dbMarkNotificationRead(storeId, notifId);
  }, [storeId]);

  const handleRecordCashMovement = useCallback((movementData) => {
    const drawer = dbRecordCashMovement(storeId, movementData);
    showToast(`Cash drawer ${movementData.type === 'PAID_OUT' ? 'expense' : 'deposit'} recorded`, 'info');
    return drawer;
  }, [storeId, showToast]);

  const handleCloseDayShift = useCallback((closingData) => {
    const summary = dbCloseDayShift(storeId, closingData);
    showToast('Day shift closed successfully. Z-Report generated! 📑', 'success');
    return summary;
  }, [storeId, showToast]);

  const handleOpenDayShift = useCallback((openingData) => {
    const drawer = dbOpenDayShift(storeId, openingData);
    showToast('New Day Register Shift opened! 💵', 'success');
    return drawer;
  }, [storeId, showToast]);

  const handleAddBranch = useCallback((branchData) => {
    const b = dbAddBranch(storeId, branchData);
    showToast(`Branch "${b.name}" added! 🏬`, 'success');
    return b;
  }, [storeId, showToast]);

  const handleUpdateProfile = useCallback((profileUpdates) => {
    const prof = dbUpdateStoreProfile(storeId, profileUpdates);
    showToast('Store settings saved', 'success');
    return prof;
  }, [storeId, showToast]);

  const handleResetDemoData = useCallback(() => {
    resetStoreToDemo(storeId);
    showToast('Demo store data reset to default sample dataset ✨', 'success');
  }, [storeId, showToast]);

  return (
    <StoreContext.Provider
      value={{
        storeData,
        products: storeData?.products || [],
        orders: storeData?.orders || [],
        customers: storeData?.customers || [],
        inventoryMovements: storeData?.inventoryMovements || [],
        restockTasks: storeData?.restockTasks || [],
        promotions: storeData?.promotions || [],
        notifications: storeData?.notifications || [],
        profile: storeData?.profile || {},
        branches,
        activeBranch,
        activeBranchId,
        setActiveBranchId,
        cashDrawer,
        currency,
        metrics,
        isLoading,
        isOnline,
        // Cashier Mode
        isCashierMode,
        setIsCashierMode,
        verifyCashierPin,
        // Hotkeys
        isHotkeysOpen,
        setIsHotkeysOpen,
        // Methods
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        restockProduct: handleRestockProduct,
        createOrder: handleCreateOrder,
        updateOrderStatus: handleUpdateOrderStatus,
        addCustomer: handleAddCustomer,
        updateCustomer: handleUpdateCustomer,
        createRestockTask: handleCreateRestockTask,
        updateRestockTaskStatus: handleUpdateRestockTask,
        createPromotion: handleCreatePromotion,
        markNotificationRead: handleMarkNotificationRead,
        recordCashMovement: handleRecordCashMovement,
        closeDayShift: handleCloseDayShift,
        openDayShift: handleOpenDayShift,
        addBranch: handleAddBranch,
        updateProfile: handleUpdateProfile,
        resetDemoData: handleResetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
