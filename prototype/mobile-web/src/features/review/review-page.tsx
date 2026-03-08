import { pendingReviews } from '@/features/household/mock-data'
import { useLocale } from '@/features/i18n/use-locale'

export function ReviewPage() {
  const { t } = useLocale()

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">{t('review.eyebrow')}</p>
        <h2>{t('review.heading')}</h2>
        <p className="lede">{t('review.description')}</p>
      </section>

      {pendingReviews.map((review) => (
        <article className="panel list-card" key={review.id}>
          <strong>{review.placePath}</strong>
          <span>{review.capturedAt}</span>
          <small>{t('review.lowConfidenceCandidates', { count: review.lowConfidenceCount })}</small>
          <div className="actions-row">
            <button type="button">{t('review.resume')}</button>
          </div>
        </article>
      ))}
    </div>
  )
}
