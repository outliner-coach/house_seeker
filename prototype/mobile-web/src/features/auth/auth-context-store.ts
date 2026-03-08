import { createContext } from 'react'

export type AppUser = {
  uid: string
  email: string | null
  displayName: string | null
  isAnonymous: boolean
}

export type AuthContextValue = {
  appConfigured: boolean
  emulatorMode: boolean
  localMode: boolean
  loading: boolean
  user: AppUser | null
  sendEmailLink: (email: string) => Promise<void>
  signInForLocalTesting: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
