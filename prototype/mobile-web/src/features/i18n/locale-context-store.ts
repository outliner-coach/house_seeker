import { createContext } from 'react'

export type Locale = 'ko' | 'en'

export type TranslationParams = Record<string, number | string>

export type LocaleContextValue = {
  formatError: (error: unknown, fallbackKey: string) => string
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, params?: TranslationParams) => string
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)
