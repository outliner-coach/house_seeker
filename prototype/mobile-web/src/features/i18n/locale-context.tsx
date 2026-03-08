import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { LocaleContext, type Locale } from './locale-context-store'
import { translate } from './messages'

const localeStorageKey = 'house-seeker.locale'

function isLocale(value: string | null): value is Locale {
  return value === 'ko' || value === 'en'
}

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'ko'
  }

  const stored = window.localStorage.getItem(localeStorageKey)
  return isLocale(stored) ? stored : 'ko'
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(() => readStoredLocale())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(localeStorageKey, locale)
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, number | string>) => translate(locale, key, params),
    [locale],
  )

  const formatError = useCallback(
    (error: unknown, fallbackKey: string) => {
      if (error instanceof Error) {
        if (error.message.startsWith('error.')) {
          return t(error.message)
        }

        return error.message
      }

      return t(fallbackKey)
    },
    [t],
  )

  const value = useMemo(
    () => ({
      formatError,
      locale,
      setLocale,
      t,
    }),
    [formatError, locale, setLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
