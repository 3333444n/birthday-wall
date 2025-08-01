import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { DrawingData, SlideProps } from '../../types';
import QRCode from 'react-qr-code';

const DrawingSlide: React.FC<SlideProps> = ({ isActive }) => {
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

  // BYPASS SlideContainer to fix black screen issue
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
      {/* Canvas Display */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'white' }}
      />
      
      {/* QR Code for drawing */}
      <div className="absolute top-8 right-8 bg-gray-50 p-4 rounded-xl shadow-lg z-20">
        <div className="text-center mb-3">
          <p className="text-gray-800 font-semibold">Agrega tu Arte</p>
          <p className="text-gray-600 text-sm">Escanea para dibujar</p>
        </div>
        <QRCode
          size={120}
          value={drawUrl}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {/* Title - only show when no drawings */}
      {drawings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <h1 className="text-8xl text-black font-serif leading-tight mb-4">
              Dibujar Juntos
            </h1>
            <p className="text-4xl text-gray-600 font-serif">
              Escanea el código para agregar tu arte
            </p>
          </div>
        </div>
      )}

      {/* Drawing count - only show when there are drawings */}
      {drawings.length > 0 && (
        <div className="absolute top-8 left-8 z-20">
          <p className="text-3xl text-gray-700 font-serif">
            {drawings.length} obra{drawings.length !== 1 ? 's' : ''} de los invitados
          </p>
        </div>
      )}
    </div>
  );
};

export default DrawingSlide;