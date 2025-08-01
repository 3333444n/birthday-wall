import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { PhotoData, SlideProps } from '../../types';
import QRCode from 'react-qr-code';

const PhotoSlide: React.FC<SlideProps> = ({ isActive }) => {
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

  // BYPASS SlideContainer to fix black screen issue
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
      {/* QR Code for photos */}
      <div className="absolute top-8 right-8 bg-gray-50 p-4 rounded-xl shadow-lg z-20">
        <div className="text-center mb-3">
          <p className="text-gray-800 font-semibold">Captura Recuerdos</p>
          <p className="text-gray-600 text-sm">Escanea para fotos</p>
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
        <>
          {/* Photo count */}
          <div className="absolute top-8 left-8 z-20">
            <p className="text-3xl text-gray-700 font-serif">
              {photos.length} foto{photos.length !== 1 ? 's' : ''} de la fiesta
            </p>
          </div>

          {/* Photo grid */}
          <div className="absolute inset-0 pt-24 pb-8 px-8">
            <div className="grid grid-cols-6 grid-rows-4 gap-4 h-full w-full">
              {photos.slice(0, 12).map((photo, index) => (
                <div
                  key={photo.id}
                  className={`${getGridItemClass(index)} overflow-hidden rounded-lg shadow-md`}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={`Party photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Show more photos indicator */}
            {photos.length > 12 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-100 rounded-full px-6 py-2">
                <p className="text-gray-700 font-serif text-lg">
                  +{photos.length - 12} fotos más
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-8xl text-black font-serif leading-tight mb-4">
              Compartir Fotos
            </h1>
            <p className="text-4xl text-gray-600 font-serif">
              Escanea el código para capturar recuerdos
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoSlide;