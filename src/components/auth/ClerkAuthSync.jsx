import React, { useEffect } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useApp } from '../../context/AppContext'
import { isOwnerUser } from '../../lib/clerkClient'

/**
 * ClerkAuthSync bridges Clerk's reactive authentication state
 * with AnimeMax's AppContext (mockUser, role, and profile details).
 * This ensures that as soon as a user signs in via Clerk, the entire
 * application immediately recognizes them as signed in.
 */
export default function ClerkAuthSync() {
  const { user, isLoaded, isSignedIn } = useUser()
  const clerk = useClerk()
  const { setMockUser, registerLogoutHandler } = useApp()

  useEffect(() => {
    if (clerk && registerLogoutHandler) {
      registerLogoutHandler(() => clerk.signOut())
    }
  }, [clerk, registerLogoutHandler])

  useEffect(() => {
    if (!isLoaded) return

    if (isSignedIn && user) {
      const isOwner = isOwnerUser(user)
      const role = isOwner ? 'owner' : 'buyer'
      const clerkEmail = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || ''
      const clerkName = user.fullName || user.firstName || (clerkEmail ? clerkEmail.split('@')[0] : 'Valued Buyer')
      const clerkAvatar = user.imageUrl || ''

      setMockUser(prev => {
        if (
          prev?.id === user.id &&
          prev?.role === role &&
          prev?.fullName === clerkName &&
          prev?.primaryEmailAddress?.emailAddress === clerkEmail &&
          prev?.imageUrl === clerkAvatar
        ) {
          return prev
        }
        return {
          id: user.id,
          fullName: clerkName,
          primaryEmailAddress: { emailAddress: clerkEmail },
          imageUrl: clerkAvatar,
          role: role,
          authSource: 'clerk'
        }
      })
    } else if (!isSignedIn) {
      setMockUser(prev => {
        if (prev?.authSource === 'clerk' || (prev?.id && prev?.id.startsWith('user_2'))) {
          return {
            id: null,
            fullName: 'Guest Visitor',
            role: 'guest',
            authSource: null
          }
        }
        return prev
      })
    }
  }, [isLoaded, isSignedIn, user, setMockUser])

  return null
}
