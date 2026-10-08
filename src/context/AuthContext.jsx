// MiniMart AI - Authentication Context & Store Switcher

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { DEMO_STORE_ID, getStoreData } from '../services/db/storeDb';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session from local storage or default to demo user
    const session = authService.getCurrentSession();
    setCurrentUser(session);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const user = await authService.signUp(formData);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = () => {
    const demo = authService.loginAsDemo();
    setCurrentUser(demo);
    return demo;
  };

  const logout = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    authService.setSession(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: Boolean(currentUser),
        isDemo: Boolean(currentUser?.isDemo),
        storeId: currentUser?.storeId || DEMO_STORE_ID,
        login,
        signup,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
