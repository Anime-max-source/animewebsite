import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { isClerkConfigured } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { Flame, ShieldCheck, ArrowRight, User } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const { mockUser, setMockUser } = useApp()

  // If already signed in, immediately redirect to account (or admin if owner)
  useEffect(() => {
    if (mockUser && mockUser.role !== 'guest') {
      navigate('/account', { replace: true })
    }
  }, [mockUser, navigate])

  const handleDemoSignIn = (role) => {
    if (role === 'buyer') {
      setMockUser({
        id: 'user_' + Date.now().toString().slice(-6),
        fullName: 'Registered Buyer',
        primaryEmailAddress: { emailAddress: 'buyer@animemax.store' },
        role: 'buyer',
        authSource: 'demo'
      })
      navigate('/account')
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] p-0.5 flex items-center justify-center mx-auto shadow-md">
          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
            <Flame className="w-6 h-6 text-[#ff3366]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#111111] font-display">Welcome to AnimeMax</h1>
        <p className="text-xs text-[#6B6B6B]">Sign in to track your anime orders & save delivery addresses</p>
      </div>

      {/* If Clerk is live configured, render Clerk's native SignIn */}
      {isClerkConfigured ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <ClerkSignIn routing="path" path="/signin" signUpUrl="/signup" fallbackRedirectUrl="/account" />
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => handleDemoSignIn('buyer')}
              className="text-xs text-[#8A8A8A] hover:text-[#111111] underline transition-colors"
            >
              Continue with One-Click Demo Buyer
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm space-y-4">
          <button
            onClick={() => handleDemoSignIn('buyer')}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] hover:opacity-90 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-opacity"
          >
            <User className="w-4 h-4" />
            <span>Sign In as Buyer</span>
          </button>

          <div className="pt-2 text-center text-xs text-[#6B6B6B]">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-rose-600 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

