// Firebase document types - Updated for local storage integration
export interface Drawing {
  id: string;
  localImageId: string;
  timestamp: number;
  deviceId: string;
}

export interface Photo {
  id: string;
  localImageId: string;
  timestamp: number;
  deviceId: string;
}

export interface Announcement {
  text: string;
  active: boolean;
}

// Local storage types
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

export interface SlideConfig {
  interval: number;
  order: string[];
}

// Extended types for implementation
export interface DrawingData extends Drawing {
  paths?: any[];
  userId?: string;
  color?: string;
  strokeWidth?: number;
  url?: string; // For backwards compatibility
}

export interface PhotoData extends Photo {
  thumbnailUrl?: string;
  userId?: string;
  url?: string; // For backwards compatibility
  metadata?: {
    width: number;
    height: number;
    size: number;
  };
}

export interface AnnouncementData extends Announcement {
  id: string;
  message: string;
  timestamp: number;
  duration: number; // seconds
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface SettingsData {
  id: 'global';
  slideTimings: {
    drawing: number;
    photos: number;
    bouncing: number;
    messages: number;
  };
  birthdayPersonName: string;
  themeColor: string;
  languages: string[];
  messages: string[];
}

// Component props types
export interface CanvasProps {
  width?: number;
  height?: number;
  isReadOnly?: boolean;
  onDrawingUpdate?: (drawing: DrawingData) => void;
}

export interface SlideProps {
  isActive: boolean;
  onSlideComplete?: () => void;
  duration?: number;
}

export interface PhotoCaptureProps {
  onPhotoCapture: (photo: File) => void;
  onError?: (error: string) => void;
}

// Utility types
export type SlideType = 'drawing' | 'photos' | 'bouncing' | 'messages' | 'qr';

export interface SlideConfig {
  type: SlideType;
  duration: number;
  component: React.ComponentType<SlideProps>;
}

export interface QRCodeData {
  url: string;
  title: string;
  description: string;
}

// Drawing tool types
export interface DrawingTool {
  color: string;
  strokeWidth: number;
  tool: 'brush' | 'eraser';
}

// Animation types
export interface BouncingObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  imageUrl: string;
}

// Party configuration
export interface PartyConfig {
  birthdayPersonName: string;
  themeColor: string;
  messages: string[];
  photoUrls: string[];
}

// Error types
export interface AppError {
  code: string;
  message: string;
  timestamp: number;
}