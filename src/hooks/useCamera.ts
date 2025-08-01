import { useState, useRef, useCallback, useEffect } from 'react';

export interface CameraError {
  code: 'PERMISSION_DENIED' | 'NOT_SUPPORTED' | 'DEVICE_NOT_FOUND' | 'UNKNOWN';
  message: string;
}

export interface CameraState {
  isActive: boolean;
  isCapturing: boolean;
  hasPermission: boolean;
  error: CameraError | null;
  stream: MediaStream | null;
}

export interface CapturedPhoto {
  dataUrl: string;
  blob: Blob;
  file: File;
  timestamp: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export const useCamera = () => {
  const [state, setState] = useState<CameraState>({
    isActive: false,
    isCapturing: false,
    hasPermission: false,
    error: null,
    stream: null
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check if camera is supported
  const isCameraSupported = useCallback(() => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  // Request camera permissions and start stream
  const startCamera = useCallback(async (constraints?: MediaStreamConstraints) => {
    console.log('Starting camera...');
    
    if (!isCameraSupported()) {
      console.error('Camera not supported');
      setState(prev => ({
        ...prev,
        error: {
          code: 'NOT_SUPPORTED',
          message: 'Camera is not supported on this device'
        }
      }));
      return false;
    }

    try {
      console.log('Requesting camera access...');
      setState(prev => ({ ...prev, error: null, isCapturing: true }));

      // Default constraints optimized for mobile
      const defaultConstraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Use back camera by default
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        constraints || defaultConstraints
      );
      
      console.log('Camera stream obtained:', stream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        
        // Wait for metadata to load before playing
        video.onloadedmetadata = () => {
          console.log('Video metadata loaded, starting playback');
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        };
        
        // Also handle the case where metadata is already loaded
        if (video.readyState >= 1) {
          console.log('Video metadata already loaded, starting playback immediately');
          video.play().catch(error => {
            console.error('Error playing video:', error);
          });
        }
      }

      setState(prev => ({
        ...prev,
        isActive: true,
        isCapturing: false,
        hasPermission: true,
        error: null,
        stream
      }));
      
      console.log('Camera successfully started');
      return true;
    } catch (error: any) {
      console.error('Camera access error:', error);
      
      let cameraError: CameraError;
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        cameraError = {
          code: 'PERMISSION_DENIED',
          message: 'Permiso de cámara denegado. Por favor habilita el acceso a la cámara en la configuración de tu navegador.'
        };
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        cameraError = {
          code: 'DEVICE_NOT_FOUND',
          message: 'No se encontró cámara en este dispositivo.'
        };
      } else {
        cameraError = {
          code: 'UNKNOWN',
          message: error.message || 'Error al acceder a la cámara. Por favor intenta de nuevo.'
        };
      }

      setState(prev => ({
        ...prev,
        isActive: false,
        isCapturing: false,
        error: cameraError
      }));

      return false;
    }
  }, [isCameraSupported]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    setState(prev => {
      // Stop all tracks in current stream
      if (prev.stream) {
        prev.stream.getTracks().forEach(track => {
          track.stop();
        });
      }

      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      return {
        ...prev,
        isActive: false,
        stream: null
      };
    });
  }, []);

  // Switch between front and back camera  
  const switchCamera = useCallback(async () => {
    return new Promise<boolean>((resolve) => {
      setState(prev => {
        if (!prev.isActive || !prev.stream) {
          resolve(false);
          return prev;
        }

        const currentFacingMode = prev.stream.getVideoTracks()[0]?.getSettings()?.facingMode;
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

        // Stop current stream
        prev.stream.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        // Start new camera with opposite facing mode
        startCamera({
          video: {
            facingMode: newFacingMode,
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 }
          },
          audio: false
        }).then(resolve);

        return {
          ...prev,
          isActive: false,
          stream: null
        };
      });
    });
  }, [startCamera]);

  // Capture photo from video stream
  const capturePhoto = useCallback(async (): Promise<CapturedPhoto | null> => {
    if (!videoRef.current || !state.isActive) {
      console.error('Video not ready for capture');
      return null;
    }

    try {
      setState(prev => ({ ...prev, isCapturing: true }));

      const video = videoRef.current;
      const canvas = canvasRef.current || document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to different formats
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          },
          'image/jpeg',
          0.9
        );
      });

      // Create File object for upload
      const timestamp = Date.now();
      const file = new File(
        [blob], 
        `photo_${timestamp}.jpg`, 
        { 
          type: 'image/jpeg',
          lastModified: timestamp
        }
      );

      const capturedPhoto: CapturedPhoto = {
        dataUrl,
        blob,
        file,
        timestamp,
        dimensions: {
          width: canvas.width,
          height: canvas.height
        }
      };

      setState(prev => ({ ...prev, isCapturing: false }));
      return capturedPhoto;

    } catch (error) {
      console.error('Photo capture failed:', error);
      setState(prev => ({ 
        ...prev, 
        isCapturing: false,
        error: {
          code: 'UNKNOWN',
          message: 'Error al capturar foto. Por favor intenta de nuevo.'
        }
      }));
      return null;
    }
  }, [state.isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Direct cleanup without depending on stopCamera callback
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      // Note: stream cleanup will be handled by component state cleanup
    };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,
    isSupported: isCameraSupported(),
    
    // Refs for components
    videoRef,
    canvasRef,
    
    // Actions
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    clearError
  };
};

export default useCamera;