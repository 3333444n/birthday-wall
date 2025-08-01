import React, { useState, useEffect } from 'react';
import { PhotoData } from '../../types';
import { photoService } from '../../services/firestore';

interface PhotoGridProps {
  maxPhotos?: number;
  columns?: number;
  showTimestamps?: boolean;
  onPhotoClick?: (photo: PhotoData) => void;
  className?: string;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
  maxPhotos = 12,
  columns = 3,
  showTimestamps = false,
  onPhotoClick,
  className = ''
}) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let mounted = true;

    const setupRealtimeSync = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        setError(null);

        // First try to get initial data
        const initialPhotos = await photoService.getRecent(maxPhotos);
        if (mounted) {
          setPhotos(initialPhotos);
          setLoading(false);
        }

        // Then setup real-time listener
        unsubscribe = photoService.onSnapshot(
          (updatedPhotos) => {
            if (mounted) {
              // Limit to maxPhotos and ensure newest first
              const limitedPhotos = updatedPhotos.slice(0, maxPhotos);
              setPhotos(limitedPhotos);
              setLoading(false);
            }
          },
          maxPhotos
        );
      } catch (err) {
        console.error('Failed to setup photo sync:', err);
        if (mounted) {
          // Instead of showing error immediately, show empty state
          setPhotos([]);
          setLoading(false);
          setError(null);
        }
      }
    };

    setupRealtimeSync();

    return () => {
      mounted = false;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.warn('Error cleaning up photo subscription:', err);
        }
      }
    };
  }, [maxPhotos]);

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getGridClassName = () => {
    const baseClass = 'grid gap-2';
    switch (columns) {
      case 2: return `${baseClass} grid-cols-2`;
      case 3: return `${baseClass} grid-cols-3`;
      case 4: return `${baseClass} grid-cols-4`;
      case 6: return `${baseClass} grid-cols-6`;
      default: return `${baseClass} grid-cols-3`;
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-5 h-5 border-2 border-party-primary border-t-transparent rounded-full"></div>
          <span className="text-gray-600">Loading party photos...</span>
        </div>
        
        {/* Loading skeleton */}
        <div className={getGridClassName()}>
          {Array.from({ length: Math.min(maxPhotos, 6) }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center"
            >
              <span className="text-gray-400 text-lg">📷</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Failed to Load Photos
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="party-button"
        >
          🔄 Refresh Page
        </button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-4">📸</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Photos Yet
        </h3>
        <p className="text-gray-600 mb-4">
          Be the first to share a memory! Take a photo to get the party started.
        </p>
        <div className={getGridClassName()}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
            >
              <span className="text-gray-400 text-2xl">📷</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Photo Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          🖼️ Party Photos ({photos.length})
        </h3>
        {photos.length > 0 && (
          <div className="text-sm text-gray-500">
            Updated {formatTimestamp(photos[0]?.timestamp || Date.now())}
          </div>
        )}
      </div>

      {/* Photo Grid */}
      <div className={getGridClassName()}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={`
              relative aspect-square rounded-lg overflow-hidden shadow-sm
              ${onPhotoClick ? 'cursor-pointer hover:shadow-md' : ''}
              transition-all duration-200 group
            `}
            onClick={() => onPhotoClick?.(photo)}
          >
            {/* Photo Image */}
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={`Party photo ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              onError={(e) => {
                // Fallback to full resolution if thumbnail fails
                const target = e.target as HTMLImageElement;
                if (target.src !== photo.url) {
                  target.src = photo.url;
                }
              }}
            />

            {/* Overlay */}
            {(showTimestamps || onPhotoClick) && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200">
                {/* Timestamp */}
                {showTimestamps && (
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatTimestamp(photo.timestamp)}
                  </div>
                )}

                {/* Click indicator */}
                {onPhotoClick && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      👀 View
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* New photo indicator */}
            {index === 0 && photos.length > 1 && (
              <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                New!
              </div>
            )}
          </div>
        ))}

        {/* Empty slots for visual consistency */}
        {photos.length < maxPhotos && (
          <>
            {Array.from({ length: Math.min(maxPhotos - photos.length, 6) }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200"
              >
                <span className="text-gray-300 text-xl">📷</span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="text-center text-gray-500 text-sm">
        <p>📱 Photos appear automatically as guests take them</p>
        <p>🎉 Keep sharing memories throughout the party!</p>
      </div>
    </div>
  );
};

export default PhotoGrid;