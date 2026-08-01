import { CURRENCIES } from '../data/currencies.js'

/** Format a number as INR-style grouped currency in the given currency code. */
export function formatMoney(amount, currency = 'INR') {
  const symbol = CURRENCIES[currency]?.symbol ?? '₹'
  const locale = currency === 'INR' ? 'en-IN' : 'en-US'
  try {
    return `${symbol}${Math.round(amount).toLocaleString(locale)}`
  } catch {
    return `${symbol}${Math.round(amount)}`
  }
}

/** Convert an amount from INR (mock data base currency) to the display currency. */
export function convert(amountInr, currency = 'INR') {
  const rate = CURRENCIES[currency]?.rate ?? 1
  return amountInr * rate
}

/** Format money in display currency. */
export function price(amountInr, currency = 'INR') {
  return formatMoney(convert(amountInr, currency), currency)
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatDateShort(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function formatTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${m} ${ampm}`
}

export function formatDay(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return WEEKDAYS[d.getDay()]
}

export function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a)
  return Math.max(0, Math.round(ms / 86400000))
}

export function todayISO(offset = 0) {
  const d = addDays(new Date(), offset)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function minutesToLabel(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function pnr() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export function bookingRef() {
  return `SR-${Date.now().toString(36).toUpperCase().slice(-6)}`
}

export function fullName(p) {
  return `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim()
}

export const plural = (n, word, pluralWord) => (n === 1 ? word : pluralWord ?? `${word}s`)
