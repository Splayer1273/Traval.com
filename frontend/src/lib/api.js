import axios from 'axios'

/**
 * Shared Axios instance for the Akbar Bizvoy API.
 *
 * The app currently runs entirely on local mock data through the `services/*`
 * modules, but those modules are structured to swap their mock implementations
 * for these HTTP calls later — no component talks to `api` directly.
 */
const API_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sunrise_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // A 401 on a request that carried a token means the session is stale or
    // expired — clear it so the app stops hammering protected endpoints and
    // let AuthContext drop the in-memory user (→ redirect to /login).
    if (err?.response?.status === 401 && err?.config?.headers?.Authorization) {
      localStorage.removeItem('sunrise_token')
      localStorage.removeItem('sunrise_user')
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    const message = err?.response?.data?.message || err.message || 'Something went wrong'
    const error = new Error(message)
    error.status = err?.response?.status
    return Promise.reject(error)
  },
)

/** Simulate network latency for mock services so loading states feel real. */
export function delay(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
