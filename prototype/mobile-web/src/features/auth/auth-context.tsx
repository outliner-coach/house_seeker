import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { AuthContext } from './auth-context-store'
import { getFirebaseServices } from '@/lib/firebase/client'

const pendingEmailStorageKey = 'house-seeker.pendingEmail'

export function AuthProvider({ children }: PropsWithChildren) {
  const services = getFirebaseServices()
  const [loading, setLoading] = useState(services.appConfigured)
  const [user, setUser] = useState<import('firebase/auth').User | null>(null)

  useEffect(() => {
    if (!services.auth) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(services.auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [services.auth])

  useEffect(() => {
    async function completeEmailLink() {
      if (!services.auth || typeof window === 'undefined') {
        return
      }

      if (!isSignInWithEmailLink(services.auth, window.location.href)) {
        return
      }

      const email = window.localStorage.getItem(pendingEmailStorageKey)

      if (!email) {
        return
      }

      await signInWithEmailLink(services.auth, email, window.location.href)
      window.localStorage.removeItem(pendingEmailStorageKey)
      window.history.replaceState({}, document.title, '/')
    }

    void completeEmailLink()
  }, [services.auth])

  async function signInWithGoogle() {
    if (!services.auth) {
      throw new Error('Firebase Auth is not configured.')
    }

    await signInWithPopup(services.auth, new GoogleAuthProvider())
  }

  async function sendEmailLink(email: string) {
    if (!services.auth || typeof window === 'undefined') {
      throw new Error('Firebase Auth is not configured.')
    }

    await sendSignInLinkToEmail(services.auth, email, {
      handleCodeInApp: true,
      url: window.location.origin,
    })

    window.localStorage.setItem(pendingEmailStorageKey, email)
  }

  async function signOutUser() {
    if (!services.auth) {
      return
    }

    await signOut(services.auth)
  }

  return (
    <AuthContext.Provider
      value={{
        appConfigured: services.appConfigured,
        loading,
        user,
        sendEmailLink,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
