import { placeSummaries } from '@/features/household/mock-data'

export function PlacesPage() {
  return (
    <div className="stack">
      <section className="panel section-heading">
        <div>
          <p className="eyebrow">Places</p>
          <h2>Place hierarchy shell</h2>
        </div>
        <button type="button">Add place</button>
      </section>

      {placeSummaries.map((place) => (
        <article className="panel list-card" key={place.id}>
          <div className="pill-row">
            <span className="pill">{place.status}</span>
            <span className="pill">{place.freshness}</span>
          </div>
          <strong>{place.name}</strong>
          <span>{place.path}</span>
          <div className="actions-row">
            <button type="button">Open</button>
            <button type="button">Capture</button>
          </div>
        </article>
      ))}
    </div>
  )
}
