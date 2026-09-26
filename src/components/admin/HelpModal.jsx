import React from 'react'
import { X, HelpCircle, MessageSquare, QrCode, ShoppingBag, ShieldCheck, ExternalLink, ArrowRight } from 'lucide-react'
import { OWNER_UPI_ID, OWNER_WHATSAPP } from '../../lib/clerkClient'

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#EDEDED] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDEDED]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#3B82F6] flex items-center justify-center">
              <HelpCircle className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#111827]">AnimeMax Help & Support</h3>
              <p className="text-xs text-[#6B7280]">Store operations, shortcuts, & fulfillment guide</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: WhatsApp UPI Fulfillment Workflow */}
          <div className="p-4 rounded-xl bg-[#F5F6F8] border border-[#EDEDED] space-y-2">
            <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>WhatsApp UPI Fulfillment Process</span>
            </h4>
            <ol className="text-xs text-[#4B5563] space-y-1.5 list-decimal list-inside pl-1 leading-relaxed">
              <li>When a customer places an order, it appears under <strong>Orders</strong> with status <em>Pending QR</em>.</li>
              <li>Click <strong>"Send UPI QR"</strong> to open direct WhatsApp chat with the customer prefilled with order details.</li>
              <li>Once payment screenshot/UTR is received, click <strong>"Verify Payment"</strong>.</li>
              <li>Dispatch the parcel and set status to <strong>"Shipped"</strong>.</li>
            </ol>
          </div>

          {/* Section 2: Store Owner UPI Settings */}
          <div className="p-4 rounded-xl border border-[#EDEDED] space-y-2">
            <h4 className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active UPI Merchant ID</span>
            </h4>
            <div className="text-xs text-[#4B5563] space-y-1">
              <p className="font-mono font-medium text-[#111827] bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200 inline-block">
                {OWNER_UPI_ID}
              </p>
              <p className="text-[11px] text-[#6B7280]">
                Customer payments sent to this UPI ID. You can update this in Admin Settings.
              </p>
            </div>
          </div>

          {/* Section 3: Keyboard Shortcuts */}
          <div className="p-4 rounded-xl border border-[#EDEDED] space-y-2">
            <h4 className="text-xs font-bold text-[#111827]">Keyboard Shortcuts</h4>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              <div className="flex items-center justify-between">
                <span>Quick Global Search</span>
                <kbd className="px-2 py-0.5 text-[11px] font-mono bg-gray-100 border border-gray-200 rounded text-[#111827]">⌘K / Ctrl+K</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Close Active Modal</span>
                <kbd className="px-2 py-0.5 text-[11px] font-mono bg-gray-100 border border-gray-200 rounded text-[#111827]">ESC</kbd>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-[#F5F6F8] border-t border-[#EDEDED] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#111827] text-white text-xs font-medium hover:bg-black transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
