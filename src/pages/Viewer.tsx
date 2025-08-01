import React, { useState, useEffect } from 'react';
import BouncingSlide from '../components/Slides/BouncingSlide';
import MessageSlide from '../components/Slides/MessageSlide';
import QRCodeSlide from '../components/Slides/QRCodeSlide';
import DrawingSlide from '../components/Slides/DrawingSlide';
import PhotoSlide from '../components/Slides/PhotoSlide';
import { SlideType } from '../types';

interface SlideConfig {
  type: SlideType;
  title: string;
  duration: number;
  component: React.ComponentType<{ isActive: boolean; duration?: number }>;
}

const Viewer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Extended 5-slide configuration with Canvas and Photo Album
  const slides: SlideConfig[] = [
    { 
      type: 'bouncing', 
      title: '🏀 Bouncing Birthday Face', 
      duration: 15000, // 15 seconds
      component: BouncingSlide 
    },
    { 
      type: 'messages', 
      title: '🌍 Happy Birthday Messages', 
      duration: 8000, // 8 seconds
      component: MessageSlide 
    },
    { 
      type: 'drawing', 
      title: '🎨 Canvas Artworks', 
      duration: 12000, // 12 seconds
      component: DrawingSlide 
    },
    { 
      type: 'photos', 
      title: '📷 Photo Album', 
      duration: 12000, // 12 seconds
      component: PhotoSlide 
    },
    { 
      type: 'qr', 
      title: '🎵 Únete al Jam de Spotify', 
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
        case '1':
          setCurrentSlide(0); // Jump to bouncing
          break;
        case '2':
          setCurrentSlide(1); // Jump to messages
          break;
        case '3':
          setCurrentSlide(2); // Jump to drawings
          break;
        case '4':
          setCurrentSlide(3); // Jump to photos
          break;
        case '5':
          setCurrentSlide(4); // Jump to QR
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
        console.log(`📺 Viewer rendering slide ${index} (${slide.type}):`, { isActive, currentSlide });
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
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentSlide 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                title={slide.title}
                onClick={() => setCurrentSlide(index)}
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
          <div>1-5: Jump to Slide</div>
          <div className="text-blue-300 font-bold">FULL VERSION</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <div className="bg-gray-200/20 h-1">
          <div 
            className="bg-white h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default Viewer;