import { BrowserRouter, Navigate, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { SignInPage } from '@/features/auth/sign-in-page'
import { useAuth } from '@/features/auth/use-auth'
import { BrowsePage } from '@/features/browse/browse-page'
import { HomePage } from '@/features/home/home-page'
import { PlacesPage } from '@/features/places/places-page'
import { ReviewPage } from '@/features/review/review-page'
import { SettingsPage } from '@/features/settings/settings-page'
import { useHousehold } from '@/features/household/use-household'

const tabs = [
  { to: '/', label: 'Home', end: true },
  { to: '/places', label: 'Places' },
  { to: '/review', label: 'Review' },
  { to: '/browse', label: 'Browse' },
  { to: '/settings', label: 'Settings' },
]

function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">House Seeker</p>
          <h1>Prototype Shell</h1>
        </div>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
      <nav aria-label="Primary" className="bottom-nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
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

  if (loading) {
    return <div className="centered-state">Preparing household workspace...</div>
  }

  if (error) {
    return (
      <div className="centered-state padded-state">
        <div className="panel stack">
          <h2>Unable to open the household</h2>
          <p className="helper-text">{error}</p>
          <button onClick={refresh} type="button">
            Retry household bootstrap
          </button>
        </div>
      </div>
    )
  }

  return <AuthenticatedRoutes />
}

export function AppRouter() {
  const { loading, user } = useAuth()

  if (loading) {
    return <div className="centered-state">Loading session...</div>
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
