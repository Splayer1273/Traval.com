import axios from 'axios'

/**
 * Shared Axios instance for the Project Sunrise API.
 *
 * The app currently runs entirely on local mock data through the `services/*`
 * modules, but those modules are structured to swap their mock implementations
 * for these HTTP calls later — no component talks to `api` directly.
 */
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL,
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
    const message = err?.response?.data?.message || err.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  },
)

/** Simulate network latency for mock services so loading states feel real. */
export function delay(ms = 550) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
