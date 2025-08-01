import React, { useEffect, useRef, useState } from 'react';

interface SimpleCanvasProps {
  width?: number;
  height?: number;
  selectedTool: {
    color: string;
    strokeWidth: number;
    tool: 'brush' | 'eraser';
  };
  onCanvasReady?: (canvas: any) => void;
  onDrawingUpdate?: (drawing: any) => void;
  zoom?: number;
}

export const DrawingCanvas: React.FC<SimpleCanvasProps> = ({
  width = 400,
  height = 300,
  selectedTool,
  onCanvasReady,
  onDrawingUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Configure context
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    setContext(ctx);
    onCanvasReady?.(canvas);
  }, [width, height, onCanvasReady]);

  // Update brush settings
  useEffect(() => {
    if (!context) return;

    context.lineWidth = selectedTool.strokeWidth;
    context.strokeStyle = selectedTool.color;
    context.globalCompositeOperation = selectedTool.tool === 'eraser' ? 'destination-out' : 'source-over';
  }, [context, selectedTool]);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!context || !canvasRef.current) return;

    setIsDrawing(true);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Notify parent of drawing update
    if (onDrawingUpdate && canvasRef.current) {
      const drawingData = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        color: selectedTool.color,
        strokeWidth: selectedTool.strokeWidth,
        dataURL: canvasRef.current.toDataURL(),
      };
      onDrawingUpdate(drawingData);
    }
  };

  // Clear canvas function
  const clearCanvas = () => {
    if (!context || !canvasRef.current) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  // Expose clear function to parent
  useEffect(() => {
    if (onCanvasReady && canvasRef.current) {
      const canvas = canvasRef.current;
      (canvas as any).clearCanvas = clearCanvas;
    }
  }, [onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      className="bg-white cursor-crosshair block"
      style={{
        touchAction: 'none',
        userSelect: 'none',
        width: `${width}px`,
        height: `${height}px`,
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};

export default DrawingCanvas;