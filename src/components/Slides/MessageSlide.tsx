import React, { useEffect, useState } from 'react';
import { SlideProps } from '../../types';

interface BirthdayMessage {
  text: string;
  language: string;
  flag: string;
}

const MessageSlide: React.FC<SlideProps> = ({ isActive }) => {
  const [currentMessage, setCurrentMessage] = useState<BirthdayMessage>({ text: '', language: '', flag: '' });
  const [showMessage, setShowMessage] = useState(true);

  // Dany's nicknames
  const nicknames = ['Nanys', 'Danolo', 'Dano', 'Danilo', 'Nanis', 'Dany'];

  // Multilingual birthday message templates (keep the variety!)
  const birthdayTemplates = [
    { template: '¡Feliz Cumpleaños {name}', language: 'Español', flag: '🇪🇸' },
    { template: 'Happy Birthday {name}', language: 'English', flag: '🇺🇸' },
    { template: 'Joyeux Anniversaire {name}', language: 'Français', flag: '🇫🇷' },
    { template: 'Buon Compleanno {name}', language: 'Italiano', flag: '🇮🇹' },
    { template: 'Alles Gute zum Geburtstag {name}', language: 'Deutsch', flag: '🇩🇪' },
    { template: 'お誕生日おめでとう {name}', language: '日本語', flag: '🇯🇵' },
    { template: '생일 축하해 {name}', language: '한국어', flag: '🇰🇷' },
    { template: 'С днем рождения {name}', language: 'Русский', flag: '🇷🇺' },
    { template: 'Feliz Aniversário {name}', language: 'Português', flag: '🇧🇷' },
    { template: 'Gelukkige Verjaardag {name}', language: 'Nederlands', flag: '🇳🇱' },
    { template: '生日快乐 {name}', language: '中文', flag: '🇨🇳' },
    { template: 'عيد ميلاد سعيد {name}', language: 'العربية', flag: '🇸🇦' }
  ];

  // Function to generate random message
  const generateRandomMessage = (): BirthdayMessage => {
    const randomNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    const randomTemplate = birthdayTemplates[Math.floor(Math.random() * birthdayTemplates.length)];
    
    return {
      text: randomTemplate.template.replace('{name}', randomNickname),
      language: randomTemplate.language,
      flag: randomTemplate.flag
    };
  };

  // Generate ONE random message when slide becomes active
  useEffect(() => {
    if (!isActive) return;

    // Set one random message for the entire slide duration
    setCurrentMessage(generateRandomMessage());
    setShowMessage(true);
    
    // No interval - message stays the same for entire slide duration
  }, [isActive]);

  // BYPASS SlideContainer to fix black screen issue
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
        {/* Main Message - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className={`text-center transition-all duration-500 transform ${
              showMessage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <h2 className="text-8xl text-black font-serif leading-tight">
              {currentMessage.text}
            </h2>
          </div>
        </div>
    </div>
  );
};

export default MessageSlide;