import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isClerkConfigured, isOwnerUser } from '../lib/clerkClient'
import { useUser } from '@clerk/clerk-react'

function ClerkProtectedAdmin({ children }) {
  const { user, isLoaded, isSignedIn } = useUser()

  if (!isLoaded) {
    return <div className="p-8 text-center text-xs text-slate-400">Verifying owner credentials...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="/admin/login" replace />
  }

  const { setMockUser } = useApp()
  const isAuthorizedOwner = isOwnerUser(user)
  
  React.useEffect(() => {
    if (isAuthorizedOwner && user) {
      setMockUser({
        id: user.id,
        fullName: user.fullName || 'Owner Admin',
        primaryEmailAddress: user.primaryEmailAddress,
        role: 'owner',
        authSource: 'clerk'
      })
    }
  }, [isAuthorizedOwner, user])

  // SECURITY: Non-owner Clerk users are silently redirected to storefront.
  // No "Authorize as Owner" bypass button. No UI that confirms the route exists.
  if (!isAuthorizedOwner) {
    return <Navigate to="/" replace />
  }

  return children
}

export default function ProtectedAdminRoute({ children }) {
  const { mockUser } = useApp()

  // If explicitly set to owner (via admin login page demo mode), allow access
  if (mockUser && mockUser.role === 'owner') {
    return children
  }

  // If live Clerk is enabled, delegate to ClerkProtectedAdmin component
  if (isClerkConfigured) {
    return <ClerkProtectedAdmin>{children}</ClerkProtectedAdmin>
  }

  return <Navigate to="/admin/login" replace />
}
