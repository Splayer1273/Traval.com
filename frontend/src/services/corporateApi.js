import { api } from '../lib/api.js'

/**
 * Corporate travel service — wired to the real Express/Mongoose API.
 * The in-progress booking draft stays in localStorage (client state); every
 * request, approval, policy and notification now lives on the backend.
 */

/* ---------------------------------- Requests ---------------------------------- */

const unwrap = (res) => res.data?.data ?? res.data

export const corporateApi = {
  /* ----- Travel requests (backend scopes by role: employee → own, manager → company) ----- */
  async getRequests({ status } = {}) {
    const res = await api.get('/trips', { params: status ? { status } : {} })
    return unwrap(res)
  },

  async getRequest(id) {
    const res = await api.get(`/trips/${id}`)
    return unwrap(res)
  },

  async createRequest(payload) {
    const res = await api.post('/trips', payload)
    return unwrap(res)
  },

  /* ----- Approvals ----- */
  async approveRequest(id, { comment = '' } = {}) {
    const res = await api.patch(`/approvals/${id}/approve`, { comment })
    return unwrap(res)
  },

  async rejectRequest(id, { comment = '' } = {}) {
    const res = await api.patch(`/approvals/${id}/reject`, { comment })
    return unwrap(res)
  },

  async ticketRequest(id) {
    const res = await api.patch(`/trips/${id}/ticket`)
    return unwrap(res)
  },

  async cancelRequest(id, reason = '') {
    const res = await api.delete(`/trips/${id}`, { data: { reason } })
    return unwrap(res)
  },

  /* ----- Policies (admin-editable, stored on the backend) ----- */
  async getPolicies() {
    const res = await api.get('/policies')
    return unwrap(res)
  },

  async savePolicies(list) {
    const res = await api.put('/policies', { policies: list })
    return unwrap(res)
  },

  /* ----- Expense claims (employee files; finance/admin reviews) ----- */
  async getClaims({ status } = {}) {
    const res = await api.get('/expenses', { params: status ? { status } : {} })
    return unwrap(res).map(mapClaim)
  },

  async createClaim(payload) {
    const res = await api.post('/expenses', payload)
    return mapClaim(unwrap(res))
  },

  async reviewClaim(id, { status, note = '' } = {}) {
    const res = await api.patch(`/expenses/${id}/status`, { status, note })
    return mapClaim(unwrap(res))
  },

  async withdrawClaim(id) {
    const res = await api.delete(`/expenses/${id}`)
    return res.data
  },

  /* ----- Admin reports (spend aggregation + CSV export) ----- */
  async getSpendReport() {
    const res = await api.get('/reports/spend')
    return unwrap(res)
  },

  /** CSV text (UTF-8 with BOM) for the given scope: 'trips' | 'expenses'. */
  async exportCsv(type) {
    const res = await api.get('/reports/export', { params: { type } })
    return res.data
  },

  /* ----- Notifications (scoped to the signed-in user server-side) ----- */
  async getNotifications() {
    const res = await api.get('/notifications')
    return unwrap(res).map(mapNotif)
  },

  async unreadCount() {
    const res = await api.get('/notifications/unread-count')
    return res.data?.count ?? 0
  },

  async markRead(id) {
    const res = await api.patch(`/notifications/${id}/read`)
    return unwrap(res)
  },

  async markAllRead() {
    const res = await api.patch('/notifications/read-all')
    return res.data
  },

  /* ----- In-progress travel draft (client-only) ----- */
  getDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  },

  saveDraft(draft) {
    if (draft) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    else localStorage.removeItem(DRAFT_KEY)
    return draft
  },

  clearDraft() {
    localStorage.removeItem(DRAFT_KEY)
  },
}

const DRAFT_KEY = 'sunrise_travel_draft'

function mapClaim(c) {
  return {
    id: c.id,
    tripId: c.trip?.id || null,
    tripRef: c.tripRef || c.trip?.ref || '',
    tripTitle: c.tripTitle || c.trip?.title || '',
    destination: c.tripDestination || c.trip?.destination || '',
    category: c.category,
    amount: c.amount,
    currency: c.currency || 'INR',
    spentOn: c.spentOn,
    merchant: c.merchant || '',
    receipts: c.receipts || 0,
    description: c.description || '',
    status: c.status,
    reviewNote: c.reviewNote || '',
    reviewedBy: c.reviewedBy?.name || '',
    reviewedAt: c.reviewedAt,
    reimbursedAt: c.reimbursedAt,
    createdAt: c.createdAt,
    time: timeAgo(c.createdAt),
    employee: c.employee
      ? {
          id: c.employee.id,
          name: c.employee.name,
          designation: c.employee.designation,
          department: c.employee.department,
          employeeId: c.employee.employeeId,
          grade: c.employee.grade,
        }
      : null,
  }
}

function mapNotif(n) {
  return {
    id: n.id,
    type: n.type || 'pending',
    title: n.title,
    text: n.text,
    link: n.link,
    read: n.read,
    createdAt: n.createdAt,
    time: timeAgo(n.createdAt),
  }
}

function timeAgo(isoStr) {
  if (!isoStr) return ''
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`
  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

/* ---------------------------------- Stats ---------------------------------- */

/** Aggregate KPI stats used by the admin dashboard and employee widgets. */
export function computeStats(requests = []) {
  const spendable = requests.filter((r) => ['approved', 'ticketed', 'completed'].includes(r.status))
  const totalSpend = spendable.reduce((sum, r) => sum + (r.estimatedCost || 0), 0)
  const pending = requests.filter((r) => r.status === 'pending').length
  const violations = requests.filter((r) => r.policy?.violation).length
  const avgBookingCost = spendable.length ? Math.round(totalSpend / spendable.length) : 0

  const cityCount = {}
  requests.forEach((r) => {
    if (r.destination) cityCount[r.destination] = (cityCount[r.destination] || 0) + 1
  })
  const topCities = Object.entries(cityCount)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)

  const byStatus = {}
  requests.forEach((r) => { byStatus[r.status] = (byStatus[r.status] || 0) + 1 })

  const byMonth = []
  const monthKey = (isoStr) => (isoStr || '').slice(0, 7)
  const monthLabel = (key) => {
    const [y, m] = key.split('-')
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${names[Number(m) - 1]} ${y}`
  }
  const monthMap = {}
  requests.forEach((r) => {
    const key = monthKey(r.createdAt)
    if (!key || key.length !== 7) return
    monthMap[key] = (monthMap[key] || 0) + (r.estimatedCost || 0)
  })
  Object.entries(monthMap)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .slice(-6)
    .forEach(([key, value]) => byMonth.push({ label: monthLabel(key), value }))

  return { totalSpend, totalTrips: requests.length, pending, violations, avgBookingCost, topCities, byStatus, byMonth }
}
