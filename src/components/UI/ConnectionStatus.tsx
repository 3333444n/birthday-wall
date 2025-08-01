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
    <div className={`flex items-center space-x-2 ${className}`}>
      {isConnected ? (
        <>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-600 text-sm">Connected to party wall</span>
        </>
      ) : (
        <>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-red-600 text-sm">Connecting to party wall...</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;