import React, { useState, useEffect } from 'react';
import { connectionState } from '../../services/firebase';

interface ConnectionStatusProps {
  className?: string;
  showWhenConnected?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className = '',
  showWhenConnected = false 
}) => {
  const [isConnected, setIsConnected] = useState(connectionState.isConnected);

  useEffect(() => {
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    connectionState.addListener(handleConnectionChange);

    return () => {
      connectionState.removeListener(handleConnectionChange);
    };
  }, []);

  // Don't show anything if connected and showWhenConnected is false
  if (isConnected && !showWhenConnected) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {isConnected ? (
        <>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-700 font-serif">Conectado a la pared de la fiesta</span>
        </>
      ) : (
        <>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-gray-700 font-serif">Conectando a la pared de la fiesta...</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;