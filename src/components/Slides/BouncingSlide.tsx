import React, { useEffect, useState, useRef } from 'react';
// Removed import
interface SlideProps {
  isActive: boolean;
  onSlideComplete?: () => void;
  duration?: number;
}

const BouncingSlide: React.FC<SlideProps> = ({ isActive }) => {
  console.log('🏀 BouncingSlide component called with:', { isActive });
  const [cornerHits, setCornerHits] = useState(0);
  const [isCornerCelebrating, setIsCornerCelebrating] = useState(false);

  const animationBoxRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<number | null>(null);
  const cornerAnimationTimerRef = useRef<number | null>(null);
  const framesSinceCornerRef = useRef(0);
  const cornerDetectionRef = useRef(true);

  // Animation state using refs to avoid re-renders
  const positionRef = useRef({ x: 100, y: 100 });
  const directionRef = useRef({ x: 1, y: 1 });
  const maxRef = useRef({ x: 0, y: 0 });
  const currentColorRef = useRef('#ff6b6b');
  const currentPhotoIndexRef = useRef(0);

  // Import Kike photos from public/birthday-photos
  const faceImages = [
    '/birthday-photos/kike1.webp',
    '/birthday-photos/kike2.webp',
    '/birthday-photos/kike3.webp',
    '/birthday-photos/kike4.webp',
    '/birthday-photos/kike5.webp',
    '/birthday-photos/kike6.webp',
    '/birthday-photos/kike7.webp',
    '/birthday-photos/kike8.webp',
    '/birthday-photos/kike9.webp',
    '/birthday-photos/kike10.webp',
    '/birthday-photos/kike11.webp',
    '/birthday-photos/kike12.webp',
    '/birthday-photos/kike13.webp',
    '/birthday-photos/kike14.webp',
    '/birthday-photos/kike15.webp',
    '/birthday-photos/kike16.webp'
  ];


  // Utility functions adapted from jQuery snippet
  const getRandomColor = () => {
    const characters = "123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * 15);
      color += characters[randomIndex] + characters[randomIndex];
    }
    return color;
  };

  const getNextFaceIndex = (currentIndex: number) => {
    // Sequential cycling: go to next photo in order
    return (currentIndex + 1) % faceImages.length;
  };

  const almostEqual = (a: number, b: number) => Math.abs(a - b) <= 5;

  const detectCorner = (newX: number, newY: number, maxX: number, maxY: number, w: number, h: number) => {
    const newXwidth = newX + w;
    const newYheight = newY + h;

    const topLeft = almostEqual(newX, 0) && almostEqual(newY, 0);
    const topRight = almostEqual(newXwidth, maxX) && almostEqual(newY, 0);
    const bottomRight = almostEqual(newXwidth, maxX) && almostEqual(newYheight, maxY);
    const bottomLeft = almostEqual(newX, 0) && almostEqual(newYheight, maxY);

    if (topLeft || topRight || bottomRight || bottomLeft) {
      onCornerHit();
      return true;
    }
    return false;
  };

  const onCornerHit = () => {
    if (cornerAnimationTimerRef.current) {
      clearInterval(cornerAnimationTimerRef.current);
    }

    setCornerHits(prev => prev + 1);
    setIsCornerCelebrating(true);
    let animationCount = 0;
    const newColor = getRandomColor();

    const vibrateRed = () => {
      if (animationBoxRef.current) {
        if (animationCount % 2 === 0) {
          currentColorRef.current = newColor;
          animationBoxRef.current.style.borderColor = newColor;
          animationBoxRef.current.style.backgroundColor = newColor;
          animationBoxRef.current.style.boxShadow = `0 0 20px ${newColor}`;
        } else {
          animationBoxRef.current.style.borderColor = '#ff0000';
          animationBoxRef.current.style.backgroundColor = '#ff0000';
          animationBoxRef.current.style.boxShadow = '0 0 20px #ff0000';
        }
      }

      if (++animationCount > 26) {
        if (cornerAnimationTimerRef.current) {
          clearInterval(cornerAnimationTimerRef.current);
        }
        setIsCornerCelebrating(false);
      }
    };

    cornerAnimationTimerRef.current = window.setInterval(vibrateRed, 60);
  };

  const movingBox = () => {
    if (!animationBoxRef.current || !isActive) {
      console.log('❌ Animation not starting - missing refs or not active');
      return;
    }

    console.log('🎯 Starting animation loop...');
    const frameTimerInterval = 50; // Slower for debugging
    let oldX = positionRef.current.x;
    let oldY = positionRef.current.y;

    const frame = () => {
      if (!animationBoxRef.current || !isActive) return;

      // Use window dimensions since we're fixed positioned
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const boxWidth = 360; // Double size
      const boxHeight = 360;

      maxRef.current.x = windowWidth - boxWidth;
      maxRef.current.y = windowHeight - boxHeight;

      let newX = oldX;
      let newY = oldY;

      // Bounce X direction
      if (oldX <= 0 || oldX >= maxRef.current.x) {
        directionRef.current.x *= -1;
        currentPhotoIndexRef.current = getNextFaceIndex(currentPhotoIndexRef.current);

        // Update face image directly (animationBoxRef is now the img element)
        if (animationBoxRef.current) {
          (animationBoxRef.current as HTMLImageElement).src = faceImages[currentPhotoIndexRef.current];
        }
        console.log('🔄 X bounce - Next face #:', currentPhotoIndexRef.current);
      }
      newX = newX + 3 * directionRef.current.x;

      // Bounce Y direction
      if (oldY <= 0 || oldY >= maxRef.current.y) {
        directionRef.current.y *= -1;
        currentPhotoIndexRef.current = getNextFaceIndex(currentPhotoIndexRef.current);

        // Update face image directly (animationBoxRef is now the img element)
        if (animationBoxRef.current) {
          (animationBoxRef.current as HTMLImageElement).src = faceImages[currentPhotoIndexRef.current];
        }
        console.log('🔄 Y bounce - Next face #:', currentPhotoIndexRef.current);
      }
      newY = newY + 3 * directionRef.current.y;

      oldX = newX;
      oldY = newY;
      positionRef.current = { x: newX, y: newY };

      // Update DOM position
      if (animationBoxRef.current) {
        animationBoxRef.current.style.left = `${newX}px`;
        animationBoxRef.current.style.top = `${newY}px`;
      }

      // Check for corner hits
      if (cornerDetectionRef.current && detectCorner(newX, newY, windowWidth, windowHeight, boxWidth, boxHeight)) {
        cornerDetectionRef.current = false;
        framesSinceCornerRef.current = 0;
      } else if (++framesSinceCornerRef.current > 50) {
        cornerDetectionRef.current = true;
        framesSinceCornerRef.current = 0;
      }

      console.log('📍 Position update:', newX, newY);
    };

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(frame, frameTimerInterval);
    console.log('✅ Animation timer started with interval:', frameTimerInterval);
  };

  // Main animation effect
  useEffect(() => {
    if (isActive) {
      console.log('🏀 Starting DVD animation...');

      // Initialize with random color and first face (kike1)
      const initialColor = getRandomColor();
      currentColorRef.current = initialColor;
      currentPhotoIndexRef.current = 0; // Start with first photo (kike1)

      // Reset position to center of screen
      positionRef.current = { x: 300, y: 200 };
      directionRef.current = { x: 1, y: 1 };

      console.log('🎲 Starting with first face (kike1):', currentPhotoIndexRef.current);

      // Start animation immediately (no delay)
      console.log('🚀 Calling movingBox()...');
      movingBox();
    } else {
      console.log('🏀 Stopping DVD animation...');
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (cornerAnimationTimerRef.current) {
        clearInterval(cornerAnimationTimerRef.current);
        cornerAnimationTimerRef.current = null;
      }
      setCornerHits(0);
      setIsCornerCelebrating(false);
    }

    return () => {
      console.log('🧹 Cleanup animation timers...');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (cornerAnimationTimerRef.current) {
        clearInterval(cornerAnimationTimerRef.current);
      }
    };
  }, [isActive]);

  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';

  console.log('BouncingSlide render:', { isActive, cornerHits });

  // Always show something if active to test
  if (isActive) {
    console.log('🏀 BouncingSlide is ACTIVE, rendering...');
  }

  // BYPASS SlideContainer for testing
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
      {/* Pure Bouncing Face - No Container, Just Image */}
      <img
        ref={animationBoxRef}
        src={faceImages[currentPhotoIndexRef.current % faceImages.length]}
        alt={`${birthdayPersonName} bouncing`}
        className="absolute object-contain z-30"
        style={{
          left: `${positionRef.current.x}px`,
          top: `${positionRef.current.y}px`,
          width: '360px',  // Double size
          height: '360px', // Double size
          transition: 'none'
        }}
        onLoad={() => console.log('✅ Face image loaded:', faceImages[currentPhotoIndexRef.current % faceImages.length])}
        onError={(e) => {
          console.log('❌ Face image failed to load, using emoji fallback');
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />

      {/* Corner hit celebration only */}
      {isCornerCelebrating && (
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
            <div className="text-9xl">🎯</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BouncingSlide;