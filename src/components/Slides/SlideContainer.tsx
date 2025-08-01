import React from 'react';
import { SlideProps } from '../../types';

interface SlideContainerProps extends SlideProps {
  children: React.ReactNode;
  className?: string;
}

const SlideContainer: React.FC<SlideContainerProps> = ({ 
  children, 
  isActive, 
  className = '',
  duration 
}) => {
  return (
    <div 
      className={`projector-slide transition-opacity duration-1000 ${
        isActive ? 'opacity-100' : 'opacity-0 hidden'
      } ${className}`}
    >
      {children}
      
      {/* Progress indicator */}
      {isActive && duration && (
        <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-white/20 rounded-full h-1 w-64">
            <div 
              className="bg-red-400 h-1 rounded-full transition-all linear"
              style={{
                width: '100%',
                animation: `progress-bar ${duration}ms linear`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideContainer;