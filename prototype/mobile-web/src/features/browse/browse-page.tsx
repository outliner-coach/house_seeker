const starterCategories = ['Stationery', 'Charging', 'Documents', 'Craft Supplies']

export function BrowsePage() {
  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">Browse</p>
        <h2>Category-first retrieval</h2>
        <p className="lede">
          Category browsing is intentionally part of the first prototype so the product does not
          depend entirely on perfect text search.
        </p>
      </section>

      <div className="grid-cards">
        {starterCategories.map((category) => (
          <article className="panel list-card" key={category}>
            <strong>{category}</strong>
            <span>Prototype category shell</span>
          </article>
        ))}
      </div>
    </div>
  )
}
