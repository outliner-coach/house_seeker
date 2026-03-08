import { getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage, type FirebaseStorage } from 'firebase/storage'

type FirebaseServices = {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  emulatorMode: boolean
  localMode: boolean
  storage: FirebaseStorage | null
  appConfigured: boolean
}

let cachedServices: FirebaseServices | null = null
let emulatorsConnected = false

function isEmulatorModeEnabled() {
  return import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
}

function isLocalModeEnabled() {
  return import.meta.env.VITE_USE_LOCAL_MODE === 'true'
}

function readEmulatorHost() {
  return import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1'
}

function readFirebaseConfig() {
  const localMode = isLocalModeEnabled()
  const emulatorMode = isEmulatorModeEnabled()
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'house-seeker-local'
  const baseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  const config = emulatorMode
    ? {
        apiKey: baseConfig.apiKey || 'local-emulator-api-key',
        authDomain: baseConfig.authDomain || `${projectId}.firebaseapp.com`,
        projectId,
        storageBucket: baseConfig.storageBucket || `${projectId}.appspot.com`,
        messagingSenderId: baseConfig.messagingSenderId || '1234567890',
        appId: baseConfig.appId || '1:1234567890:web:house-seeker-local',
      }
    : baseConfig

  const appConfigured = localMode || emulatorMode || Object.values(baseConfig).every(Boolean)

  return { appConfigured, config, emulatorMode, localMode }
}

function connectLocalEmulators(auth: Auth, db: Firestore, storage: FirebaseStorage) {
  if (emulatorsConnected || !isEmulatorModeEnabled()) {
    return
  }

  const host = readEmulatorHost()
  connectAuthEmulator(auth, `http://${host}:9099`, {
    disableWarnings: true,
  })
  connectFirestoreEmulator(db, host, 8080)
  connectStorageEmulator(storage, host, 9199)
  emulatorsConnected = true
}

export function getFirebaseServices(): FirebaseServices {
  if (cachedServices) {
    return cachedServices
  }

  const { appConfigured, config, emulatorMode, localMode } = readFirebaseConfig()

  if (!appConfigured) {
    cachedServices = {
      app: null,
      auth: null,
      db: null,
      emulatorMode,
      localMode,
      storage: null,
      appConfigured: false,
    }

    return cachedServices
  }

  if (localMode) {
    cachedServices = {
      app: null,
      auth: null,
      db: null,
      emulatorMode: false,
      localMode: true,
      storage: null,
      appConfigured: true,
    }

    return cachedServices
  }

  const app = getApps()[0] ?? initializeApp(config)
  const auth = getAuth(app)
  const db = getFirestore(app)
  const storage = getStorage(app)

  connectLocalEmulators(auth, db, storage)

  cachedServices = {
    app,
    auth,
    db,
    emulatorMode,
    localMode: false,
    storage,
    appConfigured: true,
  }

  return cachedServices
}
