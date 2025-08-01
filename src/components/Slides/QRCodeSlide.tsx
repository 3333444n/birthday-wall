import React from 'react';
import { SlideProps } from '../../types';
import QRCode from 'react-qr-code';

const QRCodeSlide: React.FC<SlideProps> = ({ isActive }) => {
  // Spotify Jam URL - replace this with your actual Spotify Jam link
  const spotifyJamUrl = 'https://open.spotify.com/jam/your-jam-id';

  // BYPASS SlideContainer to fix black screen issue
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
        {/* Single Spotify Jam QR Code - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* QR Code - No shadow, no border */}
            <div className="bg-white p-8 mb-8">
              <QRCode
                size={400}
                value={spotifyJamUrl}
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            {/* Simple text - No emojis */}
            <p className="text-4xl text-black font-serif">
              Únete al jam
            </p>
          </div>
        </div>
    </div>
  );
};

export default QRCodeSlide;