import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CurrencyProvider } from './context/CurrencyContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AuthProvider>
          <CurrencyProvider>
            <WishlistProvider>
              <BookingProvider>
                <App />
              </BookingProvider>
            </WishlistProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
