import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { isClerkConfigured } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { ShieldCheck, Flame, Lock } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setMockUser } = useApp()

  const handleDemoOwnerLogin = () => {
    setMockUser({
      id: 'user_owner_animemax',
      fullName: 'Owner Admin',
      primaryEmailAddress: { emailAddress: 'owner@animemax.store' },
      role: 'owner'
    })
    navigate('/admin')
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-[#D6FF4A]/30 border border-[#D6FF4A]/50 flex items-center justify-center mx-auto text-black shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-[#111111] font-display">Owner Access Only</h1>
        <p className="text-xs text-[#8A8A8A]">
          Sign in with authorized owner credentials to access catalog and order fulfillment.
        </p>
      </div>

      {isClerkConfigured && (
        <div className="flex justify-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <ClerkSignIn routing="path" path="/admin/login" fallbackRedirectUrl="/admin" />
        </div>
      )}

      <div className="text-center pt-2">
        <button
          onClick={handleDemoOwnerLogin}
          className="inline-flex items-center gap-2 text-xs text-[#8A8A8A] hover:text-[#111111] underline transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Continue with Local Owner Session</span>
        </button>
      </div>
    </div>
  )
}
