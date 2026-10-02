import React, { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop — rgba(17, 24, 39, 0.4) dimming */}
      <div 
        className="fixed inset-0 bg-[rgba(17,24,39,0.4)] backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal dialog — White background, 1px solid #EDEDED border, rounded-2xl, Inter font */}
      <div className={`relative w-full ${maxWidth} bg-white border border-[#EDEDED] rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto transform transition-all text-[#111827] font-sans animate-in fade-in zoom-in-95 duration-150`}>
        <div className="flex items-center justify-between pb-4 border-b border-[#EDEDED] mb-5">
          <h3 className="text-lg font-bold text-[#111827] tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-[#111827] p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
