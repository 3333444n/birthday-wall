# 🎉 Birthday Wall Interactive Installation - Development Guide

## Project Overview

This is an interactive digital birthday party installation that creates a fun, engaging experience for party guests using their phones and a projector screen. The system allows real-time collaboration through drawing, photo sharing, and interactive displays.

### Key Features
- **🎨 Collaborative Drawing Wall**: Real-time shared canvas using Fabric.js
- **📸 Live Photo Collage**: Camera capture with instant display
- **🏀 Bouncing Birthday Face**: Physics-based animation with photo rotation
- **🌍 Multilingual Birthday Messages**: Dynamic text display in multiple languages
- **📱 Host Controller**: Admin interface for announcements and control

## Technical Architecture

### System Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Guest Phones  │    │   Web Browser    │    │   Projector     │
│                 │    │                  │    │                 │
│ QR Code Scan    │───▶│  React App       │───▶│ Viewer Display  │
│ Draw/Photo      │    │  (Vite + TS)     │    │ (Fullscreen)    │
│ Upload          │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐             │
         │              │    Firebase      │             │
         └─────────────▶│                  │◀────────────┘
                        │ • Firestore      │
                        │ • Storage        │
                        │ • Hosting        │
                        │ • Real-time sync │
                        └──────────────────┘
```

### Technology Stack

**Frontend**
- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Fabric.js for canvas drawing
- react-qr-code for QR generation

**Backend & Infrastructure**
- Firebase Firestore (real-time database)
- Firebase Storage (image storage)
- Firebase Hosting (deployment)
- GitHub Actions (CI/CD)

**Key Libraries**
- `fabric`: Canvas drawing library
- `react-router-dom`: Client-side routing
- `react-qr-code`: QR code generation
- `vite`: Build tool and dev server
- `tailwindcss@^3.4`: CSS framework (v3 for stability)

## Firebase Configuration Status ✅ COMPLETED

**Current Status**: Firebase is fully configured and functional!
- **Firebase Project**: `danybday-346c2` 
- **Firestore**: ✅ Enabled with security rules deployed
- **Storage**: ⚠️ Rules configured, service pending manual enablement (fallback implemented)
- **Hosting**: Configured for SPA deployment
- **Environment**: Production credentials configured in `.env`
- **Development**: TypeScript validation passing, photo system functional

## Firebase Setup Guide (Reference - Already Completed)

### Prerequisites
- Node.js 18+ installed
- Git for version control
- Firebase account (free tier sufficient)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase --version  # Verify installation
```

### Step 2: Firebase Login
```bash
firebase login
```

### Step 3: Create Firebase Project
```bash
# Via Firebase Console (recommended)
# 1. Go to https://console.firebase.google.com/
# 2. Click "Create a project"
# 3. Project name: "birthday-wall-[yourname]"
# 4. Enable Google Analytics (optional)
# 5. Wait for project creation

# Or via CLI
firebase projects:create birthday-wall-yourname
```

### Step 4: Initialize Firebase in Project
```bash
# In project root directory
firebase init

# Select the following services:
# ◉ Firestore: Configure security rules and indexes
# ◉ Storage: Configure security rules for Cloud Storage
# ◉ Hosting: Configure files for Firebase Hosting

# Configuration choices:
# Firestore Rules: firestore.rules
# Firestore Indexes: firestore.indexes.json
# Storage Rules: storage.rules
# Hosting Public Directory: dist
# Single Page App: Yes
# Automatic builds with GitHub: No (for now)
```

### Step 5: Configure Firestore Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to drawings collection
    match /drawings/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to photos collection
    match /photos/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to announcements collection
    match /announcements/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write access to settings collection
    match /settings/{document} {
      allow read, write: if true;
    }
  }
}
```

### Step 6: Configure Storage Security Rules
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read/write access to photos
    match /photos/{allPaths=**} {
      allow read, write: if true;
    }
    
    // Allow read/write access to drawings
    match /drawings/{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Step 7: Deploy Security Rules
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Step 8: Get Firebase Configuration
```bash
# Get your project config
firebase projects:list

# Or get it from Firebase Console:
# Project Settings > General > Your apps > SDK setup and configuration
```

## Environment Variables Template

Create a `.env` file in the project root:

```bash
# .env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=birthday-wall-yourname.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=birthday-wall-yourname
VITE_FIREBASE_STORAGE_BUCKET=birthday-wall-yourname.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_CANVAS=false

# Party Configuration
VITE_BIRTHDAY_PERSON_NAME=Dany
VITE_PARTY_THEME_COLOR=#ff6b6b
```

### Environment Variables Explanation

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase Web API key | `AIzaSyBxxxxxxxxx...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `birthday-wall-yourname` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project-id.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging ID | `123456789012` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123456789012:web:...` |
| `VITE_DEV_MODE` | Enable dev features | `true` / `false` |
| `VITE_DEBUG_CANVAS` | Canvas debug mode | `true` / `false` |
| `VITE_BIRTHDAY_PERSON_NAME` | Birthday person's name | `Dany` |
| `VITE_PARTY_THEME_COLOR` | Primary theme color | `#ff6b6b` |

## Folder Structure Planning

```
birthday-wall/
├── public/                          # Static assets
│   ├── index.html                  # Main HTML template
│   ├── favicon.ico                 # App favicon
│   ├── manifest.json               # PWA manifest
│   └── birthday-photos/            # Birthday person photos
│       ├── photo1.jpg              # Bouncing animation photos
│       ├── photo2.jpg
│       └── ...
│
├── src/                            # Source code
│   ├── components/                 # Reusable React components
│   │   ├── Canvas/                # Drawing canvas components
│   │   │   ├── DrawingCanvas.tsx   # Main canvas component
│   │   │   ├── CanvasToolbar.tsx   # Drawing tools (colors, brush)
│   │   │   └── CanvasControls.tsx  # Clear, undo controls
│   │   │
│   │   ├── Slides/                # Projector slide components
│   │   │   ├── SlideContainer.tsx  # Main slide wrapper
│   │   │   ├── DrawingSlide.tsx    # Canvas display slide
│   │   │   ├── PhotoSlide.tsx      # Photo collage slide
│   │   │   ├── BouncingSlide.tsx   # Bouncing face animation
│   │   │   ├── MessageSlide.tsx    # Multilingual messages
│   │   │   └── QRCodeSlide.tsx     # QR code display
│   │   │
│   │   ├── Photo/                 # Photo capture components
│   │   │   ├── CameraCapture.tsx   # Camera interface
│   │   │   ├── PhotoPreview.tsx    # Image preview before upload
│   │   │   └── PhotoGrid.tsx       # Photo display grid
│   │   │
│   │   ├── UI/                    # Common UI elements
│   │   │   ├── Button.tsx          # Styled button component
│   │   │   ├── Loading.tsx         # Loading spinner
│   │   │   ├── QRCode.tsx          # QR code generator
│   │   │   └── Announcement.tsx    # Overlay announcements
│   │   │
│   │   └── Layout/                # Layout components
│   │       ├── MobileLayout.tsx    # Mobile-first layout
│   │       ├── ProjectorLayout.tsx # Fullscreen projector layout
│   │       └── Navigation.tsx      # App navigation
│   │
│   ├── pages/                     # Main app pages/routes
│   │   ├── Viewer.tsx             # Projector fullscreen display
│   │   ├── Draw.tsx               # Mobile drawing interface
│   │   ├── Photo.tsx              # Camera capture interface
│   │   ├── Controller.tsx         # Host admin controls
│   │   └── Home.tsx               # Landing page with QR codes
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useFirestore.ts        # Firestore data hooks
│   │   ├── useCanvas.ts           # Canvas drawing hooks
│   │   ├── useCamera.ts           # Camera access hooks
│   │   ├── useRealtime.ts         # Real-time subscription hooks
│   │   └── useLocalStorage.ts     # Local storage persistence
│   │
│   ├── services/                  # External service integrations
│   │   ├── firebase.ts            # Firebase configuration
│   │   ├── firestore.ts           # Firestore operations
│   │   ├── storage.ts             # Firebase Storage operations
│   │   ├── canvas.ts              # Canvas drawing utilities
│   │   └── image.ts               # Image processing utilities
│   │
│   ├── utils/                     # Helper functions
│   │   ├── constants.ts           # App constants
│   │   ├── types.ts               # TypeScript type definitions
│   │   ├── colors.ts              # Color palette
│   │   ├── animations.ts          # Animation helpers
│   │   └── validation.ts          # Input validation
│   │
│   ├── styles/                    # Global styles
│   │   ├── index.css              # Tailwind imports & global styles
│   │   └── canvas.css             # Canvas-specific styles
│   │
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts             # Vite type definitions
│
├── firebase/                      # Firebase configuration files
│   ├── firestore.rules           # Firestore security rules
│   ├── firestore.indexes.json    # Firestore indexes
│   ├── storage.rules             # Storage security rules
│   └── firebase.json             # Firebase project config
│
├── docs/                         # Documentation
│   ├── DEPLOYMENT.md             # Deployment guide
│   ├── PARTY_SETUP.md            # Party day setup guide
│   └── TROUBLESHOOTING.md        # Common issues & solutions
│
├── .github/                      # GitHub Actions workflows
│   └── workflows/
│       └── deploy.yml            # Auto-deployment workflow
│
├── dist/                         # Build output (generated)
├── node_modules/                 # Dependencies (generated)
├── .env                         # Environment variables (local)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
├── package-lock.json            # Dependency lock file
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts               # Vite build configuration
├── eslint.config.js             # ESLint configuration
├── prettier.config.js           # Prettier configuration
├── README.md                    # Project overview
└── CLAUDE.md                    # This development guide
```

## Firebase Collections Structure

### `drawings` Collection
```typescript
interface Drawing {
  id: string;
  paths: fabric.Path[];
  timestamp: number;
  userId?: string;
  color: string;
  strokeWidth: number;
}
```

### `photos` Collection
```typescript
interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  timestamp: number;
  userId?: string;
  metadata: {
    width: number;
    height: number;
    size: number;
  };
}
```

### `announcements` Collection
```typescript
interface Announcement {
  id: string;
  message: string;
  timestamp: number;
  duration: number; // seconds
  isActive: boolean;
  priority: 'low' | 'medium' | 'high';
}
```

### `settings` Collection
```typescript
interface Settings {
  id: 'global';
  slideTimings: {
    drawing: number;
    photos: number;
    bouncing: number;
    messages: number;
  };
  birthdayPersonName: string;
  themeColor: string;
  languages: string[];
  messages: string[];
}
```

## Development Commands

```bash
# Project setup
npm install                    # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm run preview               # Preview production build
npm run lint                  # Run ESLint
npm run type-check           # Run TypeScript checks

# Firebase commands
firebase serve               # Serve locally
firebase deploy             # Deploy to production
firebase deploy --only hosting  # Deploy only frontend
firebase deploy --only firestore:rules  # Deploy only Firestore rules
./deploy-storage.sh         # Deploy Storage rules (when enabled)
firebase logs               # View deployment logs

# Testing
npm run test                # Run unit tests
npm run test:e2e           # Run end-to-end tests
npm run test:mobile        # Test mobile compatibility
```

## Critical Setup Requirements ⚠️

### File Structure Requirements

**IMPORTANT**: The `index.html` file MUST be in the **project root directory**, NOT in the `public/` folder. This is different from webpack-based projects and is a common source of 404 errors.

```
✅ CORRECT Structure:
birthday-wall/
├── index.html              # ← HERE (root directory)
├── public/
│   └── (static assets only like images, fonts, etc.)
├── src/
│   ├── main.tsx
│   └── App.tsx
└── vite.config.ts

❌ INCORRECT Structure:
birthday-wall/
├── public/
│   └── index.html          # ← NOT HERE (causes 404 errors)
└── src/
```

### Tailwind CSS Configuration ✅ CONFIGURED

**Current Setup**: Using Tailwind CSS v3.4 for stability and compatibility.

**PostCSS Configuration** (`postcss.config.js`):
```javascript
export default {
  plugins: {
    tailwindcss: {},    // Standard Tailwind v3 plugin
    autoprefixer: {},
  },
}
```

**Vite Configuration** (`vite.config.ts`):
```typescript
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Explicit PostCSS path
  },
  // ... other config
})
```

**⚠️ Important**: Tailwind v4 is still in alpha and has breaking changes. We use v3.4 for production stability.
```

### Common Development Issues

**Problem**: Server starts but shows 404 on `http://localhost:3000/`
**Solution**: 
1. Ensure `index.html` is in the root directory
2. Restart the dev server after moving the file
3. Check browser console for JavaScript errors

**Problem**: Tailwind CSS classes not working (styles not applying)
**Solution**:
1. **Check Tailwind version**: Use v3.4 instead of v4 (v4 is alpha with breaking changes)
   ```bash
   npm uninstall tailwindcss @tailwindcss/postcss
   npm install -D tailwindcss@^3.4.0
   ```
2. **Update PostCSS config** to use standard plugin:
   ```javascript
   // postcss.config.js
   export default {
     plugins: {
       tailwindcss: {},      // NOT '@tailwindcss/postcss'
       autoprefixer: {},
     },
   }
   ```
3. **Add explicit PostCSS path in Vite config**:
   ```typescript
   // vite.config.ts
   export default defineConfig({
     css: {
       postcss: './postcss.config.js',
     },
   })
   ```
4. Restart the dev server and hard refresh browser

**Problem**: React Router not working (404 on routes)
**Solution**: Vite automatically handles SPA routing when `index.html` is in the correct location

## Development Best Practices

### Real-time Data Patterns
```typescript
// Use onSnapshot for real-time updates
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'drawings'),
    (snapshot) => {
      const drawings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDrawings(drawings);
    }
  );
  return () => unsubscribe();
}, []);
```

### Mobile-First Development
- Always test on actual mobile devices
- Use `vh` units carefully (mobile browsers have dynamic viewport)
- Optimize touch interactions for drawing
- Handle orientation changes gracefully

### Performance Optimization
- Compress images before upload
- Use thumbnail versions for grids
- Debounce drawing events
- Implement proper loading states

### Error Handling
- Always handle network errors
- Provide offline fallbacks
- Show clear error messages
- Implement retry mechanisms

## Quick Start Commands

```bash
# 1. Clone and setup
git clone <repository-url>
cd birthday-wall
npm install

# 2. Firebase setup
npm install -g firebase-tools
firebase login
firebase init

# 3. Configure environment
cp .env.example .env
# Edit .env with your Firebase config

# 4. Start development
npm run dev

# 5. Deploy to production
npm run build
firebase deploy
```

## Testing Checklist

### Pre-Development Testing
- [ ] Firebase project created and configured
- [ ] Environment variables set correctly
- [ ] Development server starts without errors
- [ ] Firebase rules deployed successfully

### Feature Testing
- [ ] Drawing canvas works on mobile Safari/Chrome
- [ ] Photos upload and display correctly
- [ ] Real-time sync between devices
- [ ] Projector display shows all slides
- [ ] QR codes generate and scan properly
- [ ] Announcements overlay correctly

### Party Day Testing
- [ ] Test with multiple devices simultaneously
- [ ] Verify projector resolution and fullscreen mode
- [ ] Check WiFi stability under load
- [ ] Test camera permissions on different devices
- [ ] Verify all QR codes work from various distances

## Troubleshooting

### Common Issues
- **Canvas not syncing**: Check Firebase rules and network
- **Photos not uploading**: Verify camera permissions and file size
- **Slow performance**: Check image compression settings
- **QR codes not working**: Use printed backup QR codes

### Debug Commands
```bash
# Check Firebase connection
firebase projects:list

# View Firestore data
firebase firestore:indexes

# Check deployment status
firebase hosting:sites:list

# View logs
firebase functions:log
```

---

## Step 5 - Bouncing Face Animation ✅ COMPLETED

### DVD Screensaver Animation Implementation

**Core Achievement**: Fully functional DVD-style bouncing face animation with clean, minimal design.

**Key Components Implemented:**
- `src/components/Slides/BouncingSlide.tsx` - Complete bouncing animation with face rotation
- Direct DOM manipulation for optimal performance (bypasses React re-render issues)
- 360px × 360px face images for maximum projector visibility
- Physics-based bouncing with proper wall collision detection
- Face rotation system cycling through 12 birthday photos on each wall bounce

**Technical Breakthrough - SlideContainer Issue Resolution:**
- **Problem**: SlideContainer component was causing black screens due to flex centering conflicts
- **Solution**: Bypassed SlideContainer entirely for bouncing animation
- **Method**: Direct `return null` when inactive, direct rendering when active
- **Result**: This solution pattern can be applied to fix other slides showing black screens

**Key Features Working:**
- **Clean Visual Design**: Pure face images with transparent backgrounds, no colored containers
- **Large Size**: 360px faces clearly visible on projector screens
- **Smooth Animation**: 50ms intervals with direct DOM position updates
- **Face Rotation**: Changes to next face photo on every wall bounce (X or Y direction)
- **Corner Celebration**: Special 🎯 target animation when hitting exact screen corners
- **Minimal UI**: Only slide dots and progress bar visible, no text clutter

**Performance Optimizations:**
- Uses `useRef` instead of `useState` for animation values (prevents infinite re-renders)
- Direct DOM style updates (`element.style.left/top`) for smooth animation
- Window-based dimensions for accurate bounce detection
- Optimized collision detection with proper boundary calculations

**Files Created/Modified:**
```
src/components/Slides/BouncingSlide.tsx    # Complete rewrite - working animation
src/assets/faces/dany0.webp - dany11.webp # 12 birthday person face images
```

**Debugging Pattern Discovered:**
The key insight for other slides: The SlideContainer component's flex centering can interfere with absolute positioning. The solution is to either:
1. Override SlideContainer classes with `className="relative"` 
2. Bypass SlideContainer entirely for complex animations
3. Use `fixed inset-0` positioning to ensure full-screen coverage

This pattern will help resolve black screen issues in MessageSlide, QRCodeSlide, and other slides.

---

## Step 4 Implementation Details ✅ COMPLETED

### Camera System Architecture

**Core Components:**
- `src/hooks/useCamera.ts` - Device camera access with permissions handling
- `src/components/Photo/CameraCapture.tsx` - Mobile-optimized camera interface  
- `src/components/Photo/PhotoPreview.tsx` - Image preview and upload confirmation
- `src/hooks/usePhotoUpload.ts` - Upload workflow with progress tracking

**Key Features Implemented:**
- **Device Camera Access**: Front/back camera switching, mobile-optimized constraints
- **Permission Handling**: Graceful error states for denied/unsupported cameras
- **Image Compression**: Automatic JPEG conversion (800px max, 90% quality)
- **Fallback Storage**: Works with data URLs when Firebase Storage unavailable
- **Real-time Sync**: Photos appear instantly across all devices
- **Mobile UI**: Touch-friendly controls, responsive design, connection status

**Firebase Integration:**
- **Firestore**: Real-time photo collection with `onSnapshot` listeners
- **Storage**: Cloud storage with automatic thumbnail generation (when enabled)
- **Rules**: Security rules deployed for both Firestore and Storage
- **Fallback**: Data URL storage in Firestore when Storage service unavailable

**Files Created/Modified:**
```
src/hooks/useCamera.ts           # Camera device access hook
src/hooks/usePhotoUpload.ts      # Upload workflow with progress
src/components/Photo/
├── CameraCapture.tsx           # Camera interface component
├── PhotoPreview.tsx            # Upload preview component  
└── PhotoGrid.tsx               # Real-time photo grid
src/components/UI/
└── ConnectionStatus.tsx        # Firebase connection indicator
src/pages/Photo.tsx             # Updated main photo page
src/styles/index.css            # Mobile camera styles added
deploy-storage.sh               # Storage deployment script
```

**Technical Achievements:**
- Full mobile camera API integration with error handling
- Real-time Firebase sync with offline resilience
- Image compression and optimization pipeline
- Responsive UI that works on all mobile devices
- Fallback system ensuring functionality even without full Firebase setup

---

This CLAUDE.md file serves as your comprehensive development guide. Update it as the project evolves and add new sections as needed.