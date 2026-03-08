import { useAuth } from '@/features/auth/use-auth'
import { useHousehold } from '@/features/household/use-household'
import { useLocale } from '@/features/i18n/use-locale'
import { pendingReviews, placeSummaries, searchPreviewResults } from '@/features/household/mock-data'
import { useHouseholdPlaces } from '@/features/places/use-household-places'

export function HomePage() {
  const { appConfigured, user } = useAuth()
  const { bootstrapMode, householdId, member } = useHousehold()
  const { t } = useLocale()
  const { isShellMode, places } = useHouseholdPlaces()
  const trackedPlaces = isShellMode ? placeSummaries.length : places.length
  const stalePlaces = isShellMode
    ? placeSummaries.filter((place) => place.freshness === 'stale').length
    : places.filter((place) => place.freshnessStatus === 'stale').length

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h2>{user?.displayName ?? user?.email ?? t('home.signedInMember')}</h2>
        <input aria-label={t('home.searchAria')} placeholder={t('home.searchPlaceholder')} />
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{pendingReviews.length}</strong>
            <span>{t('home.pendingReviews')}</span>
          </div>
          <div className="stat-card">
            <strong>{stalePlaces}</strong>
            <span>{t('home.stalePlaces')}</span>
          </div>
          <div className="stat-card">
            <strong>{trackedPlaces}</strong>
            <span>{t('home.trackedPlaces')}</span>
          </div>
        </div>
        {!appConfigured ? (
          <div className="notice">{t('home.missingConfig')}</div>
        ) : null}
        {appConfigured ? (
          <div className="panel stack">
            <div className="section-heading">
              <h3>{t('home.bootstrap')}</h3>
              <span>{t(`enum.bootstrapMode.${bootstrapMode}`)}</span>
            </div>
            <dl className="details-list">
              <div>
                <dt>{t('home.householdId')}</dt>
                <dd>{householdId ?? t('home.notResolvedYet')}</dd>
              </div>
              <div>
                <dt>{t('home.memberRole')}</dt>
                <dd>{member?.role ? t(`enum.householdMemberRole.${member.role}`) : t('home.unknown')}</dd>
              </div>
              <div>
                <dt>{t('home.memberEmail')}</dt>
                <dd>{member?.email ?? user?.email ?? t('home.unavailable')}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>

      <section className="panel stack">
        <div className="section-heading">
          <h3>{t('home.searchPreview')}</h3>
          <span>{t('home.topThree')}</span>
        </div>
        {searchPreviewResults.map((result) => (
          <article className="list-card" key={`${result.itemName}-${result.placePath}`}>
            <strong>{result.itemName}</strong>
            <span>{result.placePath}</span>
            <small>
              {t(`enum.freshnessStatus.${result.freshness}`)} · {t('home.lastVerified')} {result.lastVerifiedAt}
            </small>
          </article>
        ))}
      </section>
    </div>
  )
}
