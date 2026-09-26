import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Phone, MessageSquare, MapPin, Package, Check, ShieldCheck, LogOut } from 'lucide-react'
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
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight font-display">
            My Account & Saved Address
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
            Manage your personal delivery details for instant checkout.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-gray-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Package className="w-4 h-4 text-purple-600" /> View My Orders
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-black/10 text-gray-600 hover:text-rose-600 text-xs font-semibold shadow-sm transition-all"
            title="Sign out of your account"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] p-0.5 flex items-center justify-center shadow-sm">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl font-bold text-gray-900 overflow-hidden">
              {mockUser.imageUrl ? (
                <img src={mockUser.imageUrl} alt={mockUser.fullName || 'User'} className="w-full h-full object-cover" />
              ) : (
                mockUser.fullName?.charAt(0) || 'U'
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#111111]">{mockUser.fullName}</h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5 truncate">{mockUser.primaryEmailAddress?.emailAddress || 'Registered Buyer'}</p>
            <span className="inline-block mt-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/80 uppercase">
              {mockUser.role} Account
            </span>
          </div>

          <div className="pt-3 border-t border-gray-100 text-xs text-[#6B6B6B] space-y-2">
            <p className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{mockUser.authSource === 'demo' ? 'Local Demo Session' : 'Authenticated via Clerk'}</span>
            </p>
            <p className="text-[11px] text-gray-400 font-mono truncate">ID: {mockUser.id || 'N/A'}</p>

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Address & WhatsApp Form */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
              Saved Checkout Details (Auto-fill)
            </h3>

            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-[#E3EFE1] border border-emerald-300/80 text-emerald-950 text-xs flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Profile details successfully saved! Future checkouts will be pre-filled.</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 transition-all"
                />
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                WhatsApp Number (for UPI QR delivery)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="10-digit WhatsApp number"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 transition-all"
                />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Default Delivery Address
              </label>
              <div className="relative">
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, locality, city, state and PIN code"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-500/10 transition-all"
                />
                <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}
