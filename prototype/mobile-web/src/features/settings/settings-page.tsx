import { useAuth } from '@/features/auth/use-auth'
import { LocaleSwitcher } from '@/features/i18n/locale-switcher'
import { useLocale } from '@/features/i18n/use-locale'

export function SettingsPage() {
  const { appConfigured, emulatorMode, localMode, signOutUser, user } = useAuth()
  const { t } = useLocale()

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">{t('settings.eyebrow')}</p>
        <h2>{t('settings.heading')}</h2>
        <dl className="details-list">
          <div>
            <dt>{t('settings.user')}</dt>
            <dd>{user?.email ?? t('settings.unknown')}</dd>
          </div>
          <div>
            <dt>{t('settings.config')}</dt>
            <dd>{appConfigured ? t('settings.configConnected') : t('settings.shellMode')}</dd>
          </div>
          <div>
            <dt>{t('settings.mode')}</dt>
            <dd>
              {localMode
                ? t('settings.localBrowserMode')
                : emulatorMode
                  ? t('settings.firebaseEmulators')
                  : t('settings.liveFirebase')}
            </dd>
          </div>
        </dl>
        <div className="stack">
          <span>{t('settings.language')}</span>
          <LocaleSwitcher />
        </div>
        <button onClick={() => void signOutUser()} type="button">
          {t('settings.signOut')}
        </button>
      </section>
    </div>
  )
}
