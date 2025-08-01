import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { storage } from './firebase';

// Storage paths
export const storagePaths = {
  photos: 'photos',
  drawings: 'drawings',
  thumbnails: 'thumbnails'
} as const;

// Image compression utility
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let newWidth = maxWidth;
      let newHeight = maxWidth / aspectRatio;
      
      if (newHeight > maxWidth) {
        newHeight = maxWidth;
        newWidth = maxWidth * aspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw compressed image
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

// Photo storage service
export const photoStorageService = {
  async upload(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; path: string }> {
    // Compress image before upload
    const compressedFile = await compressImage(file);
    
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    const storageRef = ref(storage, `${storagePaths.photos}/${fileName}`);

    if (onProgress) {
      // Use resumable upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ url, path: fileName });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      return { url, path: fileName };
    }
  },

  async uploadThumbnail(
    file: File,
    originalPath: string
  ): Promise<{ url: string; path: string }> {
    // Create smaller thumbnail
    const thumbnailFile = await compressImage(file, 200, 0.6);
    
    const fileName = `thumb_${originalPath}`;
    const storageRef = ref(storage, `${storagePaths.thumbnails}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, thumbnailFile);
    const url = await getDownloadURL(snapshot.ref);
    
    return { url, path: fileName };
  },

  async delete(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  async deleteThumbnail(path: string): Promise<void> {
    const thumbnailRef = ref(storage, `${storagePaths.thumbnails}/thumb_${path}`);
    try {
      await deleteObject(thumbnailRef);
    } catch (error) {
      console.log('Thumbnail deletion failed (may not exist):', error);
    }
  }
};

// Drawing storage service (for saving canvas as image)
export const drawingStorageService = {
  async uploadCanvas(
    canvas: HTMLCanvasElement,
    fileName?: string
  ): Promise<{ url: string; path: string }> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            reject(new Error('Canvas to blob conversion failed'));
            return;
          }

          const file = new File([blob], fileName || `drawing_${Date.now()}.png`, {
            type: 'image/png',
            lastModified: Date.now()
          });

          try {
            const path = `${storagePaths.drawings}/${file.name}`;
            const storageRef = ref(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            resolve({ url, path: file.name });
          } catch (error) {
            reject(error);
          }
        },
        'image/png',
        0.9
      );
    });
  },

  async delete(path: string): Promise<void> {
    const storageRef = ref(storage, `${storagePaths.drawings}/${path}`);
    await deleteObject(storageRef);
  }
};

// Utility functions
// Canvas storage functions for Fabric.js integration
export const saveCanvasToStorage = async (canvas: any): Promise<void> => {
  try {
    const canvasData = JSON.stringify(canvas.toJSON());
    localStorage.setItem('birthday-wall-canvas', canvasData);
  } catch (error) {
    console.error('Failed to save canvas to storage:', error);
  }
};

export const loadCanvasFromStorage = async (canvas: any): Promise<void> => {
  try {
    const canvasData = localStorage.getItem('birthday-wall-canvas');
    if (canvasData) {
      const parsedData = JSON.parse(canvasData);
      canvas.loadFromJSON(parsedData, () => {
        canvas.renderAll();
      });
    }
  } catch (error) {
    console.error('Failed to load canvas from storage:', error);
  }
};

export const clearCanvasFromStorage = (): void => {
  try {
    localStorage.removeItem('birthday-wall-canvas');
  } catch (error) {
    console.error('Failed to clear canvas from storage:', error);
  }
};

export const storageUtils = {
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  },

  isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
};