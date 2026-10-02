import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'
import { isClerkConfigured, isProductionKeyOnLocalhost } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'
import { Fire, UserPlus, Info } from '@phosphor-icons/react'

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
          {isProductionKeyOnLocalhost && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-800">
                <Info size={18} className="text-amber-600 shrink-0" weight="fill" />
                <span>Clerk Production Key Active on Localhost</span>
              </div>
              <p className="text-amber-700 leading-relaxed">
                Clerk restricts production keys (<code className="bg-amber-100 px-1 py-0.5 rounded text-[11px] font-mono">pk_live_...</code>) to your production domain (<strong>animemax.shop</strong>). Because requests originate from <strong>localhost</strong>, Clerk blocks the embedded signup form.
              </p>
              <div className="pt-1 flex flex-col gap-1.5 text-[11px] text-amber-800">
                <div>• <strong>To test locally:</strong> Use your Development key (<code className="bg-amber-100 px-1 py-0.5 rounded font-mono">pk_test_...</code>) in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code>, or click the button below.</div>
                <div>• <strong>In production:</strong> Live Clerk auth renders automatically on <strong>https://animemax.shop</strong>.</div>
              </div>
            </div>
          )}

          {!isProductionKeyOnLocalhost && (
            <div className="flex justify-center">
              <ClerkSignUp routing="path" path="/signup" signInUrl="/signin" fallbackRedirectUrl="/account" />
            </div>
          )}

          <div className="text-center pt-2">
            <button
              onClick={handleDemoSignUp}
              className={isProductionKeyOnLocalhost 
                ? "sf-btn-primary w-full py-2.5 text-xs font-semibold justify-center"
                : "text-xs text-[#8A8A8A] hover:text-[#111111] underline transition-colors"
              }
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

