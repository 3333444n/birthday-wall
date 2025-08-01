import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BouncingObject, SlideProps } from '../../types';
import SlideContainer from './SlideContainer';
import QRCode from 'react-qr-code';

const BouncingSlide: React.FC<SlideProps> = ({ isActive, duration }) => {
  const [bouncingObject, setBouncingObject] = useState<BouncingObject | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [cornerHits, setCornerHits] = useState(0);
  const animationFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Birthday person's photos - in a real app, these would come from Firebase
  const birthdayPhotos = [
    '/birthday-photos/photo1.jpg',
    '/birthday-photos/photo2.jpg',
    '/birthday-photos/photo3.jpg',
    '/birthday-photos/photo4.jpg',
    // Add more photos as needed - fallback to emojis if no photos
  ];

  // Fallback to emoji faces if no photos
  const emojiPhotos = ['🎂', '🎉', '🎈', '🎁', '🥳', '🎊', '🍰', '🌟', '🎭', '🎯', '🎪', '🎨'];

  const photos = birthdayPhotos.length > 0 && birthdayPhotos[0] !== '/birthday-photos/photo1.jpg' 
    ? birthdayPhotos 
    : emojiPhotos;

  // Initialize bouncing object
  const initializeBouncingObject = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const size = 120; // Size of the bouncing object

    return {
      x: Math.random() * (containerRect.width - size),
      y: Math.random() * (containerRect.height - size),
      vx: (Math.random() - 0.5) * 8, // Random velocity between -4 and 4
      vy: (Math.random() - 0.5) * 8,
      width: size,
      height: size,
      imageUrl: photos[0]
    };
  }, [photos]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isActive || !bouncingObject || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    
    setBouncingObject(prev => {
      if (!prev) return prev;

      let newX = prev.x + prev.vx;
      let newY = prev.y + prev.vy;
      let newVx = prev.vx;
      let newVy = prev.vy;
      let newPhotoIndex = currentPhotoIndex;
      let newCornerHits = cornerHits;

      // Bounce off walls and change photo
      if (newX <= 0 || newX >= containerRect.width - prev.width) {
        newVx = -newVx;
        newX = newX <= 0 ? 0 : containerRect.width - prev.width;
        newPhotoIndex = (newPhotoIndex + 1) % photos.length;
        
        // Check for corner hit
        if ((newY <= 0) || (newY >= containerRect.height - prev.height)) {
          newCornerHits++;
        }
      }

      if (newY <= 0 || newY >= containerRect.height - prev.height) {
        newVy = -newVy;
        newY = newY <= 0 ? 0 : containerRect.height - prev.height;
        newPhotoIndex = (newPhotoIndex + 1) % photos.length;
        
        // Check for corner hit
        if ((newX <= 0) || (newX >= containerRect.width - prev.width)) {
          newCornerHits++;
        }
      }

      // Update photo index if it changed
      if (newPhotoIndex !== currentPhotoIndex) {
        setCurrentPhotoIndex(newPhotoIndex);
      }

      // Update corner hits if it changed
      if (newCornerHits !== cornerHits) {
        setCornerHits(newCornerHits);
      }

      return {
        ...prev,
        x: newX,
        y: newY,
        vx: newVx,
        vy: newVy,
        imageUrl: photos[newPhotoIndex]
      };
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isActive, bouncingObject, currentPhotoIndex, cornerHits, photos]);

  // Initialize and start animation when slide becomes active
  useEffect(() => {
    if (isActive && !bouncingObject) {
      const newObj = initializeBouncingObject();
      if (newObj) {
        setBouncingObject(newObj);
      }
    }

    if (isActive && bouncingObject) {
      animate();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, bouncingObject, animate, initializeBouncingObject]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isActive) {
        const newObj = initializeBouncingObject();
        if (newObj) {
          setBouncingObject(newObj);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, initializeBouncingObject]);

  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';
  const drawUrl = `${window.location.origin}/draw`;

  return (
    <SlideContainer isActive={isActive} duration={duration}>
      <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
            🏀 Bouncing {birthdayPersonName}!
          </h1>
          <p className="text-2xl text-white/80 mt-2">
            {cornerHits > 0 ? `${cornerHits} corner hit${cornerHits !== 1 ? 's' : ''}! 🎉` : 'Watch for corner hits!'}
          </p>
        </div>

        {/* QR Code */}
        <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-2xl z-10">
          <div className="text-center mb-3">
            <p className="text-gray-800 font-semibold">Join the Fun!</p>
            <p className="text-gray-600 text-sm">Scan to draw & photo</p>
          </div>
          <QRCode
            size={120}
            value={drawUrl}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Bouncing Object */}
        {bouncingObject && (
          <div
            className="absolute transition-none rounded-full shadow-2xl z-20"
            style={{
              left: `${bouncingObject.x}px`,
              top: `${bouncingObject.y}px`,
              width: `${bouncingObject.width}px`,
              height: `${bouncingObject.height}px`,
              transform: 'translate3d(0, 0, 0)', // Hardware acceleration
            }}
          >
            {photos === emojiPhotos ? (
              // Emoji display
              <div className="w-full h-full flex items-center justify-center text-8xl bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/50">
                {bouncingObject.imageUrl}
              </div>
            ) : (
              // Photo display
              <img
                src={bouncingObject.imageUrl}
                alt={`${birthdayPersonName} bouncing`}
                className="w-full h-full object-cover rounded-full border-4 border-white/50"
                onError={(e) => {
                  // Fallback to emoji if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center text-8xl bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/50">
                      ${emojiPhotos[currentPhotoIndex % emojiPhotos.length]}
                    </div>
                  `;
                }}
              />
            )}
          </div>
        )}

        {/* Corner hit celebration */}
        {cornerHits > 0 && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
              <div className="text-9xl">🎯</div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-4">
            <p className="text-white text-lg">
              Everyone cheer when it hits a corner! 🎉
            </p>
          </div>
        </div>

        {/* Photo counter */}
        <div className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 z-10">
          <p className="text-white font-semibold">
            Photo {currentPhotoIndex + 1} of {photos.length}
          </p>
        </div>
      </div>
    </SlideContainer>
  );
};

export default BouncingSlide;