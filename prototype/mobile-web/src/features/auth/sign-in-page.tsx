import { useState } from 'react'
import { LocaleSwitcher } from '@/features/i18n/locale-switcher'
import { useLocale } from '@/features/i18n/use-locale'
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
  const { formatError, t } = useLocale()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage('')

    try {
      await sendEmailLink(email)
      setMessage(t('signIn.sentEmail'))
    } catch (error) {
      setMessage(formatError(error, 'signIn.errorSendEmail'))
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
      setMessage(formatError(error, 'signIn.errorGoogle'))
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
      setMessage(formatError(error, 'signIn.errorLocal'))
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="panel hero-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t('signIn.heroEyebrow')}</p>
            <h1>{t('brand.appName')}</h1>
          </div>
          <LocaleSwitcher compact />
        </div>
        <p className="lede">{t('signIn.lede')}</p>
        {!appConfigured ? (
          <div className="notice">{t('signIn.missingConfig')}</div>
        ) : null}
        {localMode ? <div className="notice">{t('signIn.localModeNotice')}</div> : null}
        {emulatorMode ? <div className="notice">{t('signIn.emulatorModeNotice')}</div> : null}
      </div>

      <div className="panel stack">
        <h2>{t('signIn.heading')}</h2>
        {localMode || emulatorMode ? (
          <>
            <button
              data-testid="local-sign-in"
              disabled={pending || !appConfigured}
              onClick={handleLocalSignIn}
              type="button"
            >
              {localMode ? t('signIn.continueLocalMode') : t('signIn.continueLocalEmulator')}
            </button>
            <div className="divider">{t('signIn.or')}</div>
          </>
        ) : null}
        <form className="stack" onSubmit={handleEmailSubmit}>
          <label className="stack" htmlFor="email">
            <span>{t('signIn.emailLink')}</span>
            <input
              autoComplete="email"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('signIn.emailPlaceholder')}
              type="email"
              value={email}
            />
          </label>
          <button disabled={pending || !appConfigured || email.length === 0} type="submit">
            {t('signIn.sendLink')}
          </button>
        </form>

        <div className="divider">{t('signIn.or')}</div>

        <button disabled={pending || !appConfigured} onClick={handleGoogleSignIn} type="button">
          {t('signIn.continueGoogle')}
        </button>

        {message ? <p className="helper-text">{message}</p> : null}
      </div>
    </div>
  )
}
