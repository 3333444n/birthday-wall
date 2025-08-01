// Firestore Utility Functions for Local Image Storage Integration
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  limit,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Drawing, Photo, Announcement } from '../types';
import { localImageStorage } from './localStorage';

// Generate a unique device ID for this browser/device
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('bdaywall_device_id');
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('bdaywall_device_id', deviceId);
  }
  return deviceId;
};

// Collection references
const DRAWINGS_COLLECTION = 'drawings';
const PHOTOS_COLLECTION = 'photos';
const ANNOUNCEMENTS_COLLECTION = 'announcements';

// Drawing operations
export const addDrawing = async (canvasElement: HTMLCanvasElement): Promise<string> => {
  try {
    // Convert canvas to base64 and store locally
    const imageData = localImageStorage.canvasToBase64(canvasElement, 0.8);
    const localImageId = await localImageStorage.saveImage(imageData, 'canvas', {
      width: canvasElement.width,
      height: canvasElement.height
    });

    // Create drawing metadata for Firestore
    const drawing: Omit<Drawing, 'id'> = {
      localImageId,
      timestamp: Date.now(),
      deviceId: getDeviceId()
    };

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, DRAWINGS_COLLECTION), drawing);
    console.log('Drawing metadata saved to Firestore:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding drawing:', error);
    throw new Error('Failed to save drawing');
  }
};

export const subscribeToDrawings = (callback: (drawings: Drawing[]) => void): (() => void) => {
  const q = query(
    collection(db, DRAWINGS_COLLECTION), 
    orderBy('timestamp', 'desc'),
    limit(50) // Limit to prevent overwhelming the UI
  );

  return onSnapshot(q, 
    (snapshot) => {
      const drawings: Drawing[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Drawing));
      callback(drawings);
    },
    (error) => {
      console.error('Error listening to drawings:', error);
      callback([]); // Return empty array on error
    }
  );
};

export const deleteDrawing = async (drawingId: string, localImageId: string): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, DRAWINGS_COLLECTION, drawingId));
    
    // Delete from local storage
    await localImageStorage.deleteImage(localImageId);
    
    console.log('Drawing deleted successfully');
  } catch (error) {
    console.error('Error deleting drawing:', error);
    throw new Error('Failed to delete drawing');
  }
};

export const clearAllDrawings = async (): Promise<void> => {
  try {
    // Get all drawings
    const q = query(collection(db, DRAWINGS_COLLECTION));
    const snapshot = await getDocs(q);
    
    // Delete from Firestore
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Clear all canvas images from local storage
    const localImages = await localImageStorage.getImagesByType('canvas');
    const localDeletePromises = localImages.map(img => localImageStorage.deleteImage(img.id));
    await Promise.all(localDeletePromises);
    
    console.log('All drawings cleared successfully');
  } catch (error) {
    console.error('Error clearing drawings:', error);
    throw new Error('Failed to clear drawings');
  }
};

// Photo operations
export const addPhoto = async (photoFile: File): Promise<string> => {
  try {
    // Convert photo to base64 and compress
    const originalBase64 = await localImageStorage.fileToBase64(photoFile);
    const compressedBase64 = await localImageStorage.compressImage(originalBase64, 800, 0.9);
    
    // Store locally
    const localImageId = await localImageStorage.saveImage(compressedBase64, 'photo', {
      width: 800, // Compressed width
      height: Math.round((800 * photoFile.size) / (photoFile.size)), // Estimate
      size: photoFile.size
    });

    // Create photo metadata for Firestore
    const photo: Omit<Photo, 'id'> = {
      localImageId,
      timestamp: Date.now(),
      deviceId: getDeviceId()
    };

    // Save metadata to Firestore
    const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), photo);
    console.log('Photo metadata saved to Firestore:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding photo:', error);
    throw new Error('Failed to save photo');
  }
};

export const subscribeToPhotos = (callback: (photos: Photo[]) => void): (() => void) => {
  const q = query(
    collection(db, PHOTOS_COLLECTION), 
    orderBy('timestamp', 'desc'),
    limit(50) // Limit to prevent overwhelming the UI
  );

  return onSnapshot(q, 
    (snapshot) => {
      const photos: Photo[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Photo));
      callback(photos);
    },
    (error) => {
      console.error('Error listening to photos:', error);
      callback([]); // Return empty array on error
    }
  );
};

export const deletePhoto = async (photoId: string, localImageId: string): Promise<void> => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, PHOTOS_COLLECTION, photoId));
    
    // Delete from local storage
    await localImageStorage.deleteImage(localImageId);
    
    console.log('Photo deleted successfully');
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo');
  }
};

// Announcement operations
export const updateAnnouncement = async (text: string, active: boolean): Promise<void> => {
  try {
    const announcement = { text, active };
    
    // Use a fixed document ID for the global announcement
    const announcementRef = doc(db, ANNOUNCEMENTS_COLLECTION, 'global');
    await updateDoc(announcementRef, announcement);
    
    console.log('Announcement updated:', { text, active });
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw new Error('Failed to update announcement');
  }
};

export const subscribeToAnnouncements = (callback: (announcement: Announcement | null) => void): (() => void) => {
  const announcementRef = doc(db, ANNOUNCEMENTS_COLLECTION, 'global');
  
  return onSnapshot(announcementRef, 
    (doc) => {
      if (doc.exists()) {
        const announcement = doc.data() as Announcement;
        callback(announcement);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error listening to announcements:', error);
      callback(null);
    }
  );
};

// Utility functions for local image retrieval
export const getLocalImage = async (localImageId: string): Promise<string | null> => {
  try {
    const image = await localImageStorage.getImage(localImageId);
    return image?.data || null;
  } catch (error) {
    console.error('Error getting local image:', error);
    return null;
  }
};

export const getDrawingWithImage = async (drawing: Drawing): Promise<Drawing & { imageData?: string }> => {
  const imageData = await getLocalImage(drawing.localImageId);
  return { ...drawing, imageData: imageData || undefined };
};

export const getPhotoWithImage = async (photo: Photo): Promise<Photo & { imageData?: string }> => {
  const imageData = await getLocalImage(photo.localImageId);
  return { ...photo, imageData: imageData || undefined };
};

// Batch operations for efficiency
export const getAllDrawingsWithImages = async (): Promise<Array<Drawing & { imageData?: string }>> => {
  try {
    const q = query(collection(db, DRAWINGS_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    
    const drawings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Drawing));
    
    // Get images for all drawings
    const drawingsWithImages = await Promise.all(
      drawings.map(async (drawing) => {
        const imageData = await getLocalImage(drawing.localImageId);
        return { ...drawing, imageData: imageData || undefined };
      })
    );
    
    return drawingsWithImages;
  } catch (error) {
    console.error('Error getting all drawings:', error);
    return [];
  }
};

export const getAllPhotosWithImages = async (): Promise<Array<Photo & { imageData?: string }>> => {
  try {
    const q = query(collection(db, PHOTOS_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    
    const photos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Photo));
    
    // Get images for all photos
    const photosWithImages = await Promise.all(
      photos.map(async (photo) => {
        const imageData = await getLocalImage(photo.localImageId);
        return { ...photo, imageData: imageData || undefined };
      })
    );
    
    return photosWithImages;
  } catch (error) {
    console.error('Error getting all photos:', error);
    return [];
  }
};

// Health check functions
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try to read from announcements collection
    await getDocs(query(collection(db, ANNOUNCEMENTS_COLLECTION), limit(1)));
    console.log('Firestore connection test successful');
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};

export const getStorageStats = async (): Promise<{
  drawings: number;
  photos: number;
  localImages: number;
}> => {
  try {
    const [drawingsSnapshot, photosSnapshot, localImages] = await Promise.all([
      getDocs(collection(db, DRAWINGS_COLLECTION)),
      getDocs(collection(db, PHOTOS_COLLECTION)),
      localImageStorage.getAllImages()
    ]);

    return {
      drawings: drawingsSnapshot.size,
      photos: photosSnapshot.size,
      localImages: localImages.length
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return { drawings: 0, photos: 0, localImages: 0 };
  }
};