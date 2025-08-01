import React, { useState, useCallback } from 'react';
import { DrawingCanvas } from '../components/Canvas/DrawingCanvas';
import { CanvasToolbar } from '../components/Canvas/CanvasToolbar';
import { CanvasControls } from '../components/Canvas/CanvasControls';
import { DrawingTool } from '../types';
import { addDrawing } from '../utils/firestore';

const Draw: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    color: '#FF6B6B',
    strokeWidth: 5, // Fixed default brush size
    tool: 'brush',
  });
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Handle tool changes from toolbar
  const handleToolChange = useCallback((tool: DrawingTool) => {
    setSelectedTool(tool);
  }, []);

  // Handle canvas ready
  const handleCanvasReady = useCallback((canvasElement: HTMLCanvasElement) => {
    setCanvas(canvasElement);
  }, []);

  // Handle drawing updates
  const handleDrawingUpdate = useCallback((drawing: any) => {
    console.log('Drawing updated:', drawing);
    setHasDrawing(true);
    setUploadSuccess(false);
  }, []);

  // Handle canvas clear
  const handleClear = useCallback(() => {
    console.log('Canvas cleared');
    setHasDrawing(false);
    setUploadSuccess(false);
  }, []);

  // Handle undo
  const handleUndo = useCallback(() => {
    console.log('Undo last action');
  }, []);

  // Handle upload drawing to wall
  const handleUpload = useCallback(async () => {
    if (!canvas || !hasDrawing || isUploading) return;
    
    try {
      setIsUploading(true);
      await addDrawing(canvas);
      setUploadSuccess(true);
      setHasDrawing(false);
      
      // Clear canvas after successful upload
      if ((canvas as any).clearCanvas) {
        (canvas as any).clearCanvas();
      }
      
      // Hide success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      console.error('Error uploading drawing:', error);
      alert('Error al subir el dibujo. Por favor intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  }, [canvas, hasDrawing, isUploading]);

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  }, []);
  
  const handleResetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // Full canvas dimensions for projector wall (large canvas)
  const getCanvasDimensions = () => {
    // Large canvas that matches projector wall proportions
    return {
      width: 1200,  // Large width for full wall
      height: 800,  // Large height for full wall
    };
  };

  const { width, height } = getCanvasDimensions();

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-6xl text-black font-serif leading-tight mb-4">
          Dibujar Juntos
        </h1>
        <p className="text-2xl text-gray-600 font-serif">
          Tu arte aparece en la pantalla grande
        </p>
      </div>

      {/* Upload Success Message */}
      {uploadSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          ¡Dibujo Subido! Tu arte ahora está en la pared de la fiesta
        </div>
      )}

      {/* Zoom Controls */}
      <div className="fixed top-20 right-4 z-40 bg-white rounded-lg shadow-lg p-2 space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold hover:bg-blue-600 active:scale-95 transition-transform"
        >
          +
        </button>
        <div className="text-center text-xs text-gray-600 font-serif px-1">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={handleZoomOut}
          className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xl font-bold hover:bg-blue-600 active:scale-95 transition-transform"
        >
          −
        </button>
        <button
          onClick={handleResetZoom}
          className="w-12 h-12 bg-gray-500 text-white rounded-lg flex items-center justify-center text-xs hover:bg-gray-600 active:scale-95 transition-transform"
        >
          Ajustar
        </button>
      </div>

      {/* Main Canvas Area - Scrollable Viewport */}
      <div className="bg-gray-50 rounded-2xl shadow-lg p-4 mb-8">
        <div 
          className="relative overflow-auto border border-gray-300 rounded-lg bg-white"
          style={{
            width: '100%',
            height: '70vh', // Fixed viewport height
          }}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              width: `${width}px`,
              height: `${height}px`,
            }}
          >
            <DrawingCanvas
              width={width}
              height={height}
              selectedTool={selectedTool}
              onCanvasReady={handleCanvasReady}
              onDrawingUpdate={handleDrawingUpdate}
            />
          </div>
        </div>
        
        {/* Canvas Info */}
        <div className="mt-4 text-sm text-gray-600 font-serif text-center">
          Lienzo completo: {width} × {height} | Zoom: {Math.round(zoom * 100)}% | Desplázate para explorar
        </div>
      </div>

      {/* Drawing Tools */}
      <div className="space-y-6">
        {/* Color and Tool Selection */}
        <CanvasToolbar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
        />

        {/* Upload Button */}
        <div className="mb-6">
          <button
            onClick={handleUpload}
            disabled={!hasDrawing || isUploading}
            className={`
              w-full py-4 px-6 rounded-2xl text-xl font-serif font-bold transition-all duration-200 flex items-center justify-center gap-3
              ${hasDrawing && !isUploading
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 11-1.414 1.414L11 4.414V13a1 1 0 11-2 0V4.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                {hasDrawing ? 'Subir Dibujo a la Pared' : 'Dibuja algo primero'}
              </>
            )}
          </button>
        </div>

        {/* Canvas Controls */}
        <CanvasControls
          canvas={canvas}
          onClear={handleClear}
          onUndo={handleUndo}
        />
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-2xl text-black font-serif mb-4">Cómo Dibujar</h3>
          <div className="space-y-3 text-lg text-gray-700 font-serif">
            <p>🎨 Usa zoom + y - para encontrar tu espacio en el lienzo</p>
            <p>✏️ Dibuja con tu dedo en pantallas táctiles</p>
            <p>🌈 Elige colores con las herramientas de arriba</p>
            <p>⬆️ Presiona "Subir Dibujo" cuando termines</p>
            <p>📺 Tu arte aparecerá instantáneamente en el proyector</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-serif flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Conectado
        </div>
      </div>
    </div>
  );
};

export default Draw;