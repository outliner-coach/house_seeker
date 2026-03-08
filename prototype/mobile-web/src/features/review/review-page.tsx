import { pendingReviews } from '@/features/household/mock-data'

export function ReviewPage() {
  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">Review queue</p>
        <h2>Pending capture reviews</h2>
        <p className="lede">
          This screen will become the main entry point for accepting, editing, merging, or rejecting
          AI candidates.
        </p>
      </section>

      {pendingReviews.map((review) => (
        <article className="panel list-card" key={review.id}>
          <strong>{review.placePath}</strong>
          <span>{review.capturedAt}</span>
          <small>{review.confidenceHint}</small>
          <div className="actions-row">
            <button type="button">Resume review</button>
          </div>
        </article>
      ))}
    </div>
  )
}
