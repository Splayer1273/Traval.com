import { createContext, useContext, useEffect, useMemo, useState } from 'react'

/**
 * Holds the in-progress booking draft across the flow:
 * search → select → passengers → add-ons → payment → confirmation.
 * Persisted to sessionStorage so a refresh doesn't lose the trip.
 */
const BookingContext = createContext(null)
const KEY = 'sunrise_draft'

const EMPTY = { kind: null, item: null, passengers: [], contact: null, emergency: null, addons: [], promo: null }

export function BookingProvider({ children }) {
  const [draft, setDraft] = useState(() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem(KEY))
      return raw && raw.item ? raw : EMPTY
    } catch {
      return EMPTY
    }
  })

  useEffect(() => {
    if (draft.item) sessionStorage.setItem(KEY, JSON.stringify(draft))
    else sessionStorage.removeItem(KEY)
  }, [draft])

  const value = useMemo(
    () => ({
      draft,
      setKind: (kind, item) => setDraft({ ...EMPTY, kind, item }),
      setPassengers: (passengers) => setDraft((d) => ({ ...d, passengers })),
      setContact: (contact) => setDraft((d) => ({ ...d, contact })),
      setEmergency: (emergency) => setDraft((d) => ({ ...d, emergency })),
      setAddons: (addons) => setDraft((d) => ({ ...d, addons })),
      setPromo: (promo) => setDraft((d) => ({ ...d, promo })),
      clear: () => setDraft(EMPTY),
    }),
    [draft],
  )

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error('useBooking must be used within BookingProvider')
  return ctx
}
