import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { isClerkConfigured } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { ShieldCheck, Lock } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setMockUser } = useApp()

  const handleDemoOwnerLogin = () => {
    setMockUser({
      id: 'user_owner_animemax',
      fullName: 'Sai Sharaan (Owner)',
      primaryEmailAddress: { emailAddress: 'owner@animemax.store' },
      role: 'owner'
    })
    navigate('/admin')
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6 font-sans antialiased text-[#111827]">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-[#3B82F6] shadow-2xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">Owner Portal Access</h1>
        <p className="text-xs text-[#6B7280]">
          Sign in with authorized administrator credentials to manage AnimeMax store operations.
        </p>
      </div>

      {isClerkConfigured ? (
        <div className="space-y-4">
          <div className="flex justify-center bg-white p-4 rounded-xl border border-[#EDEDED] shadow-2xs">
            <ClerkSignIn routing="path" path="/admin/login" fallbackRedirectUrl="/admin" />
          </div>
          <div className="text-center">
            <button
              onClick={handleDemoOwnerLogin}
              className="text-xs text-[#6B7280] hover:text-[#111827] underline transition-colors"
            >
              Continue with Local Owner Session
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-[#EDEDED] shadow-2xs text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Fast Track Demo Access</h2>
            <p className="text-xs text-[#6B7280]">
              Enter the admin panel immediately using the configured store owner profile.
            </p>
          </div>

          <button
            onClick={handleDemoOwnerLogin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold shadow-2xs transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Continue with Local Owner Session</span>
          </button>
        </div>
      )}
    </div>
  )
}
