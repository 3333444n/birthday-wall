# 🎉 Birthday Wall Interactive Installation

## What is this project?

This is an interactive digital birthday party installation that creates a fun, engaging experience for party guests using just their phones and a projector screen.

### For Party Guests (Non-Programmers)

Imagine walking into a birthday party and seeing a big screen on the wall that's constantly changing between different fun displays:

1. **🎨 Collaborative Drawing Wall**: A giant digital canvas where everyone can draw together! Scan a QR code with your phone, and you can add your own doodles, sketches, or birthday messages right on the shared canvas. Your drawing appears instantly on the big screen for everyone to see.

2. **📸 Live Photo Collage**: Take photos throughout the party using your phone's camera, and watch them automatically appear in a growing photo grid on the screen. It's like a live scrapbook of the party happening in real-time!

3. **🏀 Bouncing Birthday Face**: The birthday person's face bounces around the screen like the old DVD screensaver, changing to different photos each time it hits an edge. Everyone always cheers when it hits a corner perfectly!

4. **🌍 Happy Birthday Around the World**: The screen shows "Happy Birthday" in different languages, mixed with the birthday person's nicknames and fun messages.

The party host can also pop up announcements on the screen from their phone (like "Cake time in 5 minutes!").

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

### 🏀 Bouncing Face Animation

- **Physics simulation**: Realistic bouncing with edge detection
- **Photo rotation**: Cycles through 12 different photos of the birthday person
- **Crowd pleaser**: Always gets cheers when it hits a corner perfectly
- **Smooth animation**: 60fps animation using requestAnimationFrame

### 🌍 Multilingual Birthday Messages

- **Multiple languages**: Happy Birthday in Spanish, French, English, etc.
- **Personal touch**: Includes the birthday person's nicknames
- **Dynamic rotation**: Messages change every few seconds
- **Customizable**: Easy to add more languages or messages

### 📱 Host Controller

- **Announcement overlay**: Pop up messages over any slide
- **Slide control**: Adjust timing and order of slides
- **Emergency controls**: Clear canvas, downloads or reset if needed
- **Mobile friendly**: Control everything from the host's phone

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
| 4-6h | **Projector Display**    | Slideshow system, all four slide types, QR codes               | 📋 Next |
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

## Party Day Setup

### Equipment Needed

- Laptop/computer connected to projector
- Reliable WiFi network
- Backup mobile hotspot (recommended)
- QR code printouts (backup for screen QRs)

### Pre-Party Checklist

- [ ] Deploy latest version to Firebase Hosting
- [ ] Test all features on multiple devices
- [ ] Verify projector display resolution and fullscreen mode
- [ ] Print backup QR codes for drawing and photo pages
- [ ] Upload birthday person's photos for bouncing animation
- [ ] Test camera permissions on different devices

### During Party

1. Open projector computer to `/viewer` page
2. Set to fullscreen mode (F11)
3. Have host phone ready on `/controller` page
4. Monitor Firebase console for any issues
5. Encourage guests to scan QR codes and participate!

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
