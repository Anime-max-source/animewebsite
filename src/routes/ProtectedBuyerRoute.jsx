import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isClerkConfigured } from '../lib/clerkClient'
import { useUser } from '@clerk/clerk-react'

function ClerkProtectedBuyer({ children }) {
  const { isSignedIn, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="p-8 text-center text-xs text-slate-400">Verifying session...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default function ProtectedBuyerRoute({ children }) {
  const { mockUser } = useApp()

  // If mockUser is already signed in as buyer or owner, allow immediate access
  if (mockUser && mockUser.id && mockUser.role !== 'guest') {
    return children
  }

  // If live Clerk is enabled, delegate to ClerkProtectedBuyer component
  if (isClerkConfigured) {
    return <ClerkProtectedBuyer>{children}</ClerkProtectedBuyer>
  }

  return <Navigate to="/signin" replace />
}
