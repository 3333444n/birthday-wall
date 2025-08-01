import React, { useState, useEffect } from 'react';
import { testFirestoreConnection, getStorageStats, addDrawing, addPhoto } from '../../utils/firestore';
import { localImageStorage } from '../../utils/localStorage';
import { useNetworkInfo, generatePageURLs } from '../../hooks/useNetworkInfo';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export const SystemTest: React.FC = () => {
  const { networkInfo, loading: networkLoading, error: networkError, refresh: refreshNetwork } = useNetworkInfo();
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Network Detection', status: 'pending', message: 'Testing...' },
    { name: 'Firebase Connection', status: 'pending', message: 'Testing...' },
    { name: 'IndexedDB/LocalStorage', status: 'pending', message: 'Testing...' },
    { name: 'Image Storage', status: 'pending', message: 'Testing...' },
    { name: 'Canvas Integration', status: 'pending', message: 'Testing...' },
    { name: 'Photo Processing', status: 'pending', message: 'Testing...' }
  ]);

  const updateTest = (name: string, status: TestResult['status'], message: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  const runTests = async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending', message: 'Testing...' })));

    // Test 1: Network Detection
    if (networkLoading) {
      updateTest('Network Detection', 'pending', 'Detecting network...');
    } else if (networkError) {
      updateTest('Network Detection', 'error', networkError);
    } else if (networkInfo) {
      const message = networkInfo.isLocalhost 
        ? `localhost:${networkInfo.port} (QR codes limited to this device)`
        : `${networkInfo.localIP}:${networkInfo.port} (Network accessible)`;
      updateTest('Network Detection', 'success', message);
    }

    // Test 2: Firebase Connection
    try {
      const isConnected = await testFirestoreConnection();
      if (isConnected) {
        updateTest('Firebase Connection', 'success', 'Connected to Firestore successfully');
      } else {
        updateTest('Firebase Connection', 'error', 'Failed to connect to Firestore');
      }
    } catch (error) {
      updateTest('Firebase Connection', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 3: Local Storage
    try {
      await localImageStorage.init();
      const testId = await localImageStorage.saveImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'canvas');
      const retrieved = await localImageStorage.getImage(testId);
      
      if (retrieved && retrieved.data) {
        await localImageStorage.deleteImage(testId);
        updateTest('IndexedDB/LocalStorage', 'success', 'Local storage working correctly');
      } else {
        updateTest('IndexedDB/LocalStorage', 'error', 'Failed to retrieve stored image');
      }
    } catch (error) {
      updateTest('IndexedDB/LocalStorage', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 4: Image Storage Stats
    try {
      const stats = await getStorageStats();
      updateTest('Image Storage', 'success', `Found ${stats.drawings} drawings, ${stats.photos} photos, ${stats.localImages} local images`);
    } catch (error) {
      updateTest('Image Storage', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 5: Canvas Integration
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(10, 10, 80, 80);
      
      const drawingId = await addDrawing(canvas);
      updateTest('Canvas Integration', 'success', `Canvas drawing saved with ID: ${drawingId.substring(0, 8)}...`);
    } catch (error) {
      updateTest('Canvas Integration', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Test 6: Photo Processing
    try {
      // Create a test blob (1x1 pixel PNG)
      const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9RPRM8gAAAABJRU5ErkJggg==';
      const response = await fetch(testImageData);
      const blob = await response.blob();
      const file = new File([blob], 'test.png', { type: 'image/png' });
      
      const photoId = await addPhoto(file);
      updateTest('Photo Processing', 'success', `Photo processed and saved with ID: ${photoId.substring(0, 8)}...`);
    } catch (error) {
      updateTest('Photo Processing', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-serif mb-6 text-center">System Test Results</h2>
      
      <div className="space-y-4">
        {tests.map((test) => (
          <div key={test.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-2xl">{getStatusIcon(test.status)}</span>
            <div className="flex-1">
              <h3 className="font-semibold">{test.name}</h3>
              <p className={`text-sm ${getStatusColor(test.status)}`}>{test.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={runTests}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Run Tests Again
        </button>
      </div>

      {/* Network URLs */}
      {networkInfo && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">🌐 Network URLs (Share with other devices):</h3>
          <div className="text-sm space-y-1 text-gray-700 font-mono">
            {(() => {
              const urls = generatePageURLs(networkInfo.baseURL);
              return Object.entries(urls).map(([key, url]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="font-semibold capitalize">{key}:</span>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                    {url}
                  </a>
                </div>
              ));
            })()}
          </div>
          {networkInfo.isLocalhost && (
            <p className="mt-2 text-amber-600 text-sm">
              ⚠️ URLs will only work on this device (localhost). Other devices need the actual IP address.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Manual Tests to Perform:</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• Go to <code>/draw</code> and test canvas drawing</li>
          <li>• Go to <code>/photo</code> and test camera capture</li>
          <li>• Go to <code>/viewer</code> and verify slides display</li>
          <li>• Test real-time sync across multiple browser tabs</li>
          <li>• Check browser console for any errors</li>
          <li>• Test on mobile device for touch interactions</li>
          <li>• <strong>Scan QR codes from phone to test network access</strong></li>
        </ul>
      </div>
    </div>
  );
};