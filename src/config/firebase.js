/**
 * Firebase Initialization and Configuration Module
 * Supports both Vite environment variables (VITE_FIREBASE_*) and dynamic
 * localStorage configuration for seamless in-app setup.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs,
  enableIndexedDbPersistence 
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const STORAGE_KEY = 'swasthya_firebase_config';

/**
 * Retrieve current Firebase configuration.
 * Checks localStorage first (configured via UI), then falls back to Vite env variables.
 */
export const getStoredFirebaseConfig = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.projectId && parsed.apiKey) {
          return { ...parsed, source: 'localStorage' };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to parse Firebase config from localStorage:', err);
  }

  // Fallback to Vite environment variables
  const envObj = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : (typeof process !== 'undefined' ? process.env : {});
  const envConfig = {
    apiKey: envObj.VITE_FIREBASE_API_KEY || '',
    authDomain: envObj.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: envObj.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: envObj.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: envObj.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: envObj.VITE_FIREBASE_APP_ID || '',
    source: 'env'
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // Default project credentials configured for SwasthyaMitra
  return {
    apiKey: 'AIzaSyDM7KYsOQ1o-NSCbJHb9lzC0YHNeEcE29A',
    authDomain: 'swasthya-mitra-48b58.firebaseapp.com',
    projectId: 'swasthya-mitra-48b58',
    storageBucket: 'swasthya-mitra-48b58.appspot.com',
    messagingSenderId: '395410615396',
    appId: '1:395410615396:web:ababcd25af50370de24371',
    source: 'projectDefaults'
  };
};

/**
 * Check if a valid Firebase configuration is present
 */
export const isFirebaseConfigured = () => {
  const config = getStoredFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

let appInstance = null;
let firestoreInstance = null;
let authInstance = null;

/**
 * Initialize or get active Firebase App instance
 */
export const getFirebaseApp = (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(config);
    }
    return appInstance;
  } catch (err) {
    console.error('Error initializing Firebase App:', err);
    return null;
  }
};

/**
 * Get active Firestore instance
 */
export const getFirestoreDb = () => {
  if (firestoreInstance) return firestoreInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  
  try {
    firestoreInstance = getFirestore(app);
    return firestoreInstance;
  } catch (err) {
    console.error('Error initializing Firestore:', err);
    return null;
  }
};

/**
 * Get active Firebase Auth instance
 */
export const getFirebaseAuth = () => {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;

  try {
    authInstance = getAuth(app);
    return authInstance;
  } catch (err) {
    console.error('Error initializing Firebase Auth:', err);
    return null;
  }
};

/**
 * Save Firebase configuration to localStorage and re-initialize instances
 */
export const saveFirebaseConfig = (config) => {
  if (!config || !config.projectId || !config.apiKey) {
    throw new Error('Valid Project ID and API Key are required.');
  }

  const cleanConfig = {
    apiKey: config.apiKey.trim(),
    authDomain: (config.authDomain || `${config.projectId.trim()}.firebaseapp.com`).trim(),
    projectId: config.projectId.trim(),
    storageBucket: (config.storageBucket || `${config.projectId.trim()}.appspot.com`).trim(),
    messagingSenderId: (config.messagingSenderId || '').trim(),
    appId: (config.appId || '').trim()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanConfig));

  // Reset instances to trigger reinitialization
  appInstance = null;
  firestoreInstance = null;
  authInstance = null;

  try {
    appInstance = initializeApp(cleanConfig, 'dynamic_' + Date.now());
    firestoreInstance = getFirestore(appInstance);
  } catch (e) {
    console.warn('Re-initialization note:', e.message);
  }

  return cleanConfig;
};

/**
 * Clear stored Firebase configuration
 */
export const clearFirebaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY);
  appInstance = null;
  firestoreInstance = null;
  authInstance = null;
};

/**
 * Test connectivity to Cloud Firestore
 */
export const testFirebaseConnection = async (customConfig = null) => {
  const config = customConfig || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return { success: false, message: 'Missing API Key or Project ID in configuration.' };
  }

  try {
    let testApp;
    const testAppName = 'test_connection_' + Date.now();
    testApp = initializeApp(config, testAppName);
    const testDb = getFirestore(testApp);

    // Attempt writing and reading a lightweight healthcheck document
    const pingDocRef = doc(testDb, '_healthcheck', 'ping');
    const timestamp = new Date().toISOString();
    
    await setDoc(pingDocRef, {
      status: 'online',
      appName: 'SwasthyaMitra Healthcare Portal',
      lastPing: timestamp,
      clientAgent: navigator.userAgent
    });

    const docSnap = await getDoc(pingDocRef);
    if (docSnap.exists()) {
      return { 
        success: true, 
        message: `Successfully connected to Firestore project "${config.projectId}"!`,
        lastPing: timestamp 
      };
    } else {
      return { 
        success: false, 
        message: 'Connected, but test record could not be confirmed.' 
      };
    }
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    
    let userMsg = error.message;
    if (error.code === 'permission-denied') {
      userMsg = 'Permission denied by Firestore security rules. Please make sure Firestore rules allow read/write (e.g. Test Mode: "allow read, write: if true;").';
    } else if (error.code === 'unavailable') {
      userMsg = 'Firestore service unavailable or offline. Please verify network access.';
    } else if (error.message.includes('API_KEY_INVALID')) {
      userMsg = 'Invalid Firebase API Key. Please verify the API key from your Firebase Console.';
    } else if (error.message.includes('PROJECT_NOT_FOUND')) {
      userMsg = `Firebase Project ID "${config.projectId}" was not found. Please double-check your project ID.`;
    }

    return { 
      success: false, 
      message: userMsg,
      code: error.code || 'UNKNOWN_ERROR'
    };
  }
};
