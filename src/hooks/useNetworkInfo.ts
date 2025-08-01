import { useState, useEffect } from 'react';

export interface NetworkInfo {
  localIP: string;
  port: string;
  baseURL: string;  
  isLocalhost: boolean;
}

// Try to detect local IP using WebRTC
const detectIPUsingWebRTC = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('WebRTC IP detection timeout'));
    }, 5000);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          
          if (ipMatch) {
            const ip = ipMatch[1];
            // Filter out localhost and invalid IPs, prioritize private network IPs
            if (ip !== '127.0.0.1' && !ip.startsWith('169.254.') && isValidPrivateIP(ip)) {
              clearTimeout(timeout);
              pc.close();
              resolve(ip);
            }
          }
        }
      };

      // Create a data channel to trigger ICE candidate gathering
      pc.createDataChannel('test');
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .catch(reject);

    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
};

// Check if IP is a valid private network IP
const isValidPrivateIP = (ip: string): boolean => {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
    return false;
  }

  const [a, b] = parts;
  
  // 10.0.0.0 - 10.255.255.255
  if (a === 10) return true;
  
  // 172.16.0.0 - 172.31.255.255  
  if (a === 172 && b >= 16 && b <= 31) return true;
  
  // 192.168.0.0 - 192.168.255.255
  if (a === 192 && b === 168) return true;
  
  return false;
};

// Get local IP using WebRTC with fallbacks
export const getLocalIP = async (): Promise<string> => {
  try {
    const ip = await detectIPUsingWebRTC();
    console.log('✅ Detected local IP via WebRTC:', ip);
    return ip;
  } catch (error) {
    console.warn('❌ WebRTC IP detection failed:', error);
    
    // Return current hostname if it's not localhost
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.log('📍 Using current hostname:', hostname);
      return hostname;
    }
    
    // Final fallback - return localhost with warning
    console.warn('⚠️ Could not detect local IP, using localhost. QR codes will only work on this device.');
    return '127.0.0.1';
  }
};

// Get current port from window.location
export const getCurrentPort = (): string => {
  return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
};

// Get network info for the current session
export const getNetworkInfo = async (): Promise<NetworkInfo> => {
  const localIP = await getLocalIP();
  const port = getCurrentPort();
  const isLocalhost = localIP === '127.0.0.1' || localIP === 'localhost';
  const baseURL = `${window.location.protocol}//${localIP}:${port}`;

  return {
    localIP,
    port, 
    baseURL,
    isLocalhost
  };
};

// React hook for network info
export const useNetworkInfo = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNetworkInfo = async () => {
    try {
      setLoading(true);
      const info = await getNetworkInfo();
      setNetworkInfo(info);
      setError(null);
      
      if (info.isLocalhost) {
        setError('Could not detect local IP. QR codes will only work on this device.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to get network info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkInfo();
  }, []);

  const refresh = () => {
    fetchNetworkInfo();
  };

  return { networkInfo, loading, error, refresh };
};

// Utility function to generate page URLs
export const generatePageURLs = (baseURL: string) => {
  return {
    home: baseURL,
    draw: `${baseURL}/draw`,
    photo: `${baseURL}/photo`, 
    viewer: `${baseURL}/viewer`,
    controller: `${baseURL}/controller`,
    test: `${baseURL}/test`
  };
};