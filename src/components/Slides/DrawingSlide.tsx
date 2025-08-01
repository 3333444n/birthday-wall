import React, { useEffect, useState, useRef } from 'react';
import { Drawing, SlideProps } from '../../types';
import { subscribeToDrawings, getDrawingWithImage } from '../../utils/firestore';
import QRCode from 'react-qr-code';

const DrawingSlide: React.FC<SlideProps> = ({ isActive }) => {
  const [drawings, setDrawings] = useState<Array<Drawing & { imageData?: string }>>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Listen for real-time drawings with error handling
  useEffect(() => {
    if (!isActive) return;

    const unsubscribe = subscribeToDrawings(async (rawDrawings) => {
      try {
        console.log('DrawingSlide: Received raw drawings:', rawDrawings.length);
        
        // Get image data for each drawing
        const drawingsWithImages = await Promise.all(
          rawDrawings.map(async (drawing) => {
            const result = await getDrawingWithImage(drawing);
            console.log('DrawingSlide: Processing drawing', drawing.id, 'has imageData:', !!result.imageData);
            return result;
          })
        );
        
        console.log('DrawingSlide: Processed drawings with images:', drawingsWithImages.length);
        setDrawings(drawingsWithImages);
      } catch (error) {
        console.warn('Error loading drawing images:', error);
        setDrawings([]);
      }
    });

    return () => unsubscribe();
  }, [isActive]);

  // Display drawings on canvas when they update
  useEffect(() => {
    if (!canvasRef.current || !isActive || drawings.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('DrawingSlide: Rendering', drawings.length, 'drawings to canvas');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load and composite all drawings sequentially
    let loadedCount = 0;
    const totalDrawings = drawings.filter(d => d.imageData).length;
    
    if (totalDrawings === 0) {
      console.log('DrawingSlide: No drawings with imageData to render');
      return;
    }

    drawings.forEach((drawing, index) => {
      if (drawing.imageData) {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          console.log('DrawingSlide: Loaded image', index + 1, 'of', totalDrawings);
          
          // Use different blend modes for layering
          if (loadedCount === 1) {
            // First drawing - draw normally
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
          } else {
            // Subsequent drawings - blend with what's already there
            ctx.globalAlpha = 0.7;
            ctx.globalCompositeOperation = 'multiply';
          }
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Reset for next drawing
          ctx.globalAlpha = 1.0;
          ctx.globalCompositeOperation = 'source-over';
          
          if (loadedCount === totalDrawings) {
            console.log('DrawingSlide: All drawings rendered successfully');
          }
        };
        img.onerror = (error) => {
          console.error('DrawingSlide: Failed to load drawing image:', error);
        };
        img.src = drawing.imageData;
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