import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App'
import { CartProvider } from './context/CartContext'
import { AppProvider } from './context/AppContext'
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from './lib/clerkClient'
import ClerkAuthSync from './components/auth/ClerkAuthSync'
import './index.css'

function ClerkProviderWithRoutes({ children }) {
  const navigate = useNavigate()

  if (isClerkConfigured) {
    return (
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        navigate={(to) => navigate(to)}
      >
        {children}
      </ClerkProvider>
    )
  }

  return children
}

function Root() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes>
        <AppProvider>
          <CartProvider>
            {isClerkConfigured && <ClerkAuthSync />}
            <App />
          </CartProvider>
        </AppProvider>
      </ClerkProviderWithRoutes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

