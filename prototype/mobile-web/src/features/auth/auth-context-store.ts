import { createContext } from 'react'
import type { User } from 'firebase/auth'

export type AuthContextValue = {
  appConfigured: boolean
  loading: boolean
  user: User | null
  sendEmailLink: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
