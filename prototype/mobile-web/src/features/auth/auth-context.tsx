import {
  GoogleAuthProvider,
  isSignInWithEmailLink,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailLink,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { useEffect, useState, type PropsWithChildren } from 'react'
import { AuthContext } from './auth-context-store'
import { getFirebaseServices } from '@/lib/firebase/client'
import {
  clearLocalSessionUser,
  readLocalSessionUser,
  writeLocalSessionUser,
} from '@/lib/local/local-store'

const pendingEmailStorageKey = 'house-seeker.pendingEmail'

export function AuthProvider({ children }: PropsWithChildren) {
  const services = getFirebaseServices()
  const [loading, setLoading] = useState(!services.localMode && services.appConfigured)
  const [user, setUser] = useState(() => readLocalSessionUser())

  useEffect(() => {
    if (!services.auth || services.localMode) {
      return undefined
    }

    const unsubscribe = onAuthStateChanged(services.auth, (nextUser) => {
      setUser(
        nextUser
          ? {
              uid: nextUser.uid,
              email: nextUser.email,
              displayName: nextUser.displayName,
              isAnonymous: nextUser.isAnonymous,
            }
          : null,
      )
      setLoading(false)
    })

    return unsubscribe
  }, [services.auth, services.localMode])

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
      throw new Error('error.auth.notConfigured')
    }

    await signInWithPopup(services.auth, new GoogleAuthProvider())
  }

  async function signInForLocalTesting() {
    if (services.localMode) {
      const localUser = {
        uid: `local-${crypto.randomUUID()}`,
        email: 'local@house-seeker.test',
        displayName: 'Local Tester',
        isAnonymous: true,
      }
      writeLocalSessionUser(localUser)
      setUser(localUser)
      return
    }

    if (!services.auth || !services.emulatorMode) {
      throw new Error('error.auth.localUnavailable')
    }

    await signInAnonymously(services.auth)
  }

  async function sendEmailLink(email: string) {
    if (!services.auth || typeof window === 'undefined') {
      throw new Error('error.auth.notConfigured')
    }

    await sendSignInLinkToEmail(services.auth, email, {
      handleCodeInApp: true,
      url: window.location.origin,
    })

    window.localStorage.setItem(pendingEmailStorageKey, email)
  }

  async function signOutUser() {
    if (services.localMode) {
      clearLocalSessionUser()
      setUser(null)
      return
    }

    if (!services.auth) {
      return
    }

    await signOut(services.auth)
  }

  return (
    <AuthContext.Provider
      value={{
        appConfigured: services.appConfigured,
        emulatorMode: services.emulatorMode,
        localMode: services.localMode,
        loading,
        user,
        sendEmailLink,
        signInForLocalTesting,
        signInWithGoogle,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
