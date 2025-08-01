import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { DrawingData, PhotoData, AnnouncementData, SettingsData } from '../types';

// Collections
export const collections = {
  drawings: 'drawings',
  photos: 'photos',
  announcements: 'announcements',
  settings: 'settings'
} as const;

// Drawing operations
export const drawingService = {
  async add(drawing: Omit<DrawingData, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, collections.drawings), {
      ...drawing,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<DrawingData>): Promise<void> {
    const docRef = doc(db, collections.drawings, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, collections.drawings, id);
    await deleteDoc(docRef);
  },

  async getAll(): Promise<DrawingData[]> {
    const q = query(collection(db, collections.drawings), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as DrawingData));
  },

  onSnapshot(callback: (drawings: DrawingData[]) => void): Unsubscribe {
    const q = query(collection(db, collections.drawings), orderBy('timestamp', 'asc'));
    return onSnapshot(q, (snapshot) => {
      const drawings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DrawingData));
      callback(drawings);
    });
  },

  async clear(): Promise<void> {
    const snapshot = await getDocs(collection(db, collections.drawings));
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  }
};

// Photo operations
export const photoService = {
  async add(photo: Omit<PhotoData, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, collections.photos), {
      ...photo,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<PhotoData>): Promise<void> {
    const docRef = doc(db, collections.photos, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, collections.photos, id);
    await deleteDoc(docRef);
  },

  async getRecent(limitCount: number = 50): Promise<PhotoData[]> {
    const q = query(
      collection(db, collections.photos),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as PhotoData));
  },

  onSnapshot(callback: (photos: PhotoData[]) => void, limitCount: number = 50): Unsubscribe {
    const q = query(
      collection(db, collections.photos),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    return onSnapshot(q, 
      (snapshot) => {
        const photos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PhotoData));
        callback(photos);
      },
      (error) => {
        console.error('Photo snapshot error:', error);
        // Still call callback with empty array to prevent infinite loading
        callback([]);
      }
    );
  }
};

// Announcement operations
export const announcementService = {
  async add(announcement: Omit<AnnouncementData, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, collections.announcements), {
      ...announcement,
      timestamp: Timestamp.now()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<AnnouncementData>): Promise<void> {
    const docRef = doc(db, collections.announcements, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, collections.announcements, id);
    await deleteDoc(docRef);
  },

  async getActive(): Promise<AnnouncementData[]> {
    const q = query(
      collection(db, collections.announcements),
      where('isActive', '==', true),
      orderBy('priority', 'desc'),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AnnouncementData));
  },

  onSnapshot(callback: (announcements: AnnouncementData[]) => void): Unsubscribe {
    const q = query(
      collection(db, collections.announcements),
      where('isActive', '==', true),
      orderBy('priority', 'desc'),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const announcements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AnnouncementData));
      callback(announcements);
    });
  }
};

// Settings operations
export const settingsService = {
  async get(): Promise<SettingsData | null> {
    const docRef = doc(db, collections.settings, 'global');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: 'global', ...docSnap.data() } as SettingsData;
    }
    return null;
  },

  async update(updates: Partial<Omit<SettingsData, 'id'>>): Promise<void> {
    const docRef = doc(db, collections.settings, 'global');
    await updateDoc(docRef, updates);
  },

  async initialize(initialSettings: Omit<SettingsData, 'id'>): Promise<void> {
    const docRef = doc(db, collections.settings, 'global');
    await updateDoc(docRef, initialSettings);
  },

  onSnapshot(callback: (settings: SettingsData | null) => void): Unsubscribe {
    const docRef = doc(db, collections.settings, 'global');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: 'global', ...docSnap.data() } as SettingsData);
      } else {
        callback(null);
      }
    });
  }
};

// Utility functions
// Convenience functions for drawing canvas
export const addDrawing = async (drawing: Omit<DrawingData, 'id'>): Promise<string> => {
  return drawingService.add(drawing);
};

export const subscribeToDrawings = (callback: (drawings: DrawingData[]) => void): Unsubscribe => {
  return drawingService.onSnapshot(callback);
};

export const clearAllDrawings = async (): Promise<void> => {
  return drawingService.clear();
};

// Helper functions for common operations as specified in requirements
export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> => {
  const { photoStorageService } = await import('./storage');
  return photoStorageService.upload(file, onProgress);
};

// Error handling wrapper for network issues
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Operation failed'
): Promise<T | null> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    // Handle specific Firebase errors
    if (error instanceof Error) {
      if (error.message.includes('offline')) {
        console.error('Device is offline. Please check your internet connection.');
      } else if (error.message.includes('permission-denied')) {
        console.error('Permission denied. Please check Firebase security rules.');
      } else if (error.message.includes('not-found')) {
        console.error('Document not found.');
      }
    }
    
    return null;
  }
};

export const firestoreUtils = {
  async testConnection(): Promise<boolean> {
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.error('Firestore connection test failed:', error);
      return false;
    }
  },

  convertTimestamp(timestamp: any): number {
    if (timestamp?.toMillis) {
      return timestamp.toMillis();
    }
    if (timestamp?.seconds) {
      return timestamp.seconds * 1000;
    }
    return Date.now();
  }
};