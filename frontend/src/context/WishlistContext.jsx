import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useToast } from './ToastContext.jsx'

const WishlistContext = createContext(null)
const KEY = 'sunrise_wishlist'

export function WishlistProvider({ children }) {
  const { success, info } = useToast()
  const [items, setItems] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY))
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items])

  const toggle = (item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.type === item.type && i.id === item.id)
      if (exists) {
        info(`${item.name} removed from wishlist`, 'Wishlist')
        return prev.filter((i) => !(i.type === item.type && i.id === item.id))
      }
      success(`${item.name} saved to wishlist`, 'Wishlist')
      return [{ ...item, savedAt: Date.now() }, ...prev]
    })
  }

  const remove = (id, type) =>
    setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)))

  const has = (type, id) => items.some((i) => i.type === type && i.id === id)

  const value = useMemo(
    () => ({
      items,
      toggle,
      remove,
      has,
      count: items.length,
      hotels: items.filter((i) => i.type === 'hotel'),
      destinations: items.filter((i) => i.type === 'destination'),
      packages: items.filter((i) => i.type === 'package'),
      flights: items.filter((i) => i.type === 'flight'),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
