// Local Image Storage System using IndexedDB and localStorage fallback
// This handles storing images locally when Firebase Storage is not available

// IndexedDB database configuration
const DB_NAME = 'BirthdayWallImages';
const DB_VERSION = 1;
const STORE_NAME = 'images';

// localStorage keys for fallback
const STORAGE_PREFIX = 'bdaywall_';
const IMAGE_INDEX_KEY = `${STORAGE_PREFIX}image_index`;

export interface StoredImage {
  id: string;
  data: string; // base64 or blob URL
  timestamp: number;
  type: 'canvas' | 'photo';
  metadata?: {
    width?: number;
    height?: number;
    size?: number;
  };
}

// IndexedDB utilities
class ImageDB {
  private db: IDBDatabase | null = null;
  private isInitialized = false;

  async init(): Promise<boolean> {
    if (this.isInitialized && this.db) {
      return true;
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.warn('IndexedDB failed to open, falling back to localStorage');
        resolve(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isInitialized = true;
        console.log('IndexedDB initialized successfully');
        resolve(true);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async saveImage(image: StoredImage): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(image);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to save image to IndexedDB:', request.error);
        resolve(false);
      };
    });
  }

  async getImage(id: string): Promise<StoredImage | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('Failed to get image from IndexedDB:', request.error);
        resolve(null);
      };
    });
  }

  async getAllImages(): Promise<StoredImage[]> {
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        console.error('Failed to get all images from IndexedDB:', request.error);
        resolve([]);
      };
    });
  }

  async deleteImage(id: string): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to delete image from IndexedDB:', request.error);
        resolve(false);
      };
    });
  }

  async clearAll(): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => {
        console.error('Failed to clear IndexedDB:', request.error);
        resolve(false);
      };
    });
  }
}

// localStorage fallback utilities
class LocalStorageFallback {
  private getImageIndex(): string[] {
    try {
      const index = localStorage.getItem(IMAGE_INDEX_KEY);
      return index ? JSON.parse(index) : [];
    } catch {
      return [];
    }
  }

  private updateImageIndex(imageIds: string[]): void {
    try {
      localStorage.setItem(IMAGE_INDEX_KEY, JSON.stringify(imageIds));
    } catch (error) {
      console.error('Failed to update image index:', error);
    }
  }

  saveImage(image: StoredImage): boolean {
    try {
      const key = `${STORAGE_PREFIX}${image.id}`;
      localStorage.setItem(key, JSON.stringify(image));
      
      // Update index
      const index = this.getImageIndex();
      if (!index.includes(image.id)) {
        index.push(image.id);
        this.updateImageIndex(index);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save image to localStorage:', error);
      return false;
    }
  }

  getImage(id: string): StoredImage | null {
    try {
      const key = `${STORAGE_PREFIX}${id}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get image from localStorage:', error);
      return null;
    }
  }

  getAllImages(): StoredImage[] {
    const index = this.getImageIndex();
    const images: StoredImage[] = [];

    for (const id of index) {
      const image = this.getImage(id);
      if (image) {
        images.push(image);
      }
    }

    return images.sort((a, b) => b.timestamp - a.timestamp);
  }

  deleteImage(id: string): boolean {
    try {
      const key = `${STORAGE_PREFIX}${id}`;
      localStorage.removeItem(key);
      
      // Update index
      const index = this.getImageIndex();
      const updatedIndex = index.filter(imageId => imageId !== id);
      this.updateImageIndex(updatedIndex);
      
      return true;
    } catch (error) {
      console.error('Failed to delete image from localStorage:', error);
      return false;
    }
  }

  clearAll(): boolean {
    try {
      const index = this.getImageIndex();
      for (const id of index) {
        const key = `${STORAGE_PREFIX}${id}`;
        localStorage.removeItem(key);
      }
      localStorage.removeItem(IMAGE_INDEX_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}

// Main API class
class LocalImageStorage {
  private imageDB = new ImageDB();
  private localStorageFallback = new LocalStorageFallback();
  private useIndexedDB = false;

  async init(): Promise<void> {
    this.useIndexedDB = await this.imageDB.init();
    console.log(`Using ${this.useIndexedDB ? 'IndexedDB' : 'localStorage'} for image storage`);
  }

  async saveImage(imageData: string, type: 'canvas' | 'photo', metadata?: StoredImage['metadata']): Promise<string> {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const image: StoredImage = {
      id,
      data: imageData,
      timestamp: Date.now(),
      type,
      metadata
    };

    const success = this.useIndexedDB 
      ? await this.imageDB.saveImage(image)
      : this.localStorageFallback.saveImage(image);

    if (!success) {
      throw new Error('Failed to save image to local storage');
    }

    return id;
  }

  async getImage(id: string): Promise<StoredImage | null> {
    return this.useIndexedDB 
      ? await this.imageDB.getImage(id)
      : this.localStorageFallback.getImage(id);
  }

  async getAllImages(): Promise<StoredImage[]> {
    return this.useIndexedDB 
      ? await this.imageDB.getAllImages()
      : this.localStorageFallback.getAllImages();
  }

  async getImagesByType(type: 'canvas' | 'photo'): Promise<StoredImage[]> {
    const allImages = await this.getAllImages();
    return allImages.filter(image => image.type === type);
  }

  async deleteImage(id: string): Promise<boolean> {
    return this.useIndexedDB 
      ? await this.imageDB.deleteImage(id)
      : this.localStorageFallback.deleteImage(id);
  }

  async clearImages(): Promise<boolean> {
    return this.useIndexedDB 
      ? await this.imageDB.clearAll()
      : this.localStorageFallback.clearAll();
  }

  // Utility function to convert canvas to base64
  canvasToBase64(canvas: HTMLCanvasElement, quality = 0.9): string {
    return canvas.toDataURL('image/jpeg', quality);
  }

  // Utility function to convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Utility function to compress image
  async compressImage(imageData: string, maxWidth = 800, quality = 0.9): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = imageData;
    });
  }
}

// Create and export singleton instance
export const localImageStorage = new LocalImageStorage();

// Initialize on module load
localImageStorage.init().catch(console.error);

// Export utility functions
export const imageUtils = {
  generateId: () => `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  isValidBase64: (str: string) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  },
  getImageSize: async (imageData: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = imageData;
    });
  }
};