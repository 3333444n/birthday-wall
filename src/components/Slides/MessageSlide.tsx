import React, { useEffect, useState } from 'react';
import { SlideProps } from '../../types';
import SlideContainer from './SlideContainer';
import QRCode from 'react-qr-code';

interface BirthdayMessage {
  text: string;
  language: string;
  flag: string;
}

const MessageSlide: React.FC<SlideProps> = ({ isActive, duration }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';

  // Multilingual birthday messages
  const birthdayMessages: BirthdayMessage[] = [
    { text: `¡Feliz Cumpleaños ${birthdayPersonName}!`, language: 'Spanish', flag: '🇪🇸' },
    { text: `Happy Birthday ${birthdayPersonName}!`, language: 'English', flag: '🇺🇸' },
    { text: `Joyeux Anniversaire ${birthdayPersonName}!`, language: 'French', flag: '🇫🇷' },
    { text: `Buon Compleanno ${birthdayPersonName}!`, language: 'Italian', flag: '🇮🇹' },
    { text: `Alles Gute zum Geburtstag ${birthdayPersonName}!`, language: 'German', flag: '🇩🇪' },
    { text: `お誕生日おめでとう ${birthdayPersonName}!`, language: 'Japanese', flag: '🇯🇵' },
    { text: `생일 축하해 ${birthdayPersonName}!`, language: 'Korean', flag: '🇰🇷' },
    { text: `Паздравляю с днем рождения ${birthdayPersonName}!`, language: 'Russian', flag: '🇷🇺' },
    { text: `Feliz Aniversário ${birthdayPersonName}!`, language: 'Portuguese', flag: '🇧🇷' },
    { text: `Gelukkige Verjaardag ${birthdayPersonName}!`, language: 'Dutch', flag: '🇳🇱' },
    { text: `生日快乐 ${birthdayPersonName}!`, language: 'Chinese', flag: '🇨🇳' },
    { text: `عيد ميلاد سعيد ${birthdayPersonName}!`, language: 'Arabic', flag: '🇸🇦' }
  ];

  // Fun personal messages and nicknames
  const personalMessages = [
    `${birthdayPersonName} is awesome! 🌟`,
    `Another year of amazing ${birthdayPersonName}! 🎉`,
    `${birthdayPersonName} rocks our world! 🚀`,
    `Celebrating the incredible ${birthdayPersonName}! 💫`,
    `${birthdayPersonName} makes life brighter! ☀️`,
    `Here's to fabulous ${birthdayPersonName}! 🥳`,
    `${birthdayPersonName} deserves all the cake! 🎂`,
    `Party time for ${birthdayPersonName}! 🎊`
  ];

  // Combine all messages
  const allMessages = [...birthdayMessages, ...personalMessages.map(msg => ({
    text: msg,
    language: 'Party Fun',
    flag: '🎉'
  }))];

  // Rotate messages
  useEffect(() => {
    if (!isActive) return;

    const messageInterval = setInterval(() => {
      setShowMessage(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % allMessages.length);
        setShowMessage(true);
      }, 300); // Brief pause for transition effect
      
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(messageInterval);
  }, [isActive, allMessages.length]);

  const currentMessage = allMessages[currentMessageIndex];
  const photoUrl = `${window.location.origin}/photo`;

  return (
    <SlideContainer isActive={isActive} duration={duration}>
      <div className="relative w-full h-full overflow-hidden bg-green-50">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-green-50 to-emerald-100">
          {/* Floating emojis */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              {['🎂', '🎉', '🎈', '🎁', '🥳', '🎊', '💖', '🌟'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>

        {/* Title */}
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-6xl font-bold text-green-800 drop-shadow-lg">
            🌍 Birthday Wishes
          </h1>
          <p className="text-2xl text-green-600 mt-2">
            From around the world with love!
          </p>
        </div>

        {/* QR Code */}
        <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-2xl z-10">
          <div className="text-center mb-3">
            <p className="text-gray-800 font-semibold">Capture Memories!</p>
            <p className="text-gray-600 text-sm">Scan to take photos</p>
          </div>
          <QRCode
            size={120}
            value={photoUrl}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>

        {/* Main Message */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`text-center transition-all duration-300 transform ${
              showMessage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Flag */}
            <div className="text-9xl mb-6 animate-pulse">
              {currentMessage.flag}
            </div>
            
            {/* Message */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-4xl mx-auto border-2 border-green-200">
              <h2 className="text-7xl font-bold text-green-800 mb-6 drop-shadow-lg">
                {currentMessage.text}
              </h2>
              
              {/* Language label */}
              <div className="bg-green-200 rounded-full px-6 py-3 inline-block">
                <p className="text-2xl text-green-700 font-semibold">
                  {currentMessage.language}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Message counter */}
        <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 z-10 border border-green-200">
          <p className="text-green-700 font-semibold">
            Message {currentMessageIndex + 1} of {allMessages.length}
          </p>
        </div>

        {/* Fun facts about birthdays */}
        <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 z-10 max-w-md border border-green-200">
          <p className="text-green-600 text-sm">
            🎈 Fun fact: "Happy Birthday" is sung in over 18 languages around the world!
          </p>
        </div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl animate-ping"
              style={{
                left: `${10 + i * 10}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '3s'
              }}
            >
              ✨
            </div>
          ))}
        </div>

        {/* Birthday cake animation in corner */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div className="text-8xl animate-bounce">
            🎂
          </div>
        </div>
      </div>
    </SlideContainer>
  );
};

export default MessageSlide;