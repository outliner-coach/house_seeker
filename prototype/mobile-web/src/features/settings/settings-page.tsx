import { useAuth } from '@/features/auth/use-auth'

export function SettingsPage() {
  const { appConfigured, signOutUser, user } = useAuth()

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">Settings</p>
        <h2>Account and household</h2>
        <dl className="details-list">
          <div>
            <dt>User</dt>
            <dd>{user?.email ?? 'Unknown'}</dd>
          </div>
          <div>
            <dt>Config</dt>
            <dd>{appConfigured ? 'Firebase connected' : 'Shell mode'}</dd>
          </div>
        </dl>
        <button onClick={() => void signOutUser()} type="button">
          Sign out
        </button>
      </section>
    </div>
  )
}
