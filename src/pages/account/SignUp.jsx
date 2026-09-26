import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'
import { isClerkConfigured } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { Fire, UserPlus } from '@phosphor-icons/react'

export default function SignUp() {
  const navigate = useNavigate()
  const { mockUser, setMockUser } = useApp()

  useEffect(() => {
    if (mockUser && mockUser.role !== 'guest') {
      navigate('/account', { replace: true })
    }
  }, [mockUser, navigate])

  const handleDemoSignUp = () => {
    setMockUser({
      id: 'user_' + Date.now().toString().slice(-6),
      fullName: 'New Member',
      primaryEmailAddress: { emailAddress: 'newbuyer@animemax.store' },
      role: 'buyer',
      authSource: 'demo'
    })
    navigate('/account')
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center mx-auto">
          <Fire size={24} className="text-[#DC2626]" weight="fill" />
        </div>
        <h1 className="text-2xl font-bold text-[#111111]" style={{ fontFamily: 'Syne, sans-serif' }}>Create Buyer Account</h1>
        <p className="text-sm text-[#6B6B6B]">Join AnimeMax for faster checkout and order tracking</p>
      </div>

      {isClerkConfigured ? (
        <div className="space-y-4">
          <div className="flex justify-center">
            <ClerkSignUp routing="path" path="/signup" signInUrl="/signin" fallbackRedirectUrl="/account" />
          </div>

          <div className="text-center pt-2">
            <button
              onClick={handleDemoSignUp}
              className="text-xs text-[#8A8A8A] hover:text-[#111111] underline transition-colors"
            >
              Continue with One-Click Demo Member
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-[#E5E5E5] space-y-4">
          <button
            onClick={handleDemoSignUp}
            className="sf-btn-primary w-full gap-2"
          >
            <UserPlus size={20} />
            <span>Sign Up as Buyer</span>
          </button>

          <div className="text-center text-sm text-[#6B6B6B]">
            <span>Already have an account? </span>
            <Link to="/signin" className="text-[#DC2626] font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

