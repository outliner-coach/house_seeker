import { useAuth } from '@/features/auth/use-auth'
import { useHousehold } from '@/features/household/use-household'
import { pendingReviews, placeSummaries, searchPreviewResults } from '@/features/household/mock-data'
import { useHouseholdPlaces } from '@/features/places/use-household-places'

export function HomePage() {
  const { appConfigured, user } = useAuth()
  const { bootstrapMode, householdId, member } = useHousehold()
  const { isShellMode, places } = useHouseholdPlaces()
  const trackedPlaces = isShellMode ? placeSummaries.length : places.length
  const stalePlaces = isShellMode
    ? placeSummaries.filter((place) => place.freshness === 'stale').length
    : places.filter((place) => place.freshnessStatus === 'stale').length

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">Welcome</p>
        <h2>{user?.displayName ?? user?.email ?? 'Signed-in household member'}</h2>
        <input aria-label="Search items" placeholder="Search for glue gun, charger, passport..." />
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{pendingReviews.length}</strong>
            <span>Pending reviews</span>
          </div>
          <div className="stat-card">
            <strong>{stalePlaces}</strong>
            <span>Stale places</span>
          </div>
          <div className="stat-card">
            <strong>{trackedPlaces}</strong>
            <span>Tracked places</span>
          </div>
        </div>
        {!appConfigured ? (
          <div className="notice">Firebase config missing. The prototype is running in shell mode.</div>
        ) : null}
        {appConfigured ? (
          <div className="panel stack">
            <div className="section-heading">
              <h3>Household bootstrap</h3>
              <span>{bootstrapMode}</span>
            </div>
            <dl className="details-list">
              <div>
                <dt>Household ID</dt>
                <dd>{householdId ?? 'Not resolved yet'}</dd>
              </div>
              <div>
                <dt>Member role</dt>
                <dd>{member?.role ?? 'Unknown'}</dd>
              </div>
              <div>
                <dt>Member email</dt>
                <dd>{member?.email ?? user?.email ?? 'Unavailable'}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <section className="panel stack">
        <div className="section-heading">
          <h3>Search preview</h3>
          <span>Top 3 candidate shape</span>
        </div>
        {searchPreviewResults.map((result) => (
          <article className="list-card" key={`${result.itemName}-${result.placePath}`}>
            <strong>{result.itemName}</strong>
            <span>{result.placePath}</span>
            <small>
              {result.freshness} · last verified {result.lastVerifiedAt}
            </small>
          </article>
        ))}
      </section>
    </div>
  )
}
