import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Phone,
  ChatCircle,
  MapPin,
  Package,
  Check,
  ShieldCheck,
  SignOut
} from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'

export default function Account() {
  const { mockUser, getBuyerProfile, saveBuyerProfile, logout } = useApp()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  const [formData, setFormData] = useState({
    phone: '',
    whatsapp: '',
    address: '',
  })

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (mockUser && mockUser.id) {
      const profile = getBuyerProfile(mockUser.id)
      if (profile) {
        setFormData({
          phone: profile.phone || '',
          whatsapp: profile.whatsapp || '',
          address: profile.address || '',
        })
      }
    }
  }, [mockUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSavedSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!mockUser || !mockUser.id) return

    setIsSaving(true)
    await saveBuyerProfile(mockUser.id, formData)
    setIsSaving(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16" style={{ fontFamily: 'Inter, sans-serif' }}>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            My Account &amp; Saved Address
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">
            Manage your personal delivery details for instant checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="sf-btn-secondary text-sm h-9 px-4 gap-2"
            style={{ height: '36px', minHeight: 'unset', fontSize: '13px' }}
          >
            <Package size={16} /> View My Orders
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="sf-btn-secondary text-sm h-9 px-4 gap-2"
            style={{ height: '36px', minHeight: 'unset', fontSize: '13px' }}
            title="Sign out of your account"
          >
            <SignOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* ── Profile Card ─────────────────────────────────────────── */}
        <div className="p-6 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] space-y-4">
          <div className="w-16 h-16 rounded-[12px] bg-[#111111] border border-[#E5E5E5] flex items-center justify-center text-xl font-bold text-white overflow-hidden">
            {mockUser.imageUrl ? (
              <img src={mockUser.imageUrl} alt={mockUser.fullName || 'User'} className="w-full h-full object-cover" />
            ) : (
              mockUser.fullName?.charAt(0) || 'U'
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-[#111111] font-['Syne']">{mockUser.fullName}</h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{mockUser.primaryEmailAddress?.emailAddress || 'Registered Buyer'}</p>
            <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded-[12px] text-[10px] font-bold bg-white border border-[#E5E5E5] text-[#6B6B6B] uppercase">
              {mockUser.role} Account
            </span>
          </div>

          <div className="pt-3 border-t border-[#E5E5E5] text-sm text-[#6B6B6B] space-y-2">
            <p className="flex items-center gap-1.5 text-[#111111] font-medium">
              <ShieldCheck size={16} />
              <span>{mockUser.authSource === 'demo' ? 'Local Demo Session' : 'Authenticated via Clerk'}</span>
            </p>
            <p className="text-xs text-[#6B6B6B] font-mono truncate">ID: {mockUser.id || 'N/A'}</p>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full mt-2 sf-btn-secondary text-sm justify-center gap-2"
              style={{ height: '36px', minHeight: 'unset', fontSize: '13px' }}
            >
              <SignOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ── Address & WhatsApp Form ───────────────────────────────── */}
        <div className="md:col-span-2 p-6 rounded-[12px] bg-white border border-[#E5E5E5]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-widest">
              Saved Checkout Details (Auto-fill)
            </h3>

            {savedSuccess && (
              <div className="p-3.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-[#111111] text-sm flex items-center gap-2 font-medium">
                <Check size={16} className="text-[#111111] flex-shrink-0" />
                <span>Profile details saved! Future checkouts will be pre-filled.</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1.5">Mobile Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="sf-input pl-10"
                />
                <Phone size={16} className="text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1.5">
                WhatsApp Number (for UPI QR delivery)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="10-digit WhatsApp number"
                  className="sf-input pl-10"
                />
                <ChatCircle size={16} className="text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-1.5">Default Delivery Address</label>
              <div className="relative">
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, locality, city, state and PIN code"
                  className="sf-textarea pl-10"
                />
                <MapPin size={16} className="text-[#6B6B6B] absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="sf-btn-primary gap-2 disabled:opacity-50"
              >
                <ShieldCheck size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
