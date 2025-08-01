import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.log('Please check your .env file and ensure all Firebase configuration variables are set.');
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
const firebaseStorage = getStorage(app);

// Connect to emulators in development mode
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(firebaseStorage, 'localhost', 9199);
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.log('Emulator connection failed (already connected or not running):', error);
  }
}

// Export initialized services
export { db as firestore, firebaseStorage as storage };

// Helper function to check Firebase connection
export const checkFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to read from Firestore to test connection
    const { doc, getDoc } = await import('firebase/firestore');
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

// Add connection state monitoring
export const connectionState = {
  isConnected: false,
  lastError: null as Error | null,
  listeners: new Set<(connected: boolean) => void>(),

  addListener(callback: (connected: boolean) => void) {
    this.listeners.add(callback);
    // Immediately call with current state
    callback(this.isConnected);
  },

  removeListener(callback: (connected: boolean) => void) {
    this.listeners.delete(callback);
  },

  updateState(connected: boolean, error?: Error) {
    this.isConnected = connected;
    this.lastError = error || null;
    this.listeners.forEach(callback => callback(connected));
  }
};

// Initialize connection monitoring
checkFirebaseConnection().then(connected => {
  connectionState.updateState(connected);
});