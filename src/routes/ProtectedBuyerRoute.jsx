import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isClerkConfigured } from '../lib/clerkClient'
import { useUser } from '@clerk/clerk-react'

function ClerkProtectedBuyer({ children }) {
  const { isSignedIn, isLoaded, user } = useUser()
  const { mockUser, setMockUser } = useApp()

  React.useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      if (!mockUser || mockUser.id !== user.id) {
        const clerkEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ''
        const clerkName = user.fullName || user.firstName || (clerkEmail ? clerkEmail.split('@')[0] : 'Valued Buyer')
        setMockUser({
          id: user.id,
          fullName: clerkName,
          primaryEmailAddress: { emailAddress: clerkEmail },
          imageUrl: user.imageUrl || '',
          role: 'buyer',
          authSource: 'clerk'
        })
      }
    }
  }, [isLoaded, isSignedIn, user, mockUser?.id])

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
        <div className="w-7 h-7 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#6B6B6B] font-medium">Verifying your session...</p>
      </div>
    )
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
