import React, { useState, useCallback } from 'react';
import { DrawingCanvas } from '../components/Canvas/DrawingCanvas';
import { CanvasToolbar } from '../components/Canvas/CanvasToolbar';
import { CanvasControls } from '../components/Canvas/CanvasControls';
import { DrawingTool } from '../types';

const Draw: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<DrawingTool>({
    color: '#FF6B6B',
    strokeWidth: 5,
    tool: 'brush',
  });
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

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
    // Here you could save to Firebase if needed
  }, []);

  // Handle canvas clear
  const handleClear = useCallback(() => {
    console.log('Canvas cleared');
  }, []);

  // Handle undo
  const handleUndo = useCallback(() => {
    console.log('Undo last action');
  }, []);

  // Handle save
  const handleSave = useCallback(() => {
    console.log('Canvas saved');
  }, []);

  // Get canvas dimensions for mobile
  const getCanvasDimensions = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Mobile-first responsive canvas
    if (screenWidth < 768) {
      return {
        width: Math.min(screenWidth - 32, 400), // Account for padding
        height: Math.min(screenHeight * 0.4, 300),
      };
    }
    
    // Tablet and desktop
    return {
      width: 600,
      height: 400,
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

      {/* Main Canvas Area */}
      <div className="bg-gray-50 rounded-2xl shadow-lg p-6 mb-8">
        <DrawingCanvas
          width={width}
          height={height}
          selectedTool={selectedTool}
          onCanvasReady={handleCanvasReady}
          onDrawingUpdate={handleDrawingUpdate}
        />
      </div>

      {/* Drawing Tools */}
      <div className="space-y-6">
        {/* Color and Tool Selection */}
        <CanvasToolbar
          selectedTool={selectedTool}
          onToolChange={handleToolChange}
        />

        {/* Canvas Controls */}
        <CanvasControls
          canvas={canvas}
          onClear={handleClear}
          onUndo={handleUndo}
          onSave={handleSave}
        />
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-2xl text-black font-serif mb-4">Cómo Dibujar</h3>
          <div className="space-y-3 text-lg text-gray-700 font-serif">
            <p>Usa tu dedo o lápiz para dibujar en el lienzo</p>
            <p>Elige colores y tamaños de pincel de las herramientas de arriba</p>
            <p>Tu arte se sincroniza instantáneamente con el proyector</p>
            <p>¡Todos en la fiesta verán tu creación!</p>
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