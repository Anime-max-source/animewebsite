import React from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isClerkConfigured, isOwnerUser } from '../lib/clerkClient'
import { useUser } from '@clerk/clerk-react'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

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
  
  if (!isAuthorizedOwner) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 rounded-2xl bg-white border border-slate-200 shadow-xl text-center space-y-4 font-sans">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#111111]">Owner Role Required</h2>
        
        <div className="p-3 bg-[#F5F5F3] rounded-xl text-xs text-left space-y-1 text-slate-700">
          <p><strong>Signed in as:</strong> {user?.primaryEmailAddress?.emailAddress}</p>
          <p><strong>Clerk User ID:</strong> <code className="font-mono text-black font-semibold select-all">{user?.id}</code></p>
        </div>

        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Your Clerk account does not currently hold the <code className="text-black font-semibold font-mono">publicMetadata.role = 'owner'</code> claim.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              setMockUser({
                id: user.id,
                fullName: user.fullName || 'Owner Admin',
                primaryEmailAddress: user.primaryEmailAddress,
                role: 'owner'
              })
            }}
            className="px-5 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
          >
            Authorize as Owner for this Session
          </button>

          <Link
            to="/"
            className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-[#111111] text-xs font-semibold transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    )
  }

  return children
}

export default function ProtectedAdminRoute({ children }) {
  const { mockUser } = useApp()

  // If explicitly set to owner (via navbar demo switcher or admin login), allow access
  if (mockUser && mockUser.role === 'owner') {
    return children
  }

  // If live Clerk is enabled, delegate to ClerkProtectedAdmin component
  if (isClerkConfigured) {
    return <ClerkProtectedAdmin>{children}</ClerkProtectedAdmin>
  }

  return <Navigate to="/admin/login" replace />
}
