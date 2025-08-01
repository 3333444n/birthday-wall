import React, { useState, useEffect } from 'react';
import { useCamera, CapturedPhoto } from '../../hooks/useCamera';

interface CameraCaptureProps {
  onPhotoCapture: (photo: CapturedPhoto) => void;
  onError?: (error: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onPhotoCapture, 
  onError 
}) => {
  const {
    isActive,
    isCapturing,
    error,
    isSupported,
    videoRef,
    startCamera,
    stopCamera,
    switchCamera,
    capturePhoto,
    clearError
  } = useCamera();

  const [isInitialized, setIsInitialized] = useState(false);
  const [currentFacingMode, setCurrentFacingMode] = useState<'user' | 'environment'>('environment');

  // Auto-start camera when component mounts (if supported)
  useEffect(() => {
    if (isSupported && !isInitialized) {
      handleStartCamera();
      setIsInitialized(true);
    }
  }, [isSupported, isInitialized]);

  // Handle camera errors
  useEffect(() => {
    if (error && onError) {
      onError(error.message);
    }
  }, [error, onError]);

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (!success && error) {
      console.error('Failed to start camera:', error.message);
    }
  };

  const handleCapturePhoto = async () => {
    const photo = await capturePhoto();
    if (photo) {
      onPhotoCapture(photo);
    }
  };

  const handleSwitchCamera = async () => {
    const success = await switchCamera();
    if (success) {
      setCurrentFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }
  };

  // Camera not supported
  if (!isSupported) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🚫</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Cámara No Soportada
        </h3>
        <p className="text-gray-600">
          Tu dispositivo no soporta acceso a la cámara a través del navegador.
        </p>
      </div>
    );
  }

  // Permission denied or other error
  if (error && error.code === 'PERMISSION_DENIED') {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📵</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Permiso de Cámara Requerido
        </h3>
        <p className="text-gray-600 mb-6">
          {error.message}
        </p>
        <div className="space-y-3">
          <button 
            onClick={handleStartCamera}
            className="party-button w-full"
          >
            🔄 Intentar de Nuevo
          </button>
          <button 
            onClick={clearError}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg w-full"
          >
            Cerrar
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p className="mb-2">Para habilitar acceso a la cámara:</p>
          <ul className="text-left space-y-1">
            <li>• Safari: Ajustes → Safari → Cámara</li>
            <li>• Chrome: Configuración del Sitio → Cámara</li>
            <li>• Firefox: Clic en el icono de cámara en la barra de direcciones</li>
          </ul>
        </div>
      </div>
    );
  }

  // Other errors
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Error de Cámara
        </h3>
        <p className="text-gray-600 mb-6">
          {error.message}
        </p>
        <div className="space-y-3">
          <button 
            onClick={handleStartCamera}
            className="party-button w-full"
          >
            🔄 Reintentar
          </button>
          <button 
            onClick={clearError}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg w-full"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // Loading/initializing camera
  if (!isActive && !error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-pulse">📱</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Inicializando Cámara...
        </h3>
        <p className="text-gray-600 mb-6">
          Preparando tu cámara para capturar fotos
        </p>
        <div className="animate-spin w-8 h-8 border-4 border-party-primary border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  // Camera active - show viewfinder
  return (
    <div className="relative">
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full rounded-lg bg-black"
        style={{
          aspectRatio: '16/9',
          objectFit: 'cover',
          maxHeight: '60vh'
        }}
      />

      {/* Camera Overlay */}
      {isActive && (
        <>
          {/* Viewfinder overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner brackets for viewfinder effect */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-white opacity-75"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-white opacity-75"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-white opacity-75"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-white opacity-75"></div>
          </div>

          {/* Camera Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-6">
            {/* Switch Camera Button */}
            <button
              onClick={handleSwitchCamera}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              disabled={isCapturing}
            >
              <span className="text-xl">🔄</span>
            </button>

            {/* Capture Button */}
            <button
              onClick={handleCapturePhoto}
              disabled={isCapturing}
              className={`
                w-16 h-16 rounded-full border-4 border-white
                ${isCapturing 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 active:scale-95'
                }
                transition-all duration-150 flex items-center justify-center
              `}
            >
              {isCapturing ? (
                <div className="animate-pulse text-white text-xl">⏱️</div>
              ) : (
                <div className="w-12 h-12 bg-white rounded-full"></div>
              )}
            </button>

            {/* Close Camera Button */}
            <button
              onClick={stopCamera}
              className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
              disabled={isCapturing}
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Status indicators */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Camera mode indicator */}
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentFacingMode === 'user' ? '🤳 Frontal' : '📷 Trasera'}
            </div>

            {/* Capturing indicator */}
            {isCapturing && (
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
                📸 Capturando...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;