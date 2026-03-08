import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { SignInPage } from '@/features/auth/sign-in-page'
import { useAuth } from '@/features/auth/use-auth'
import { BrowsePage } from '@/features/browse/browse-page'
import { HomePage } from '@/features/home/home-page'
import { LocaleSwitcher } from '@/features/i18n/locale-switcher'
import { useLocale } from '@/features/i18n/use-locale'
import { PlacesPage } from '@/features/places/places-page'
import { ReviewPage } from '@/features/review/review-page'
import { SettingsPage } from '@/features/settings/settings-page'
import { useHousehold } from '@/features/household/use-household'

function AppShell() {
  const { t } = useLocale()
  const tabs = [
    { to: '/', label: t('tabs.home'), end: true, testId: 'tab-home' },
    { to: '/places', label: t('tabs.places'), testId: 'tab-places' },
    { to: '/review', label: t('tabs.review'), testId: 'tab-review' },
    { to: '/browse', label: t('tabs.browse'), testId: 'tab-browse' },
    { to: '/settings', label: t('tabs.settings'), testId: 'tab-settings' },
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-row">
          <div>
            <p className="eyebrow">{t('brand.appName')}</p>
            <h1>{t('app.prototypeShell')}</h1>
          </div>
          <LocaleSwitcher compact />
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <nav aria-label={t('app.primaryNav')} className="bottom-nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            data-testid={tab.testId}
            end={tab.end}
            to={tab.to}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route element={<HomePage />} index />
        <Route element={<PlacesPage />} path="/places" />
        <Route element={<ReviewPage />} path="/review" />
        <Route element={<BrowsePage />} path="/browse" />
        <Route element={<SettingsPage />} path="/settings" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Route>
    </Routes>
  )
}

function HouseholdGate() {
  const { error, loading, refresh } = useHousehold()
  const { formatError, t } = useLocale()

  if (loading) {
    return <div className="centered-state">{t('app.prepareHouseholdWorkspace')}</div>
  }

  if (error) {
    return (
      <div className="centered-state padded-state">
        <div className="panel stack">
          <h2>{t('app.unableToOpenHousehold')}</h2>
          <p className="helper-text">{formatError(new Error(error), 'error.household.syncFailed')}</p>
          <button onClick={refresh} type="button">
            {t('app.retryHouseholdBootstrap')}
          </button>
        </div>
      </div>
    )
  }

  return <AuthenticatedRoutes />
}

export function AppRouter() {
  const { loading, user } = useAuth()
  const { t } = useLocale()

  if (loading) {
    return <div className="centered-state">{t('app.loadingSession')}</div>
  }

  if (!user) {
    return <SignInPage />
  }

  return (
    <BrowserRouter>
      <HouseholdGate />
    </BrowserRouter>
  )
}
