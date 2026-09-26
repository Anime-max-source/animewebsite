import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'
import { isClerkConfigured } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { Fire, ShieldCheck, User } from '@phosphor-icons/react'

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
    <div className="max-w-md mx-auto py-12 px-4 space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center mx-auto">
          <Fire size={24} className="text-[#DC2626]" weight="fill" />
        </div>
        <h1 className="text-2xl font-bold text-[#111111]" style={{ fontFamily: 'Syne, sans-serif' }}>Welcome to AnimeMax</h1>
        <p className="text-sm text-[#6B6B6B]">Sign in to track your anime orders &amp; save delivery addresses</p>
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
              className="text-sm text-[#6B6B6B] hover:text-[#111111] underline transition-colors"
            >
              Continue with One-Click Demo Buyer
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#E5E5E5] space-y-4">
          <button
            onClick={() => handleDemoSignIn('buyer')}
            className="sf-btn-primary w-full gap-2"
          >
            <User size={20} />
            <span>Sign In as Buyer</span>
          </button>

          <div className="text-center text-sm text-[#6B6B6B]">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-[#DC2626] font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
