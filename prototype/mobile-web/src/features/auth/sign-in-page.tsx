import { useState } from 'react'
import { useAuth } from './use-auth'

export function SignInPage() {
  const {
    appConfigured,
    emulatorMode,
    localMode,
    sendEmailLink,
    signInForLocalTesting,
    signInWithGoogle,
  } = useAuth()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage('')

    try {
      await sendEmailLink(email)
      setMessage('Email link sent. Check the mailbox tied to this Firebase project.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to send sign-in link.')
    } finally {
      setPending(false)
    }
  }

  async function handleGoogleSignIn() {
    setPending(true)
    setMessage('')

    try {
      await signInWithGoogle()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in with Google.')
    } finally {
      setPending(false)
    }
  }

  async function handleLocalSignIn() {
    setPending(true)
    setMessage('')

    try {
      await signInForLocalTesting()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in locally.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="panel hero-panel">
        <p className="eyebrow">Shared household memory</p>
        <h1>House Seeker</h1>
        <p className="lede">
          Sign in to start building the shared place tree, capture storage spaces, and review item
          candidates.
        </p>
        {!appConfigured ? (
          <div className="notice">
            Firebase environment variables are missing. Add them before testing live auth.
          </div>
        ) : null}
        {localMode ? (
          <div className="notice">
            Local mode is enabled. Sign in uses browser-local test data instead of Firebase.
          </div>
        ) : null}
        {emulatorMode ? (
          <div className="notice">
            Emulator mode is enabled. Local anonymous sign-in is available for smoke testing.
          </div>
        ) : null}
      </div>

      <div className="panel stack">
        <h2>Sign in</h2>
        {localMode || emulatorMode ? (
          <>
            <button disabled={pending || !appConfigured} onClick={handleLocalSignIn} type="button">
              {localMode ? 'Continue with local test mode' : 'Continue with local emulator'}
            </button>
            <div className="divider">or</div>
          </>
        ) : null}
        <form className="stack" onSubmit={handleEmailSubmit}>
          <label className="stack" htmlFor="email">
            <span>Email link</span>
            <input
              autoComplete="email"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="parent@example.com"
              type="email"
              value={email}
            />
          </label>
          <button disabled={pending || !appConfigured || email.length === 0} type="submit">
            Send sign-in link
          </button>
        </form>

        <div className="divider">or</div>

        <button disabled={pending || !appConfigured} onClick={handleGoogleSignIn} type="button">
          Continue with Google
        </button>

        {message ? <p className="helper-text">{message}</p> : null}
      </div>
    </div>
  )
}
