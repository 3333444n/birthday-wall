import React, { useState, useCallback } from 'react';

interface CanvasControlsProps {
  canvas: HTMLCanvasElement | null;
  onClear?: () => void;
  onUndo?: () => void;
  onSave?: () => void;
  disabled?: boolean;
  isUndoAvailable?: boolean;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  canvas,
  onClear,
  onUndo,
  onSave,
  disabled = false,
  isUndoAvailable = false,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Handle clear canvas
  const handleClear = useCallback(() => {
    if (!canvas) return;
    
    if (showClearConfirm) {
      // Clear the canvas using the exposed clearCanvas method
      if ((canvas as any).clearCanvas) {
        (canvas as any).clearCanvas();
      } else {
        // Fallback: clear with 2D context
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      onClear?.();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  }, [canvas, showClearConfirm, onClear]);

  // Handle undo last action (simplified - just show the button for now)
  const handleUndo = useCallback(() => {
    console.log('Undo functionality - to be implemented');
    onUndo?.();
  }, [onUndo]);

  // Handle save canvas
  const handleSave = useCallback(() => {
    if (!canvas) return;
    
    // Save as image
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `birthday-drawing-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    onSave?.();
  }, [canvas, onSave]);

  return (
    <div className="bg-gray-50 rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-serif text-black mb-4">Controles del Lienzo</h3>
      
      <div className="space-y-2">
        {/* Undo Button */}
        <button
          onClick={handleUndo}
          disabled={disabled || !isUndoAvailable}
          className={`
            w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${isUndoAvailable && !disabled
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Deshacer
        </button>

        {/* Clear Button */}
        <button
          onClick={handleClear}
          disabled={disabled}
          className={`
            w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${showClearConfirm
              ? 'bg-red-600 text-white animate-pulse'
              : disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
            }
          `}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          {showClearConfirm ? 'Toca de Nuevo para Borrar' : 'Borrar Todo'}
        </button>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={disabled}
          className={`
            w-full py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
            ${disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
            }
          `}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Guardar Lienzo
        </button>

        {/* Canvas Info */}
        <div className="text-xs text-gray-500 text-center pt-2">
          {canvas && (
            <div>
              Size: {canvas.width} × {canvas.height}
            </div>
          )}
        </div>
      </div>

      {/* Instructions for mobile */}
      <div className="mt-4 text-xs text-gray-500 bg-gray-50 rounded p-2">
        <div className="font-medium mb-1">Drawing Tips:</div>
        <ul className="space-y-1">
          <li>• Use your finger to draw</li>
          <li>• Drawings sync in real-time</li>
          <li>• Clear removes everything</li>
          <li>• Save preserves your work</li>
        </ul>
      </div>
    </div>
  );
};

export default CanvasControls;