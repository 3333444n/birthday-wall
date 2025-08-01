import React, { useEffect, useState, useRef } from 'react';
import { SlideProps } from '../../types';

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

  // Import face images from assets
  const faceImages = [
    new URL('../../assets/faces/dany0.webp', import.meta.url).href,
    new URL('../../assets/faces/dany1.webp', import.meta.url).href,
    new URL('../../assets/faces/dany2.webp', import.meta.url).href,
    new URL('../../assets/faces/dany3.webp', import.meta.url).href,
    new URL('../../assets/faces/dany4.webp', import.meta.url).href,
    new URL('../../assets/faces/dany5.webp', import.meta.url).href,
    new URL('../../assets/faces/dany6.webp', import.meta.url).href,
    new URL('../../assets/faces/dany7.webp', import.meta.url).href,
    new URL('../../assets/faces/dany8.webp', import.meta.url).href,
    new URL('../../assets/faces/dany9.webp', import.meta.url).href,
    new URL('../../assets/faces/dany10.webp', import.meta.url).href,
    new URL('../../assets/faces/dany11.webp', import.meta.url).href
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

  const getRandomFaceIndex = () => {
    return Math.floor(Math.random() * faceImages.length);
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
        currentPhotoIndexRef.current = getRandomFaceIndex(); // Random face instead of sequential
        
        // Update face image directly (animationBoxRef is now the img element)
        if (animationBoxRef.current) {
          (animationBoxRef.current as HTMLImageElement).src = faceImages[currentPhotoIndexRef.current];
        }
        console.log('🔄 X bounce - Random face #:', currentPhotoIndexRef.current);
      }
      newX = newX + 3 * directionRef.current.x;

      // Bounce Y direction  
      if (oldY <= 0 || oldY >= maxRef.current.y) {
        directionRef.current.y *= -1;
        currentPhotoIndexRef.current = getRandomFaceIndex(); // Random face instead of sequential

        // Update face image directly (animationBoxRef is now the img element)
        if (animationBoxRef.current) {
          (animationBoxRef.current as HTMLImageElement).src = faceImages[currentPhotoIndexRef.current];
        }
        console.log('🔄 Y bounce - Random face #:', currentPhotoIndexRef.current);
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
      
      // Initialize with random color and random starting face
      const initialColor = getRandomColor();
      currentColorRef.current = initialColor;
      currentPhotoIndexRef.current = getRandomFaceIndex(); // Start with random face
      
      // Reset position to center of screen
      positionRef.current = { x: 300, y: 200 };
      directionRef.current = { x: 1, y: 1 };
      
      console.log('🎲 Starting with random face #:', currentPhotoIndexRef.current);
      
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
    <div className="fixed inset-0 w-full h-full bg-black z-10">
      {/* Pure Bouncing Face - No Container, Just Image */}
      <img
        ref={animationBoxRef}
        src={faceImages[currentPhotoIndexRef.current % faceImages.length]}
        alt={`${birthdayPersonName} bouncing`}
        className="absolute object-cover rounded-full shadow-2xl z-30"
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