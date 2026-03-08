import { useState } from 'react'
import { useAuth } from './use-auth'

export function SignInPage() {
  const { appConfigured, sendEmailLink, signInWithGoogle } = useAuth()
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
      </div>

      <div className="panel stack">
        <h2>Sign in</h2>
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
