import React, { useState, useEffect } from 'react';
import DrawingSlide from '../components/Slides/DrawingSlide';
import PhotoSlide from '../components/Slides/PhotoSlide';
import BouncingSlide from '../components/Slides/BouncingSlide';
import MessageSlide from '../components/Slides/MessageSlide';
import QRCodeSlide from '../components/Slides/QRCodeSlide';
import { SlideType } from '../types';

interface SlideConfig {
  type: SlideType;
  title: string;
  duration: number;
  component: React.ComponentType<{ isActive: boolean; duration?: number }>;
}

const Viewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Slide configuration with actual components
  const slides: SlideConfig[] = [
    { 
      type: 'drawing', 
      title: '🎨 Collaborative Drawing', 
      duration: 15000, // 15 seconds
      component: DrawingSlide 
    },
    { 
      type: 'photos', 
      title: '📸 Party Photos', 
      duration: 12000, // 12 seconds
      component: PhotoSlide 
    },
    { 
      type: 'bouncing', 
      title: '🏀 Bouncing Birthday Face', 
      duration: 18000, // 18 seconds
      component: BouncingSlide 
    },
    { 
      type: 'messages', 
      title: '🌍 Happy Birthday Messages', 
      duration: 10000, // 10 seconds
      component: MessageSlide 
    },
    { 
      type: 'qr', 
      title: '📱 Join the Party', 
      duration: 8000, // 8 seconds
      component: QRCodeSlide 
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slides[currentSlide].duration);

    return () => clearInterval(timer);
  }, [currentSlide, slides]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          setCurrentSlide((prev) => (prev + 1) % slides.length);
          break;
        case 'ArrowLeft':
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
          break;
        case 'F11':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  console.log('📺 Viewer rendering - currentSlide:', currentSlide, 'slides:', slides.map(s => s.type));
  
  return (
    <div className="projector-display">
      {/* Render all slides */}
      {slides.map((slide, index) => {
        const SlideComponent = slide.component;
        const isActive = index === currentSlide;
        console.log(`📺 Rendering slide ${index} (${slide.type}):`, { isActive, currentSlide });
        return (
          <SlideComponent
            key={slide.type}
            isActive={isActive}
            duration={slide.duration}
          />
        );
      })}

      {/* Slide Indicator */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
          <div className="flex gap-2 items-center">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                title={slide.title}
              />
            ))}
            <div className="ml-3 text-white/80 text-sm font-medium">
              {currentSlide + 1}/{slides.length}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Instructions */}
      <div className="fixed top-4 right-4 text-white/50 text-sm z-50 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="text-center">
          <div>F11: Fullscreen | ESC: Exit</div>
          <div>← → Space: Navigate</div>
        </div>
      </div>

      {/* Current slide title (for debugging) */}
      <div className="fixed top-4 left-4 text-white/50 text-sm z-50 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
        {slides[currentSlide].title}
      </div>
    </div>
  );
};

export default Viewer;