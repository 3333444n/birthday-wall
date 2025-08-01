# 🎉 Birthday Wall Interactive Installation

## What is this project?

Esta es una instalación interactiva de fiesta de cumpleaños digital que crea una experiencia divertida y atractiva para los invitados usando solo sus teléfonos y una pantalla de proyector.

### For Party Guests (Para los Invitados)

Imagina entrar a una fiesta de cumpleaños y ver una pantalla grande en la pared que cambia constantemente entre diferentes visualizaciones divertidas:

1. **🎨 Pared de Dibujo Colaborativo**: ¡Un lienzo digital gigante donde todos pueden dibujar juntos! Escanea un código QR con tu teléfono y puedes agregar tus propios garabatos, bocetos o mensajes de cumpleaños directamente en el lienzo compartido. Tu dibujo aparece instantáneamente en la pantalla grande para que todos lo vean.

2. **📸 Collage de Fotos en Vivo**: Toma fotos durante toda la fiesta usando la cámara de tu teléfono, y míralas aparecer automáticamente en una cuadrícula de fotos en crecimiento en la pantalla. ¡Es como un álbum de recuerdos en vivo de la fiesta!

3. **🏀 Cara de Cumpleaños Rebotando**: La cara de la persona del cumpleaños rebota por la pantalla como el antiguo salvapantallas de DVD, cambiando a diferentes fotos cada vez que toca un borde. ¡Todos siempre gritan cuando toca una esquina perfectamente! ✅ **COMPLETAMENTE IMPLEMENTADO**

4. **🌍 Feliz Cumpleaños Alrededor del Mundo**: La pantalla muestra "Feliz Cumpleaños" en diferentes idiomas, combinado aleatoriamente con los apodos de la persona del cumpleaños (Nanys, Danolo, Dano, Danilo, Nanis, Dany). Cada pocos segundos aparece una nueva combinación como "¡Feliz Cumpleaños Danolo!" o "お誕生日おめでとう Nanis!" en elegante tipografía serif sobre un fondo blanco limpio. ✅ **COMPLETAMENTE IMPLEMENTADO**

El anfitrión de la fiesta también puede mostrar anuncios en la pantalla desde su teléfono (como "¡Hora del pastel en 5 minutos!").

### For Developers (Technical Overview)

This is a real-time, collaborative web application built with modern technologies to create an interactive party experience. The system consists of:

- **Frontend**: React 18 + TypeScript + Vite for fast development and modern UI
- **Canvas Drawing**: Fabric.js for collaborative drawing with real-time synchronization
- **Backend**: Firebase (Firestore for real-time data, Storage for images, Hosting for deployment)
- **Styling**: Tailwind CSS for responsive, mobile-first design
- **Real-time Features**: Firebase Firestore subscriptions for live updates across all devices

## How it works technically

```
[Guest Phones] → [QR Codes] → [Web App] → [Firebase] → [Projector Display]
     ↓                                       ↑              ↓
  Draw/Photo                            Real-time         Live Updates
   Upload                               Database           on Screen
```

## Project Structure

```
birthday-wall/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Canvas/         # Drawing canvas components
│   │   ├── Slides/         # Projector slide components
│   │   └── UI/             # Common UI elements
│   ├── pages/              # Main app pages
│   │   ├── Viewer.tsx      # Projector full-screen display
│   │   ├── Draw.tsx        # Mobile drawing interface
│   │   ├── Photo.tsx       # Camera capture interface
│   │   └── Controller.tsx  # Host admin controls
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper functions
│   ├── firebase.ts         # Firebase configuration
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Additional documentation
└── README.md              # This file
```

## Features Overview

### 🎨 Collaborative Drawing Canvas

- **Real-time collaboration**: Multiple people can draw simultaneously
- **Simple tools**: Basic brush (3px) with 6 color options
- **Mobile optimized**: Works smoothly on phones and tablets
- **Persistent**: All drawings stay on the canvas throughout the party
- **Instant sync**: Drawings appear on the projector screen immediately

### 📸 Live Photo Collection ✅ IMPLEMENTED

- **Device camera access**: Full mobile camera interface with front/back switching
- **Smart compression**: Images automatically compressed to JPEG (800px max, 90% quality)
- **Fallback storage**: Works with or without Firebase Storage (uses data URLs as fallback)
- **Live grid**: Photos appear in real-time across all devices via Firestore sync
- **Mobile-optimized**: Touch-friendly camera controls and responsive photo grid
- **Progress tracking**: Real-time upload progress with user feedback

### 🏀 Bouncing Face Animation ✅ FULLY IMPLEMENTED

- **Physics simulation**: Realistic bouncing with edge detection and wall collision
- **Photo rotation**: Cycles through 12 different photos of the birthday person on each bounce
- **Crowd pleaser**: Always gets cheers when it hits a corner perfectly with celebration effects
- **Smooth animation**: 60fps animation with optimized DOM manipulation
- **Large faces**: 360px × 360px faces for maximum visibility on projector screens
- **Clean design**: Pure faces with transparent containers, no visual clutter
- **SlideContainer bypass**: Direct rendering solution that works around common black screen issues

### 🌍 Mensajes Multilingües de Cumpleaños ✅ COMPLETAMENTE IMPLEMENTADO

- **12 Idiomas**: Feliz Cumpleaños en Español, Inglés, Francés, Italiano, Alemán, Japonés, Coreano, Ruso, Portugués, Holandés, Chino, Árabe
- **Apodos Aleatorios**: Cicla aleatoriamente a través de los apodos de Dany (Nanys, Danolo, Dano, Danilo, Nanis, Dany)
- **Diseño Elegante**: Tipografía serif grande sobre fondo blanco puro con código QR en la esquina
- **Combinaciones Aleatorias**: Cada 2.5 segundos muestra una nueva combinación aleatoria de apodo + idioma
- **Interfaz Limpia**: Diseño minimalista enfocado puramente en el mensaje de cumpleaños

### 🎨 Sistema de Diseño Minimalista ✅ NUEVO

- **Paleta de Colores**: Fondos blancos puros, texto negro, acentos grises
- **Tipografía**: Fuentes serif elegantes (`font-serif`) en toda la aplicación
- **Diseño Limpio**: Esquinas redondeadas, sombras sutiles, espacios en blanco amplios
- **Interfaz en Español**: Toda la interfaz de usuario traducida al español para invitados hispanohablantes
- **Consistencia Visual**: Lenguaje de diseño unificado en todos los componentes y páginas
- **Códigos QR Grandes**: 280px para fácil escaneo desde la distancia

### 📱 Controlador del Anfitrión

- **Superposición de anuncios**: Mostrar mensajes sobre cualquier diapositiva
- **Control de diapositivas**: Ajustar tiempo y orden de las diapositivas
- **Controles de emergencia**: Limpiar lienzo, descargas o reiniciar si es necesario
- **Amigable para móviles**: Controlar todo desde el teléfono del anfitrión

## Technology Stack Details

### Frontend Technologies

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and better development experience
- **Vite**: Lightning-fast development server and build tool
- **Tailwind CSS v3.4**: Utility-first CSS framework for rapid styling (v3 for stability)
- **Fabric.js**: Powerful canvas library for drawing features
- **react-qr-code**: QR code generation for easy phone access

### Backend & Infrastructure

- **Firebase Firestore**: Real-time NoSQL database for live updates
- **Firebase Storage**: Cloud storage for images and drawings
- **Firebase Hosting**: Fast, secure web hosting with CDN
- **GitHub Actions**: Automated deployment on code changes

### Key Benefits of This Stack

- **Zero server management**: Firebase handles all backend infrastructure
- **Real-time by default**: Changes appear instantly across all devices
- **Mobile-first**: Works perfectly on phones, tablets, and desktops
- **Fast deployment**: Push code and it's live in minutes
- **Cost-effective**: Firebase free tier handles party-sized traffic easily

## Development Timeline (8-hour sprint)

| Time | Milestone                | What Gets Built                                                | Status |
| ---- | ------------------------ | -------------------------------------------------------------- | ------ |
| 0-1h | **Setup**                | Project initialization, Firebase config, basic routing         | ✅ Done |
| 1-3h | **Drawing Canvas**       | Native HTML5 canvas, mobile drawing interface, Firebase sync  | ✅ Done |
| 3-4h | **Photo Capture**        | Camera interface, image compression, upload system             | ✅ Done |
| 4-6h | **Projector Display**    | Slideshow system, bouncing face animation, QR codes            | 🎯 Partial |
| 6-7h | **Controller & Polish**  | Admin interface, announcement system, mobile optimization      | 📋 Planned |
| 7-8h | **Testing & Deployment** | Cross-device testing, final deployment, party prep             | 📋 Planned |

## Getting Started for Developers

### Prerequisites

- Node.js 18+ installed
- Firebase account (free tier is sufficient)
- Git for version control
- Code editor (VS Code recommended)

### Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd birthday-wall
npm install

# Firebase is already configured! Just start development
npm run dev

# For deployment (when ready)
npm run deploy
```

### Environment Setup

Firebase is already configured with the `danybday-346c2` project! The `.env` file is already set up with production credentials. 

Available npm scripts:
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run deploy       # Build and deploy to Firebase
npm run emulators    # Start Firebase emulators for local testing
npm run type-check   # Run TypeScript validation
./deploy-storage.sh  # Deploy Firebase Storage rules (when Storage is enabled)
```

## For AI Assistants (Claude/ChatGPT)

When working on this project, keep these key principles in mind:

### Architecture Patterns

- **Component-based**: Each slide and feature should be its own React component
- **Real-time first**: Use Firebase onSnapshot for all live data
- **Mobile-responsive**: Design for phones first, desktop second
- **Error resilient**: Handle network issues gracefully with loading states

### Code Style Guidelines

- Use TypeScript interfaces for all data structures
- Functional components with hooks only (no class components)
- Tailwind CSS for all styling (avoid custom CSS files)
- ESLint/Prettier for consistent code formatting

### Firebase Patterns

```typescript
// Real-time subscription example
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "drawings"), (snapshot) => {
    const drawings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setDrawings(drawings);
  });
  return () => unsubscribe();
}, []);
```

### Mobile Optimization Priorities

1. **Touch interactions**: Ensure drawing works smoothly on touch screens
2. **Viewport handling**: Handle orientation changes and zoom
3. **Performance**: Optimize image uploads and canvas rendering
4. **Offline resilience**: Handle temporary network drops gracefully

### Testing Strategy

- Test on actual mobile devices (iOS Safari, Android Chrome)
- Verify real-time sync with multiple devices
- Check projector display at actual party resolution
- Test with slow network conditions

## Configuración del Día de la Fiesta / Party Day Setup

### Equipo Necesario / Equipment Needed

- Laptop/computadora conectada al proyector
- Red WiFi confiable
- Hotspot móvil de respaldo (recomendado)
- Códigos QR impresos (respaldo para los QRs de pantalla)

### Lista de Verificación Pre-Fiesta / Pre-Party Checklist

- [ ] Desplegar la última versión a Firebase Hosting
- [ ] Probar todas las funciones en múltiples dispositivos
- [ ] Verificar resolución de pantalla del proyector y modo pantalla completa
- [ ] Imprimir códigos QR de respaldo para páginas de dibujo y fotos
- [ ] Subir fotos de la persona del cumpleaños para la animación rebotante
- [ ] Probar permisos de cámara en diferentes dispositivos

### Durante la Fiesta / During Party

1. Abrir la computadora del proyector en la página `/viewer`
2. Establecer en modo pantalla completa (F11)
3. Tener el teléfono del anfitrión listo en la página `/controller`
4. Monitorear la consola de Firebase por cualquier problema
5. ¡Animar a los invitados a escanear códigos QR y participar!

### Troubleshooting

- **Canvas not syncing**: Check Firebase rules and network connection
- **Photos not uploading**: Verify camera permissions and file size limits
- **Slow performance**: Check image compression settings
- **QR codes not working**: Use printed backup QR codes

## Contributing

This is a one-day party project, but if you want to extend it:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on mobile devices
5. Submit a pull request

## License

MIT License - feel free to use this for your own parties!

## Credits

Built with ❤️ for an awesome birthday celebration. Special thanks to all the party guests who will make this interactive wall come alive!

---
