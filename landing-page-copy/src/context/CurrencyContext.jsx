import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CURRENCIES, LANGUAGES } from '../data/currencies.js'

const CurrencyContext = createContext(null)

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => localStorage.getItem('sunrise_currency') || 'INR')
  const [language, setLanguage] = useState(() => localStorage.getItem('sunrise_language') || 'en')

  useEffect(() => localStorage.setItem('sunrise_currency', currency), [currency])
  useEffect(() => localStorage.setItem('sunrise_language', language), [language])

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      language,
      setLanguage,
      currencies: CURRENCIES,
      languages: LANGUAGES,
      symbol: CURRENCIES[currency]?.symbol ?? '₹',
      rate: CURRENCIES[currency]?.rate ?? 1,
    }),
    [currency, language],
  )

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}
