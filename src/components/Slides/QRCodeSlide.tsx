import React from 'react';
import { SlideProps } from '../../types';
import SlideContainer from './SlideContainer';
import QRCode from 'react-qr-code';

const QRCodeSlide: React.FC<SlideProps> = ({ isActive, duration }) => {
  const baseUrl = window.location.origin;
  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';

  const qrCodes = [
    {
      title: '🎨 Draw Together',
      url: `${baseUrl}/draw`,
      description: 'Add your artwork to the collaborative canvas',
      icon: '✏️',
      color: 'from-blue-500 to-purple-500'
    },
    {
      title: '📸 Share Photos',
      url: `${baseUrl}/photo`,
      description: 'Capture and share party moments instantly',
      icon: '📱',
      color: 'from-pink-500 to-red-500'
    },
    {
      title: '🎮 Host Controls',
      url: `${baseUrl}/controller`,
      description: 'Admin panel for party hosts',
      icon: '🎛️',
      color: 'from-green-500 to-blue-500'
    }
  ];

  return (
    <SlideContainer isActive={isActive} duration={duration}>
      <div className="relative w-full h-full">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          {/* Animated background elements */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className="text-3xl opacity-20">
                {['📱', '🎉', '🎨', '📸', '🎈', '✨'][Math.floor(Math.random() * 6)]}
              </div>
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <h1 className="text-7xl font-bold text-white drop-shadow-2xl mb-4">
            📱 Join {birthdayPersonName}'s Party!
          </h1>
          <p className="text-3xl text-white/80">
            Scan any QR code with your phone to participate
          </p>
        </div>

        {/* QR Code Grid */}
        <div className="absolute inset-0 flex items-center justify-center pt-32 pb-16">
          <div className="grid grid-cols-3 gap-12 max-w-6xl">
            {qrCodes.map((qr, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                }}
              >
                {/* QR Code Container */}
                <div className={`bg-gradient-to-br ${qr.color} p-1 rounded-2xl shadow-2xl mb-6`}>
                  <div className="bg-white p-6 rounded-xl">
                    <QRCode
                      size={200}
                      value={qr.url}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </div>

                {/* Icon */}
                <div className="text-6xl mb-4">
                  {qr.icon}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-white mb-3">
                  {qr.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-white/80 leading-relaxed">
                  {qr.description}
                </p>

                {/* URL */}
                <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-white/60 text-sm font-mono">
                    {qr.url.replace(baseUrl, '').slice(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
            <p className="text-2xl text-white mb-2">
              📱 Open your phone's camera app and point it at any QR code
            </p>
            <p className="text-lg text-white/80">
              No app downloads needed - works with iPhone, Android, and most modern phones
            </p>
          </div>
        </div>

        {/* Fun animation - phones floating around */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce opacity-30"
              style={{
                left: `${5 + i * 15}%`,
                top: `${10 + (i % 2) * 70}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random()}s`
              }}
            >
              📱
            </div>
          ))}
        </div>

        {/* Party decorations */}
        <div className="absolute top-20 left-8 text-6xl animate-spin-slow opacity-50">
          🎉
        </div>
        <div className="absolute top-20 right-8 text-6xl animate-spin-slow-reverse opacity-50">
          🎊
        </div>
        <div className="absolute bottom-20 left-12 text-5xl animate-bounce opacity-50">
          🎈
        </div>
        <div className="absolute bottom-20 right-12 text-5xl animate-bounce opacity-50">
          🎁
        </div>
      </div>
    </SlideContainer>
  );
};

export default QRCodeSlide;