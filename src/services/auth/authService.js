// MiniMart AI - Authentication & Store Session Service

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { DEMO_STORE_ID, getStoreData, saveStoreData } from '../db/storeDb';

// Check for Firebase env configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth = null;
if (isFirebaseConfigured && !getApps().length) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase init warning:', err);
  }
}

const SESSION_KEY = 'minimart_user_session';

export const authService = {
  isFirebaseActive: () => Boolean(auth && isFirebaseConfigured),

  // Demo user session
  getDemoUser: () => {
    return {
      uid: 'demo-owner-101',
      email: 'nihar@dailybasket.store',
      displayName: 'Nihar Puthran',
      storeId: DEMO_STORE_ID,
      isDemo: true,
      storeName: 'DailyBasket Supermart',
    };
  },

  getCurrentSession: () => {
    try {
      const sess = localStorage.getItem(SESSION_KEY);
      if (sess) {
        const parsed = JSON.parse(sess);
        if (parsed?.displayName === 'Nishant Puthran' || parsed?.email?.includes('nishant')) {
          parsed.displayName = 'Nihar Puthran';
          parsed.email = 'nihar@dailybasket.store';
          localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Session parse error', e);
    }
    // Default to Demo user for quick out-of-the-box exploration
    return authService.getDemoUser();
  },

  setSession: (user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Signup with store creation
  signUp: async ({ email, password, ownerName, storeName, businessType = 'Supermarket / Retail', currency = 'INR' }) => {
    let uid = `user-${Date.now()}`;
    const storeId = `store-${Date.now().toString(36)}`;

    if (auth && isFirebaseConfigured) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
      } catch (err) {
        console.warn('Firebase signup fallback to local store:', err.message);
      }
    }

    // Create new store database
    const newStoreData = {
      profile: {
        storeId,
        ownerId: uid,
        ownerName,
        storeName,
        email,
        businessType,
        currency,
        createdAt: new Date().toISOString(),
        isDemo: false,
      },
      products: [],
      customers: [],
      orders: [],
      inventoryMovements: [],
      restockTasks: [],
      promotions: [],
      notifications: [
        {
          id: `notif-welcome-${Date.now()}`,
          title: `Welcome to ${storeName}! 🏪`,
          message: 'Your AI Store Manager is ready. Add your first product or import sample items to explore.',
          type: 'success',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/products',
        },
      ],
    };

    saveStoreData(storeId, newStoreData);

    const sessionUser = {
      uid,
      email,
      displayName: ownerName,
      storeId,
      storeName,
      currency,
      isDemo: false,
    };

    authService.setSession(sessionUser);
    return sessionUser;
  },

  // Login
  signIn: async (email, password) => {
    // Quick demo login bypass
    if (email === 'demo@minimart.ai' || email === 'nihar@dailybasket.store') {
      const demoUser = authService.getDemoUser();
      authService.setSession(demoUser);
      return demoUser;
    }

    if (auth && isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const sessionUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || email.split('@')[0],
          storeId: `store-${cred.user.uid.slice(0, 8)}`,
          storeName: 'My Store',
          currency: 'INR',
          isDemo: false,
        };
        authService.setSession(sessionUser);
        return sessionUser;
      } catch (err) {
        throw new Error(err.message || 'Failed to sign in with Firebase.');
      }
    }

    // Local authentication check
    const sessionUser = {
      uid: `usr-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
      email,
      displayName: email.split('@')[0],
      storeId: DEMO_STORE_ID,
      storeName: 'DailyBasket Supermart',
      currency: 'INR',
      isDemo: true,
    };
    authService.setSession(sessionUser);
    return sessionUser;
  },

  // Switch to Demo
  loginAsDemo: () => {
    const demo = authService.getDemoUser();
    authService.setSession(demo);
    return demo;
  },

  // Logout
  signOut: async () => {
    if (auth && isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout:', e);
      }
    }
    authService.clearSession();
  },
};
