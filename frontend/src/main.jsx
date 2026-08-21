import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { TravelProvider } from './context/TravelContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Never retry a 401 — a rejected token cannot succeed without a new
      // login, and retrying just repeats the failed request.
      retry: (failureCount, error) => error?.status !== 401 && failureCount < 1,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ToastProvider>
          <AuthProvider>
            <CurrencyProvider>
              <WishlistProvider>
                <BookingProvider>
                  <TravelProvider>
                    <NotificationProvider>
                      <App />
                    </NotificationProvider>
                  </TravelProvider>
                </BookingProvider>
              </WishlistProvider>
            </CurrencyProvider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
