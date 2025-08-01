import React from 'react';
import { DrawingTool } from '../../types';

interface CanvasToolbarProps {
  selectedTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  disabled?: boolean;
}

// Define 6 party-friendly colors
const DRAWING_COLORS = [
  { color: '#FF6B6B', name: 'Red' },
  { color: '#4ECDC4', name: 'Teal' },
  { color: '#45B7D1', name: 'Blue' },
  { color: '#96CEB4', name: 'Green' },
  { color: '#FECA57', name: 'Yellow' },
  { color: '#FF9FF3', name: 'Pink' },
];

// Define brush sizes
const BRUSH_SIZES = [
  { size: 2, name: 'Fine' },
  { size: 5, name: 'Medium' },
  { size: 10, name: 'Thick' },
];

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  selectedTool,
  onToolChange,
  disabled = false,
}) => {
  const handleColorChange = (color: string) => {
    onToolChange({
      ...selectedTool,
      color,
      tool: 'brush', // Switch to brush when selecting color
    });
  };

  const handleBrushSizeChange = (strokeWidth: number) => {
    onToolChange({
      ...selectedTool,
      strokeWidth,
      tool: 'brush',
    });
  };

  const handleToolChange = (tool: 'brush' | 'eraser') => {
    onToolChange({
      ...selectedTool,
      tool,
      color: tool === 'eraser' ? '#ffffff' : selectedTool.color,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      {/* Color Picker */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Colors</h3>
        <div className="grid grid-cols-6 gap-2">
          {DRAWING_COLORS.map(({ color, name }) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-full border-2 transition-all duration-200
                ${selectedTool.color === color && selectedTool.tool === 'brush'
                  ? 'border-gray-800 scale-110 shadow-md'
                  : 'border-gray-300 hover:border-gray-500 hover:scale-105'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{ backgroundColor: color }}
              aria-label={`Select ${name} color`}
            >
              {selectedTool.color === color && selectedTool.tool === 'brush' && (
                <div className="w-3 h-3 bg-white rounded-full mx-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brush Size */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Brush Size</h3>
        <div className="flex gap-2">
          {BRUSH_SIZES.map(({ size, name }) => (
            <button
              key={size}
              onClick={() => handleBrushSizeChange(size)}
              disabled={disabled}
              className={`
                flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200
                ${selectedTool.strokeWidth === size && selectedTool.tool === 'brush'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`rounded-full ${
                    selectedTool.strokeWidth === size && selectedTool.tool === 'brush'
                      ? 'bg-white'
                      : 'bg-gray-400'
                  }`}
                  style={{
                    width: Math.max(size, 4),
                    height: Math.max(size, 4),
                  }}
                />
                <span>{name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tools */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Tools</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleToolChange('brush')}
            disabled={disabled}
            className={`
              py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${selectedTool.tool === 'brush'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 16 16"
              style={{ width: '16px', height: '16px' }}
            >
              <path d="M15.825.12a.5.5 0 0 1 .132.584c-1.53 3.43-4.743 8.17-7.095 10.64a6.067 6.067 0 0 1-2.373 1.534c-.018.227-.06.538-.16.868-.201.659-.667 1.479-1.708 1.74a8.118 8.118 0 0 1-3.078.132 3.659 3.659 0 0 1-.562-.135 1.382 1.382 0 0 1-.466-.247.714.714 0 0 1-.204-.288.622.622 0 0 1 .004-.443c.095-.245.316-.38.461-.452.394-.197.625-.453.867-.826.095-.144.184-.297.287-.472l.117-.198c.151-.255.326-.54.546-.848.528-.739 1.201-.925 1.746-.896.126.007.243.025.348.048.062-.172.142-.38.238-.608.261-.619.658-1.419 1.187-2.069 2.176-2.67 6.18-6.206 9.117-8.104a.5.5 0 0 1 .596.04z"/>
            </svg>
            Brush
          </button>
          
          <button
            onClick={() => handleToolChange('eraser')}
            disabled={disabled}
            className={`
              py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${selectedTool.tool === 'eraser'
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 16 16"
              style={{ width: '16px', height: '16px' }}
            >
              <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5A2 2 0 0 1 .793 10.5L6.293 5a2 2 0 0 1 1.793-.793zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414l-3.879-3.879zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .866-.54z"/>
            </svg>
            Eraser
          </button>
        </div>
      </div>

      {/* Current tool indicator for mobile */}
      <div className="text-center p-2 bg-gray-50 rounded-md">
        <div className="text-xs text-gray-600">
          Selected: <span className="font-medium capitalize">{selectedTool.tool}</span>
          {selectedTool.tool === 'brush' && (
            <>
              {' • '}
              <span
                className="inline-block w-3 h-3 rounded-full border"
                style={{ backgroundColor: selectedTool.color }}
              />
              {' • '}
              <span>{selectedTool.strokeWidth}px</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanvasToolbar;