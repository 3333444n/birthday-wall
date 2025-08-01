import React from 'react';
import QRCode from 'react-qr-code';

const Home: React.FC = () => {
  const baseUrl = window.location.origin;
  
  const qrCodes = [
    {
      url: `${baseUrl}/draw`,
      title: '🎨 Draw Together',
      description: 'Join the collaborative drawing canvas!'
    },
    {
      url: `${baseUrl}/photo`,
      title: '📸 Share Photos',
      description: 'Take and share party photos!'
    },
    {
      url: `${baseUrl}/controller`,
      title: '🎮 Host Controls',
      description: 'Party host admin panel'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-party-primary via-party-secondary to-party-accent p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🎉 Birthday Wall
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Interactive Party Experience
          </p>
          <p className="text-lg text-white/80">
            Scan a QR code to join the fun!
          </p>
        </div>

        {/* QR Codes Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {qrCodes.map((qr, index) => (
            <div key={index} className="party-card text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {qr.title}
              </h3>
              <div className="bg-white p-4 rounded-lg mb-4 mx-auto w-fit">
                <QRCode
                  size={200}
                  value={qr.url}
                  level="M"
                />
              </div>
              <p className="text-gray-600 text-sm">
                {qr.description}
              </p>
              <div className="mt-4">
                <a
                  href={qr.url}
                  className="party-button inline-block text-sm"
                >
                  Open Directly
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Projector Link */}
        <div className="text-center">
          <div className="party-card inline-block">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              🖥️ Projector Display
            </h3>
            <p className="text-gray-600 mb-4">
              Open this on the party projector/TV
            </p>
            <a
              href={`${baseUrl}/viewer`}
              className="party-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Projector View
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 party-card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            🎯 How to Use
          </h3>
          <div className="space-y-3 text-gray-700">
            <p className="flex items-start gap-3">
              <span className="text-party-primary font-bold">1.</span>
              Open the <strong>Projector Display</strong> on your TV/projector in fullscreen mode
            </p>
            <p className="flex items-start gap-3">
              <span className="text-party-primary font-bold">2.</span>
              Guests scan QR codes with their phones to join drawing or photo sharing
            </p>
            <p className="flex items-start gap-3">
              <span className="text-party-primary font-bold">3.</span>
              Host uses the <strong>Controller</strong> to make announcements and manage the display
            </p>
            <p className="flex items-start gap-3">
              <span className="text-party-primary font-bold">4.</span>
              Watch the magic happen as the display cycles through collaborative content!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;