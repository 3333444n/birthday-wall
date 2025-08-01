import React, { useState } from 'react';
import CameraCapture from '../components/Photo/CameraCapture';
import PhotoPreview from '../components/Photo/PhotoPreview';
import PhotoGrid from '../components/Photo/PhotoGrid';
import ConnectionStatus from '../components/UI/ConnectionStatus';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { CapturedPhoto } from '../hooks/useCamera';
import { PhotoData } from '../types';

const Photo: React.FC = () => {
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<PhotoData | null>(null);
  
  const { uploadPhoto, isUploading, error: uploadError, clearError } = usePhotoUpload();

  const handleStartCamera = () => {
    setShowCamera(true);
    setUploadSuccess(null);
  };

  const handlePhotoCapture = (photo: CapturedPhoto) => {
    setCapturedPhoto(photo);
    setShowCamera(false);
  };

  const handleCameraError = (error: string) => {
    console.error('Camera error:', error);
    // Error is handled by the CameraCapture component
  };

  const handleUploadPhoto = async (photo: CapturedPhoto) => {
    const result = await uploadPhoto(photo);
    if (result) {
      setUploadSuccess(result);
      setCapturedPhoto(null);
      setShowCamera(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setShowCamera(true);
  };

  const handleCancelPhoto = () => {
    setCapturedPhoto(null);
    setShowCamera(false);
  };

  const handlePhotoClick = (photo: PhotoData) => {
    // Could implement photo viewer modal here
    console.log('Clicked photo:', photo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-party-secondary to-party-accent p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2">
          📸 Share Photos
        </h1>
        <p className="text-white/90">
          Capture memories that appear on the big screen!
        </p>
      </div>

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-green-500 text-2xl">🎉</span>
            <div>
              <h4 className="font-semibold text-green-800">Photo Added Successfully!</h4>
              <p className="text-green-600 text-sm">
                Your photo is now part of the party wall and will appear on the big screen!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-800">Upload Failed</h4>
                <p className="text-red-600 text-sm">{uploadError.message}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Camera Interface */}
      <div className="party-card mb-6">
        {!showCamera && !capturedPhoto && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Ready to take a photo?
            </h3>
            <p className="text-gray-600 mb-6">
              Your photo will appear in the party photo collage!
            </p>
            <button 
              onClick={handleStartCamera}
              className="party-button text-lg px-8 py-4"
              disabled={isUploading}
            >
              📸 Open Camera
            </button>
          </div>
        )}

        {showCamera && !capturedPhoto && (
          <CameraCapture
            onPhotoCapture={handlePhotoCapture}
            onError={handleCameraError}
          />
        )}

        {capturedPhoto && (
          <PhotoPreview
            photo={capturedPhoto}
            onRetake={handleRetakePhoto}
            onUpload={handleUploadPhoto}
            onCancel={handleCancelPhoto}
          />
        )}
      </div>

      {/* Live Photo Grid */}
      <div className="party-card">
        <PhotoGrid 
          maxPhotos={12}
          columns={3}
          showTimestamps={true}
          onPhotoClick={handlePhotoClick}
        />
      </div>

      {/* Connection Status & Instructions */}
      <div className="mt-6 space-y-3">
        <ConnectionStatus className="justify-center" />
        <div className="text-center text-white/80 text-sm">
          <p>Take fun photos throughout the party!</p>
          <p>They'll appear in a live collage on the projector screen</p>
        </div>
      </div>
    </div>
  );
};

export default Photo;