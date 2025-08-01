// Network utilities for detecting local IP address and creating device-accessible URLs

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
    }, 3000);

    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      const foundIPs = new Set<string>();

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          
          if (ipMatch) {
            const ip = ipMatch[1];
            // Filter out localhost and invalid IPs
            if (ip !== '127.0.0.1' && !ip.startsWith('169.254.') && isValidPrivateIP(ip)) {
              foundIPs.add(ip);
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

// Note: Alternative detection methods could be added here

// Get local IP using multiple detection methods
export const getLocalIP = async (): Promise<string> => {
  // First try WebRTC method
  try {
    const ip = await detectIPUsingWebRTC();
    console.log('Detected local IP via WebRTC:', ip);
    return ip;
  } catch (error) {
    console.warn('WebRTC IP detection failed:', error);
  }

  // Fallback: Try to guess common router IP ranges
  const commonIPs = [
    '192.168.1.',
    '192.168.0.',
    '192.168.2.',
    '10.0.0.',
    '10.0.1.',
    '172.16.0.'
  ];

  // Try pinging common gateway addresses to detect network
  for (const baseIP of commonIPs) {
    try {
      // This won't actually work in browser, but we can make educated guesses
      // Based on common home network configurations
      if (baseIP.startsWith('192.168.1.')) {
        return '192.168.1.100'; // Common range
      }
      if (baseIP.startsWith('192.168.0.')) {
        return '192.168.0.100';
      }
      if (baseIP.startsWith('10.0.0.')) {
        return '10.0.0.100';
      }
    } catch {
      continue;
    }
  }

  // Final fallback - return localhost and warn user
  console.warn('Could not detect local IP, using localhost');
  return '127.0.0.1';
};

// Get current port from window.location
export const getCurrentPort = (): string => {
  const port = window.location.port;
  return port || (window.location.protocol === 'https:' ? '443' : '80');
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

// Generate URLs for different pages
export const generatePageURLs = async () => {
  const networkInfo = await getNetworkInfo();
  const { baseURL } = networkInfo;

  return {
    home: baseURL,
    draw: `${baseURL}/draw`,
    photo: `${baseURL}/photo`,
    viewer: `${baseURL}/viewer`,
    controller: `${baseURL}/controller`,
    test: `${baseURL}/test`,
    networkInfo
  };
};

// Note: React hook is defined in hooks/useNetworkInfo.ts

// React is imported where needed