import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { PhotoData, SlideProps } from '../../types';
import SlideContainer from './SlideContainer';
import QRCode from 'react-qr-code';

const PhotoSlide: React.FC<SlideProps> = ({ isActive, duration }) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);

  // Listen for real-time photos with error handling
  useEffect(() => {
    if (!isActive) return;

    const photosQuery = query(
      collection(db, 'photos'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(
      photosQuery,
      (snapshot) => {
        const photoData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PhotoData[];
        setPhotos(photoData);
      },
      (error) => {
        console.warn('Photos unavailable (offline mode):', error);
        // Set empty array in offline mode - component will show instructions
        setPhotos([]);
      }
    );

    return () => unsubscribe();
  }, [isActive]);

  const photoUrl = `${window.location.origin}/photo`;

  // Create a masonry-style grid layout
  const getGridItemClass = (index: number) => {
    const patterns = [
      'col-span-2 row-span-2', // Large
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-2', // Tall
      'col-span-2 row-span-1', // Wide
      'col-span-1 row-span-1', // Small
      'col-span-1 row-span-1', // Small
    ];
    return patterns[index % patterns.length];
  };

  return (
    <SlideContainer isActive={isActive} duration={duration}>
      <div className="relative w-full h-full p-8 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500">
        {/* Title */}
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
            📸 Party Photo Collage
          </h1>
          <p className="text-2xl text-white/80 mt-2">
            {photos.length} photo{photos.length !== 1 ? 's' : ''} captured live!
          </p>
        </div>

        {/* QR Code for photos */}
        <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-2xl z-10">
          <div className="text-center mb-3">
            <p className="text-gray-800 font-semibold">Take a Photo!</p>
            <p className="text-gray-600 text-sm">Scan to share memories</p>
          </div>
          <QRCode
            size={120}
            value={photoUrl}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <div className="absolute inset-0 pt-32 pb-16 px-8">
            <div className="grid grid-cols-6 grid-rows-4 gap-4 h-full w-full">
              {photos.slice(0, 12).map((photo, index) => (
                <div
                  key={photo.id}
                  className={`${getGridItemClass(index)} overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105`}
                  style={{
                    animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both`
                  }}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={`Party photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Timestamp overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {new Date(photo.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Show more photos indicator */}
            {photos.length > 12 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <p className="text-white font-semibold">
                  +{photos.length - 12} more photos
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-black/50 backdrop-blur-sm rounded-2xl p-12">
              <div className="text-8xl mb-6">📱</div>
              <h2 className="text-4xl text-white mb-4">Capture the Moments!</h2>
              <p className="text-xl text-white/80 mb-6">
                Scan the QR code to take photos and watch them appear instantly
              </p>
              <div className="animate-pulse">
                <div className="text-2xl text-white/60">
                  Waiting for the first photo...
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating hearts animation for new photos */}
        {photos.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-bounce"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${60 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              >
                💖
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideContainer>
  );
};

export default PhotoSlide;