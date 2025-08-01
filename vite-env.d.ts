/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_DEV_MODE?: string
  readonly VITE_DEBUG_CANVAS?: string
  readonly VITE_BIRTHDAY_PERSON_NAME?: string
  readonly VITE_PARTY_THEME_COLOR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}