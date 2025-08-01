import React from 'react';
import { SlideProps } from '../../types';
import QRCode from 'react-qr-code';
import { useNetworkInfo, generatePageURLs } from '../../hooks/useNetworkInfo';

const QRCodeSlide: React.FC<SlideProps> = ({ isActive }) => {
  const { networkInfo, loading, error, refresh } = useNetworkInfo();
  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';

  // Generate URLs based on detected network info
  const getQRCodes = () => {
    if (!networkInfo) return [];
    
    const urls = generatePageURLs(networkInfo.baseURL);
    return [
      {
        title: 'Dibujar Juntos',
        url: urls.draw,
        description: 'Agrega tu arte al lienzo compartido'
      },
      {
        title: 'Compartir Fotos', 
        url: urls.photo,
        description: 'Captura recuerdos de la fiesta'
      }
    ];
  };

  const qrCodes = getQRCodes();

  // BYPASS SlideContainer to fix black screen issue
  if (!isActive) {
    return null; // Don't render anything if not active
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white z-10 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-3xl text-gray-600 font-serif">Detectando IP de red...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white z-10">
        {/* Title */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-8xl text-black font-serif leading-tight mb-8">
            Únete a la Fiesta de {birthdayPersonName}
          </h1>
          <p className="text-4xl text-gray-600 font-serif">
            Escanea con la cámara de tu teléfono
          </p>
        </div>

        {/* QR Code Grid */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-24">
            {qrCodes.map((qr, index) => (
              <div key={index} className="text-center">
                {/* QR Code */}
                <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg mb-8">
                  <QRCode
                    size={280}
                    value={qr.url}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                {/* Title */}
                <h3 className="text-5xl text-black font-serif mb-4">
                  {qr.title}
                </h3>

                {/* Description */}
                <p className="text-2xl text-gray-600 font-serif leading-relaxed">
                  {qr.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Network Info & Instructions */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center">
          {networkInfo && (
            <div className="mb-4">
              <p className="text-2xl text-gray-700 font-serif mb-2">
                🌐 Red Local: {networkInfo.localIP}:{networkInfo.port}
              </p>
              {networkInfo.isLocalhost && (
                <p className="text-xl text-amber-600 font-serif mb-2">
                  ⚠️ Solo accesible desde este dispositivo
                </p>
              )}
              {error && (
                <div className="mb-2">
                  <p className="text-lg text-red-600 font-serif mb-1">❌ {error}</p>
                  <button 
                    onClick={refresh}
                    className="text-lg text-blue-600 font-serif underline hover:text-blue-800"
                  >
                    🔄 Reintentar detección
                  </button>
                </div>
              )}
            </div>
          )}
          <p className="text-3xl text-gray-500 font-serif">
            No necesitas app • Funciona en todos los teléfonos
          </p>
        </div>
    </div>
  );
};

export default QRCodeSlide;