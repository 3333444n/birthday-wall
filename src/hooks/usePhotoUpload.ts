import { useState, useCallback } from 'react';
import { CapturedPhoto } from './useCamera';
import { photoService } from '../services/firestore';
import { photoStorageService } from '../services/storage';
import { PhotoData } from '../types';

export interface UploadProgress {
  percent: number;
  stage: 'compressing' | 'uploading' | 'saving' | 'complete';
  message: string;
}

export interface UploadError {
  code: 'STORAGE_ERROR' | 'FIRESTORE_ERROR' | 'COMPRESSION_ERROR' | 'NETWORK_ERROR' | 'UNKNOWN';
  message: string;
  originalError?: unknown;
}

export interface UploadState {
  isUploading: boolean;
  progress: UploadProgress | null;
  error: UploadError | null;
  uploadedPhotoId: string | null;
}

export const usePhotoUpload = () => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: null,
    error: null,
    uploadedPhotoId: null
  });

  const updateProgress = useCallback((progress: UploadProgress) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const uploadPhoto = useCallback(async (photo: CapturedPhoto): Promise<PhotoData | null> => {
    setState({
      isUploading: true,
      progress: null,
      error: null,
      uploadedPhotoId: null
    });

    try {
      // Stage 1: Compression (already done in storage service)
      updateProgress({
        percent: 10,
        stage: 'compressing',
        message: 'Optimizing image for party wall...'
      });

      // Stage 2: Upload to Firebase Storage (with fallback)
      updateProgress({
        percent: 20,
        stage: 'uploading',
        message: 'Uploading to party gallery...'
      });

      let url: string;
      let path: string;

      try {
        const uploadResult = await photoStorageService.upload(
          photo.file,
          (progressPercent) => {
            // Map storage progress (20% - 70% of total)
            const totalPercent = 20 + (progressPercent * 0.5);
            updateProgress({
              percent: totalPercent,
              stage: 'uploading',
              message: `Uploading... ${Math.round(progressPercent)}%`
            });
          }
        );
        url = uploadResult.url;
        path = uploadResult.path;
      } catch (storageError) {
        console.warn('Storage upload failed, using data URL fallback:', storageError);
        // Fallback: use the data URL directly (for demo purposes)
        url = photo.dataUrl;
        path = `local_${Date.now()}.jpg`;
        
        updateProgress({
          percent: 70,
          stage: 'uploading',
          message: 'Using local storage fallback...'
        });
      }

      // Stage 3: Create thumbnail (skip if using fallback)
      updateProgress({
        percent: 75,
        stage: 'uploading',
        message: 'Creating thumbnail...'
      });

      let thumbnailUrl: string | undefined;
      if (!path.startsWith('local_')) {
        try {
          const thumbnailResult = await photoStorageService.uploadThumbnail(photo.file, path);
          thumbnailUrl = thumbnailResult.url;
        } catch (thumbnailError) {
          console.warn('Thumbnail upload failed, continuing without:', thumbnailError);
          // Don't fail the entire upload if thumbnail fails
        }
      } else {
        // For fallback mode, use the same data URL as thumbnail
        thumbnailUrl = url;
      }

      // Stage 4: Save to Firestore
      updateProgress({
        percent: 85,
        stage: 'saving',
        message: 'Adding to party photo collection...'
      });

      const photoData: Omit<PhotoData, 'id'> = {
        url,
        thumbnailUrl,
        timestamp: photo.timestamp,
        metadata: {
          width: photo.dimensions.width,
          height: photo.dimensions.height,
          size: photo.file.size
        }
      };

      const photoId = await photoService.add(photoData);

      // Stage 5: Complete
      updateProgress({
        percent: 100,
        stage: 'complete',
        message: 'Photo added to party wall! 🎉'
      });

      const finalPhotoData: PhotoData = {
        id: photoId,
        ...photoData
      };

      setState({
        isUploading: false,
        progress: {
          percent: 100,
          stage: 'complete',
          message: 'Photo successfully added to party wall!'
        },
        error: null,
        uploadedPhotoId: photoId
      });

      return finalPhotoData;

    } catch (error) {
      console.error('Photo upload failed:', error);
      
      let uploadError: UploadError;
      
      if (error instanceof Error) {
        if (error.message.includes('storage/')) {
          uploadError = {
            code: 'STORAGE_ERROR',
            message: 'Failed to upload image. Please check your connection and try again.',
            originalError: error
          };
        } else if (error.message.includes('firestore/') || error.message.includes('permission-denied')) {
          uploadError = {
            code: 'FIRESTORE_ERROR',
            message: 'Failed to save photo data. Please try again.',
            originalError: error
          };
        } else if (error.message.includes('network')) {
          uploadError = {
            code: 'NETWORK_ERROR',
            message: 'Network connection lost. Please check your internet and try again.',
            originalError: error
          };
        } else {
          uploadError = {
            code: 'UNKNOWN',
            message: error.message || 'An unexpected error occurred while uploading.',
            originalError: error
          };
        }
      } else {
        uploadError = {
          code: 'UNKNOWN',
          message: 'An unexpected error occurred while uploading.',
          originalError: error
        };
      }

      setState({
        isUploading: false,
        progress: null,
        error: uploadError,
        uploadedPhotoId: null
      });

      return null;
    }
  }, [updateProgress]);

  const retryUpload = useCallback(async (photo: CapturedPhoto): Promise<PhotoData | null> => {
    // Clear previous error and retry
    setState(prev => ({ ...prev, error: null }));
    return uploadPhoto(photo);
  }, [uploadPhoto]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearState = useCallback(() => {
    setState({
      isUploading: false,
      progress: null,
      error: null,
      uploadedPhotoId: null
    });
  }, []);

  // Batch upload multiple photos
  const uploadMultiplePhotos = useCallback(async (
    photos: CapturedPhoto[],
    onBatchProgress?: (current: number, total: number, currentPhoto: PhotoData | null) => void
  ): Promise<PhotoData[]> => {
    const results: PhotoData[] = [];
    
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const result = await uploadPhoto(photo);
      
      if (result) {
        results.push(result);
      }
      
      if (onBatchProgress) {
        onBatchProgress(i + 1, photos.length, result);
      }
      
      // Small delay between uploads to prevent overwhelming the server
      if (i < photos.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return results;
  }, [uploadPhoto]);

  return {
    // State
    ...state,
    
    // Actions
    uploadPhoto,
    retryUpload,
    uploadMultiplePhotos,
    clearError,
    clearState,
    
    // Computed values
    isComplete: state.progress?.stage === 'complete',
    progressPercent: state.progress?.percent || 0,
    progressMessage: state.progress?.message || ''
  };
};

export default usePhotoUpload;