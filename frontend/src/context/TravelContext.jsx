import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { corporateApi } from '../services/corporateApi.js'

/**
 * Holds the in-progress corporate travel draft across the flow:
 * create trip → search & select flight → search & select hotel → review & submit.
 * Persisted to localStorage so a refresh doesn't lose the draft.
 */
const TravelContext = createContext(null)

export function TravelProvider({ children }) {
  const [draft, setDraft] = useState(() => corporateApi.getDraft())

  useEffect(() => {
    corporateApi.saveDraft(draft)
  }, [draft])

  const value = useMemo(
    () => ({
      draft,
      hasDraft: !!draft,
      setTrip: (trip) => setDraft((d) => ({ ...(d || {}), trip })),
      setFlight: (flight) => setDraft((d) => ({ ...(d || {}), flight })),
      setHotel: (hotel, room) => setDraft((d) => ({ ...(d || {}), hotel, room })),
      setDraft,
      clear: () => setDraft(null),
    }),
    [draft],
  )

  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
}

export function useTravel() {
  const ctx = useContext(TravelContext)
  if (!ctx) throw new Error('useTravel must be used within TravelProvider')
  return ctx
}
