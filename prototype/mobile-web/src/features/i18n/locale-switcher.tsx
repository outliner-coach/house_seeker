import { useId } from 'react'
import { useLocale } from './use-locale'

type LocaleSwitcherProps = {
  compact?: boolean
}

export function LocaleSwitcher({ compact = false }: LocaleSwitcherProps) {
  const id = useId()
  const { locale, setLocale, t } = useLocale()

  return (
    <label className={compact ? 'locale-switcher compact' : 'locale-switcher'} htmlFor={id}>
      <span>{t('locale.label')}</span>
      <select
        data-testid="locale-select"
        id={id}
        onChange={(event) => setLocale(event.target.value as 'en' | 'ko')}
        value={locale}
      >
        <option value="ko">{t('locale.ko')}</option>
        <option value="en">{t('locale.en')}</option>
      </select>
    </label>
  )
}
