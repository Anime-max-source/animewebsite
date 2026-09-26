import React, { useState } from 'react'
import { 
  Settings, 
  ShieldCheck, 
  QrCode, 
  MessageSquare, 
  Bell, 
  Save, 
  Check, 
  Store, 
  CreditCard,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { OWNER_UPI_ID, OWNER_WHATSAPP } from '../../lib/clerkClient'
import { useApp } from '../../context/AppContext'

export default function AdminSettings() {
  const { mockUser } = useApp()

  const [upiId, setUpiId] = useState(OWNER_UPI_ID)
  const [whatsappNum, setWhatsappNum] = useState(OWNER_WHATSAPP)
  const [storeName, setStoreName] = useState('AnimeMax')
  const [currency, setCurrency] = useState('INR (₹)')
  const [lowStockThreshold, setLowStockThreshold] = useState(5)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans antialiased text-[#111827]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Settings
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Configure store preferences, WhatsApp UPI gateway, and fulfillment notifications.
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Store Profile */}
        <div className="bg-white rounded-xl border border-[#EDEDED] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#EDEDED]">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827]">Store Information</h2>
              <p className="text-[11px] text-[#6B7280]">Public store identity and currency</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-[#F5F6F8] border border-[#EDEDED] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Base Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full bg-gray-100 border border-[#EDEDED] rounded-xl px-3.5 py-2 text-xs text-[#6B7280] cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp UPI Fulfillment Gateway */}
        <div className="bg-white rounded-xl border border-[#EDEDED] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#EDEDED]">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827]">WhatsApp & UPI Fulfillment Settings</h2>
              <p className="text-[11px] text-[#6B7280]">Merchant UPI identifier and customer support line</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Merchant UPI ID (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="owner@okaxis"
                className="w-full bg-[#F5F6F8] border border-[#EDEDED] rounded-xl px-3.5 py-2 text-xs font-mono text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              />
              <p className="text-[10px] text-[#6B7280]">Generated QR codes link directly to this UPI address</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Owner WhatsApp Contact</label>
              <input
                type="text"
                value={whatsappNum}
                onChange={(e) => setWhatsappNum(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full bg-[#F5F6F8] border border-[#EDEDED] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              />
              <p className="text-[10px] text-[#6B7280]">Target phone for WhatsApp QR link generation</p>
            </div>
          </div>
        </div>

        {/* Section 3: Inventory Alerts */}
        <div className="bg-white rounded-xl border border-[#EDEDED] p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#EDEDED]">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#111827]">Inventory & Stock Alerts</h2>
              <p className="text-[11px] text-[#6B7280]">Thresholds for low-stock badges in catalog</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#374151]">Low-Stock Warning Level</label>
              <input
                type="number"
                min="1"
                max="20"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="w-full bg-[#F5F6F8] border border-[#EDEDED] rounded-xl px-3.5 py-2 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              />
              <p className="text-[10px] text-[#6B7280]">Products with stock ≤ this number show "Only X Left" badge</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold shadow-2xs hover:shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}
