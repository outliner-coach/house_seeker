import { useLocale } from '@/features/i18n/use-locale'

const starterCategoryKeys = ['stationery', 'charging', 'documents', 'craftSupplies'] as const

export function BrowsePage() {
  const { t } = useLocale()

  return (
    <div className="stack">
      <section className="panel stack">
        <p className="eyebrow">{t('browse.eyebrow')}</p>
        <h2>{t('browse.heading')}</h2>
        <p className="lede">{t('browse.description')}</p>
      </section>

      <div className="grid-cards">
        {starterCategoryKeys.map((categoryKey) => (
          <article className="panel list-card" key={categoryKey}>
            <strong>{t(`browse.${categoryKey}`)}</strong>
            <span>{t('browse.categoryShell')}</span>
          </article>
        ))}
      </div>
    </div>
  )
}
