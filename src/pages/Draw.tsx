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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          🎨 Draw Together
        </h1>
        <p className="text-white/90 text-sm md:text-base">
          Your drawings appear on the big screen instantly!
        </p>
      </div>

      {/* Main Canvas Area */}
      <div className="bg-white rounded-lg shadow-xl p-4 mb-6">
        <DrawingCanvas
          width={width}
          height={height}
          selectedTool={selectedTool}
          onCanvasReady={handleCanvasReady}
          onDrawingUpdate={handleDrawingUpdate}
        />
      </div>

      {/* Drawing Tools */}
      <div className="space-y-4">
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
      <div className="mt-6 text-center text-white/80 text-sm">
        <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
          <h3 className="font-semibold mb-2">How to Draw:</h3>
          <ul className="space-y-1 text-xs">
            <li>• Use your finger or stylus to draw on the canvas</li>
            <li>• Choose colors and brush sizes from the toolbar</li>
            <li>• Your artwork syncs in real-time with the projector</li>
            <li>• Everyone at the party can see your drawings instantly!</li>
          </ul>
        </div>
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          Connected
        </div>
      </div>
    </div>
  );
};

export default Draw;