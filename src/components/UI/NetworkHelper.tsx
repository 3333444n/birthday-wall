import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { generatePageURLs } from '../../hooks/useNetworkInfo';

export const NetworkHelper: React.FC = () => {
  const [manualIP, setManualIP] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const currentPort = window.location.port || '3000';

  // Common IP ranges to suggest
  const commonIPRanges = [
    '192.168.1.100',
    '192.168.0.100', 
    '192.168.2.100',
    '10.0.0.100',
    '10.0.1.100',
    '172.16.0.100'
  ];

  const generateManualQRCodes = (ip: string) => {
    const baseURL = `http://${ip}:${currentPort}`;
    const urls = generatePageURLs(baseURL);
    
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

  const handleIPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(manualIP)) {
      alert('Por favor ingresa una IP válida (ej: 192.168.1.100)');
      return;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif mb-6 text-center">🔧 Configuración Manual de Red</h2>
      
      {/* Instructions Toggle */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showInstructions ? '🔼 Ocultar' : '🔽 Mostrar'} Instrucciones para Encontrar tu IP
        </button>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="mb-8 bg-blue-50 p-6 rounded-2xl">
          <h3 className="text-xl font-serif mb-4">📋 Cómo encontrar la IP de tu computadora:</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mac Instructions */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🍎 En Mac:</h4>
              <ol className="text-sm space-y-1 text-gray-700">
                <li>1. Ve a Preferencias del Sistema</li>
                <li>2. Haz clic en "Red"</li>
                <li>3. Selecciona tu conexión WiFi</li>
                <li>4. La IP aparece como "Dirección IP"</li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                <strong>O en Terminal:</strong><br/>
                <code>ipconfig getifaddr en0</code>
              </div>
            </div>

            {/* Windows Instructions */}
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🪟 En Windows:</h4>
              <ol className="text-sm space-y-1 text-gray-700">
                <li>1. Presiona Win + R</li>
                <li>2. Escribe "cmd" y presiona Enter</li>
                <li>3. Ejecuta: <code>ipconfig</code></li>
                <li>4. Busca "Dirección IPv4" en tu conexión WiFi</li>
              </ol>
              <div className="mt-2 p-2 bg-gray-100 rounded font-mono text-sm">
                <strong>Comando:</strong><br/>
                <code>ipconfig | findstr "IPv4"</code>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Tip:</strong> Tu IP probablemente empieza con 192.168.x.x, 10.x.x.x, o 172.16.x.x
            </p>
          </div>
        </div>
      )}

      {/* Manual IP Input */}
      <div className="mb-8">
        <form onSubmit={handleIPSubmit} className="flex gap-4 items-end justify-center">
          <div>
            <label className="block text-lg font-serif mb-2">
              🌐 Ingresa tu IP de red:
            </label>
            <input
              type="text"
              value={manualIP}
              onChange={(e) => setManualIP(e.target.value)}
              placeholder="ej: 192.168.1.100"
              className="border-2 border-gray-300 px-4 py-2 rounded-lg text-lg font-mono w-48"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            ✅ Generar QR Codes
          </button>
        </form>

        {/* Quick IP Suggestions */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">⚡ Prueba estas IPs comunes:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {commonIPRanges.map(ip => (
              <button
                key={ip}
                onClick={() => setManualIP(ip)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm font-mono transition-colors"
              >
                {ip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generated QR Codes */}
      {manualIP && (
        <div>
          <h3 className="text-2xl font-serif mb-6 text-center">
            📱 QR Codes para {manualIP}:{currentPort}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {generateManualQRCodes(manualIP).map((qr, index) => (
              <div key={index} className="text-center">
                <div className="bg-white border-2 border-gray-200 p-6 rounded-2xl shadow-lg mb-4 mx-auto w-fit">
                  <QRCode
                    size={250}
                    value={qr.url}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <h4 className="text-2xl text-black font-serif mb-2">
                  {qr.title}
                </h4>
                <p className="text-lg text-gray-600 font-serif mb-2">
                  {qr.description}
                </p>
                <p className="text-sm text-gray-500 font-mono break-all bg-gray-100 p-2 rounded">
                  {qr.url}
                </p>
              </div>
            ))}
          </div>

          {/* Test Links */}
          <div className="bg-green-50 p-6 rounded-2xl">
            <h4 className="text-xl font-serif mb-4 text-center">🔗 Enlaces para Probar:</h4>
            <div className="grid gap-2 text-center">
              {Object.entries(generatePageURLs(`http://${manualIP}:${currentPort}`)).map(([key, url]) => (
                <div key={key} className="flex justify-between items-center bg-white p-2 rounded">
                  <span className="font-semibold capitalize">{key}:</span>
                  <a 
                    href={url as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-mono text-sm break-all"
                  >
                    {url as string}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Testing Instructions */}
          <div className="mt-6 bg-yellow-50 p-6 rounded-2xl">
            <h4 className="text-xl font-serif mb-4 text-center">📋 Cómo Probar:</h4>
            <ol className="space-y-2 text-gray-700">
              <li><strong>1.</strong> Asegúrate de que tu teléfono esté en la misma red WiFi</li>
              <li><strong>2.</strong> Escanea uno de los QR codes con la cámara de tu teléfono</li>
              <li><strong>3.</strong> Si no funciona, prueba otra IP de la lista de arriba</li>
              <li><strong>4.</strong> También puedes copiar y pegar las URLs directamente en el navegador de tu teléfono</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};