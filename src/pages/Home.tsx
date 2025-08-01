import React from 'react';
import QRCode from 'react-qr-code';

const Home: React.FC = () => {
  const baseUrl = window.location.origin;
  const birthdayPersonName = import.meta.env.VITE_BIRTHDAY_PERSON_NAME || 'Dany';
  
  const qrCodes = [
    {
      url: `${baseUrl}/draw`,
      title: 'Dibujar Juntos',
      description: 'Agrega tu arte al lienzo compartido'
    },
    {
      url: `${baseUrl}/photo`,
      title: 'Compartir Fotos',
      description: 'Captura recuerdos de la fiesta'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-8xl text-black font-serif leading-tight mb-6">
            Cumpleaños de {birthdayPersonName}
          </h1>
          <p className="text-4xl text-gray-600 font-serif">
            Únete a la celebración
          </p>
        </div>

        {/* QR Codes Grid */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {qrCodes.map((qr, index) => (
            <div key={index} className="text-center">
              <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl shadow-lg mb-8 mx-auto w-fit">
                <QRCode
                  size={280}
                  value={qr.url}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
              <h3 className="text-5xl text-black font-serif mb-4">
                {qr.title}
              </h3>
              <p className="text-2xl text-gray-600 font-serif">
                {qr.description}
              </p>
            </div>
          ))}
        </div>

        {/* Projector Link */}
        <div className="text-center mb-16">
          <div className="bg-gray-50 p-8 rounded-2xl shadow-lg inline-block">
            <h3 className="text-3xl text-black font-serif mb-4">
              Pantalla del Proyector
            </h3>
            <p className="text-xl text-gray-600 font-serif mb-6">
              Abre esto en el proyector o TV de la fiesta
            </p>
            <a
              href={`${baseUrl}/viewer`}
              className="bg-black text-white px-8 py-4 rounded-lg text-xl font-serif hover:bg-gray-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir Vista del Proyector
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
          <h3 className="text-3xl text-black font-serif mb-8 text-center">
            Cómo Usar
          </h3>
          <div className="space-y-6 text-xl text-gray-700 font-serif max-w-3xl mx-auto">
            <p className="flex items-start gap-4">
              <span className="text-black font-bold text-2xl">1.</span>
              Abre la Pantalla del Proyector en tu TV en modo pantalla completa
            </p>
            <p className="flex items-start gap-4">
              <span className="text-black font-bold text-2xl">2.</span>
              Los invitados escanean códigos QR con sus teléfonos para unirse
            </p>
            <p className="flex items-start gap-4">
              <span className="text-black font-bold text-2xl">3.</span>
              Mira cómo aparecen dibujos y fotos en vivo en la pantalla grande
            </p>
            <p className="flex items-start gap-4">
              <span className="text-black font-bold text-2xl">4.</span>
              ¡Disfruta la celebración colaborativa de cumpleaños!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;