import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { DrawingData, SlideProps } from '../../types';
import SlideContainer from './SlideContainer';
import QRCode from 'react-qr-code';

const DrawingSlide: React.FC<SlideProps> = ({ isActive, duration }) => {
  const [drawings, setDrawings] = useState<DrawingData[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Listen for real-time drawings with error handling
  useEffect(() => {
    if (!isActive) return;

    const unsubscribe = onSnapshot(
      collection(db, 'drawings'),
      (snapshot) => {
        const drawingData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DrawingData[];
        setDrawings(drawingData);
      },
      (error) => {
        console.warn('Drawings unavailable (offline mode):', error);
        // Set empty array in offline mode - component will show instructions
        setDrawings([]);
      }
    );

    return () => unsubscribe();
  }, [isActive]);

  // Display drawings on canvas when they update
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If we have drawing URLs, load and display them
    drawings.forEach((drawing) => {
      if (drawing.url) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = drawing.url;
      }
    });
  }, [drawings, isActive]);

  // Set canvas size to full screen
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const drawUrl = `${window.location.origin}/draw`;

  return (
    <SlideContainer isActive={isActive} duration={duration}>
      <div className="relative w-full h-full bg-white">
        {/* Canvas Display */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'white' }}
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Title */}
          <div className="absolute top-8 left-8">
            <h1 className="text-6xl font-bold text-gray-800 drop-shadow-lg">
              🎨 Collaborative Drawing
            </h1>
            <p className="text-2xl text-gray-600 mt-2">
              {drawings.length} drawing{drawings.length !== 1 ? 's' : ''} from party guests
            </p>
          </div>

          {/* QR Code for drawing */}
          <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-2xl">
            <div className="text-center mb-3">
              <p className="text-gray-800 font-semibold">Draw Something!</p>
              <p className="text-gray-600 text-sm">Scan to add your art</p>
            </div>
            <QRCode
              size={120}
              value={drawUrl}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          {/* Instructions */}
          {drawings.length === 0 && (
            <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center">
              <div className="bg-gray-100/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-300">
                <h2 className="text-4xl text-gray-800 mb-4">✨ Ready for Your Art!</h2>
                <p className="text-xl text-gray-600">
                  Scan the QR code with your phone to start drawing together
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SlideContainer>
  );
};

export default DrawingSlide;