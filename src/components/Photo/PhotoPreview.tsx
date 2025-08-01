import React, { useState } from 'react';
import { CapturedPhoto } from '../../hooks/useCamera';

interface PhotoPreviewProps {
  photo: CapturedPhoto;
  onRetake: () => void;
  onUpload: (photo: CapturedPhoto) => Promise<void>;
  onCancel?: () => void;
}

const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  photo,
  onRetake,
  onUpload,
  onCancel
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      setUploadError(null);
      await onUpload(photo);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-4">
      {/* Photo Preview */}
      <div className="relative">
        <img
          src={photo.dataUrl}
          alt="Foto capturada"
          className="w-full rounded-lg shadow-lg"
          style={{
            aspectRatio: `${photo.dimensions.width}/${photo.dimensions.height}`,
            objectFit: 'cover',
            maxHeight: '60vh'
          }}
        />
        
        {/* Photo metadata overlay */}
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {photo.dimensions.width} × {photo.dimensions.height}
        </div>
        
        {/* Timestamp overlay */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          📅 {formatTimestamp(photo.timestamp)}
        </div>
      </div>

      {/* Photo Info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="font-semibold text-gray-800">Detalles de la Foto</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Tamaño:</span> {formatFileSize(photo.file.size)}
          </div>
          <div>
            <span className="font-medium">Formato:</span> JPEG
          </div>
          <div>
            <span className="font-medium">Dimensiones:</span> {photo.dimensions.width}×{photo.dimensions.height}
          </div>
          <div>
            <span className="font-medium">Calidad:</span> Alta (90%)
          </div>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-800">Error al Subir</h4>
              <p className="text-red-600 text-sm">{uploadError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`
            w-full party-button text-lg py-4 flex items-center justify-center space-x-2
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isUploading ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Subiendo a la Pared de la Fiesta...</span>
            </>
          ) : (
            <>
              <span className="text-xl">⬆️</span>
              <span>Subir Foto</span>
            </>
          )}
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onRetake}
            disabled={isUploading}
            className={`
              bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg 
              transition-colors flex items-center justify-center space-x-2
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <span className="text-lg">🔄</span>
            <span>Retomar</span>
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              disabled={isUploading}
              className={`
                bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg 
                transition-colors flex items-center justify-center space-x-2
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-lg">✕</span>
              <span>Cancelar</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload Progress Information */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-pulse text-blue-500 text-xl">📤</div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800">Subiendo Foto</h4>
              <p className="text-blue-600 text-sm">
                Tu foto se está agregando a la pared de la fiesta. ¡Aparecerá en la pantalla grande pronto!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-gray-500 text-sm space-y-1">
        <p>📸 Tu foto aparecerá en el collage en vivo de la fiesta</p>
        <p>🖥️ Todos la verán en la pantalla del proyector</p>
        <p>🎉 ¡Comparte recuerdos durante toda la fiesta!</p>
      </div>
    </div>
  );
};

export default PhotoPreview;