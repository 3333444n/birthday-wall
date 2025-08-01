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
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl text-black font-serif leading-tight mb-4">
          Compartir Fotos
        </h1>
        <p className="text-2xl text-gray-600 font-serif">
          Captura recuerdos para la pantalla grande
        </p>
      </div>

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <h4 className="text-2xl text-green-800 font-serif mb-2">¡Foto Agregada!</h4>
            <p className="text-lg text-green-600 font-serif">
              Tu foto ahora es parte de la pared de la fiesta
            </p>
          </div>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h4 className="text-2xl text-red-800 font-serif mb-2">Error al Subir</h4>
              <p className="text-lg text-red-600 font-serif">{uploadError.message}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600 text-xl ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Camera Interface */}
      <div className="bg-gray-50 rounded-2xl shadow-lg p-8 mb-8">
        {!showCamera && !capturedPhoto && (
          <div className="text-center py-12">
            <h3 className="text-4xl text-black font-serif mb-6">
              ¿Listo para tomar una foto?
            </h3>
            <p className="text-xl text-gray-600 font-serif mb-8">
              Tu foto aparecerá en el collage de la fiesta
            </p>
            <button 
              onClick={handleStartCamera}
              className="bg-black text-white px-8 py-4 rounded-lg text-xl font-serif hover:bg-gray-800 transition-colors"
              disabled={isUploading}
            >
              Abrir Cámara
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
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
        <PhotoGrid 
          maxPhotos={12}
          columns={3}
          showTimestamps={true}
          onPhotoClick={handlePhotoClick}
        />
      </div>

      {/* Connection Status & Instructions */}
      <div className="mt-8 text-center space-y-4">
        <ConnectionStatus className="justify-center" />
        <div className="text-lg text-gray-600 font-serif">
          <p>¡Toma fotos durante toda la fiesta!</p>
          <p>Aparecerán en un collage en vivo en el proyector</p>
        </div>
      </div>
    </div>
  );
};

export default Photo;