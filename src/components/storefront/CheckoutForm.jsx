import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChatCircle,
  ShieldCheck,
  MapPin,
  User,
  Phone,
  CheckCircle,
  Warning
} from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../context/AppContext'
import { validateCheckoutForm } from '../../utils/validators'
import confetti from 'canvas-confetti'

export default function CheckoutForm() {
  const { items, cartTotal, clearCart } = useCart()
  const { mockUser, getBuyerProfile, createOrder } = useApp()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    buyer_name: '',
    buyer_phone: '',
    buyer_whatsapp: '',
    buyer_address: '',
  })

  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Pre-fill if signed in and profile exists
  useEffect(() => {
    if (mockUser && mockUser.id) {
      const profile = getBuyerProfile(mockUser.id)
      setFormData((prev) => ({
        ...prev,
        buyer_name: prev.buyer_name || mockUser.fullName || '',
        buyer_phone: prev.buyer_phone || profile?.phone || '',
        buyer_whatsapp: prev.buyer_whatsapp || profile?.whatsapp || profile?.phone || '',
        buyer_address: prev.buyer_address || profile?.address || '',
      }))
    }
  }, [mockUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'buyer_phone' && sameAsPhone) {
        next.buyer_whatsapp = value
      }
      return next
    })
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (submitError) {
      setSubmitError(null)
    }
  }

  const handleSameAsPhoneToggle = (e) => {
    const checked = e.target.checked
    setSameAsPhone(checked)
    if (checked) {
      setFormData((prev) => ({ ...prev, buyer_whatsapp: prev.buyer_phone }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const { valid, errors: validationErrors } = validateCheckoutForm(formData)
    if (!valid) {
      setErrors(validationErrors)
      return
    }

    if (items.length === 0) {
      setSubmitError('Your cart is empty! Please add products before checking out.')
      return
    }

    setIsSubmitting(true)

    try {
      const orderPayload = {
        user_id: mockUser.id || null,
        buyer_name: formData.buyer_name.trim(),
        buyer_phone: formData.buyer_phone.trim(),
        buyer_whatsapp: formData.buyer_whatsapp.trim(),
        buyer_address: formData.buyer_address.trim(),
        items: items.map((i) => ({
          product_id: i.id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          image_url: i.image_url,
        })),
        total_amount: cartTotal,
      }

      const created = await createOrder(orderPayload)

      // Subtle confetti (brand colors: crimson only)
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
        colors: ['#DC2626', '#B91C1C', '#111111']
      })

      clearCart()
      navigate(`/order-confirmation/${created.id}`)
    } catch (err) {
      console.error('Failed to submit order', err)
      setSubmitError(err?.message || 'Something went wrong submitting your order. Please check your network and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Error Banner */}
      {submitError && (
        <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-[#111111] text-sm flex items-start gap-3">
          <Warning size={20} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-[#111111]">Unable to complete order</h4>
            <p className="text-[#6B6B6B] text-sm">{submitError}</p>
          </div>
        </div>
      )}

      {/* Auth status */}
      {mockUser.role === 'guest' ? (
        <div className="p-3.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-sm text-[#6B6B6B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#6B6B6B]" />
            <span>Checking out as <strong className="text-[#111111]">Guest</strong> (Account optional).</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-[#DC2626] hover:underline font-semibold text-sm transition-colors"
          >
            Sign In
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-sm text-[#111111] flex items-center gap-2">
          <CheckCircle size={16} className="text-[#111111] flex-shrink-0" />
          <span>Signed in as <strong>{mockUser.fullName}</strong>. Details will auto-save to your account.</span>
        </div>
      )}

      {/* WhatsApp payment advisory */}
      <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[12px] bg-white border border-[#E5E5E5] flex items-center justify-center flex-shrink-0">
            <ChatCircle size={20} className="text-[#111111]" />
          </div>
          <div>
            <h4 className="font-bold text-[#111111] text-sm mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              Manual UPI Payment on WhatsApp
            </h4>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              After placing this order, you do NOT pay on this screen. The AnimeMax owner will review your order and send a custom <strong className="text-[#111111]">UPI QR code</strong> directly to your WhatsApp within 5–15 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-1.5">
          Full Name <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="sf-input pl-10"
            style={{ borderColor: errors.buyer_name ? '#DC2626' : undefined }}
          />
          <User size={16} className="text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.buyer_name && (
          <p className="text-[#DC2626] text-xs mt-1.5 flex items-center gap-1 font-medium">
            <Warning size={14} /> {errors.buyer_name}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-1.5">
          Mobile Phone Number <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            name="buyer_phone"
            value={formData.buyer_phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className="sf-input pl-10"
            style={{ borderColor: errors.buyer_phone ? '#DC2626' : undefined }}
          />
          <Phone size={16} className="text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.buyer_phone && (
          <p className="text-[#DC2626] text-xs mt-1.5 flex items-center gap-1 font-medium">
            <Warning size={14} /> {errors.buyer_phone}
          </p>
        )}
      </div>

      {/* WhatsApp Number */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-[#111111]">
            WhatsApp Number (for UPI QR) <span className="text-[#DC2626]">*</span>
          </label>
          <label className="flex items-center gap-1.5 text-sm text-[#6B6B6B] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={handleSameAsPhoneToggle}
              className="rounded-[4px] border-[#E5E5E5] text-[#DC2626] focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-medium">Same as mobile</span>
          </label>
        </div>

        <div className="relative">
          <input
            type="tel"
            name="buyer_whatsapp"
            value={formData.buyer_whatsapp}
            onChange={handleChange}
            disabled={sameAsPhone}
            placeholder="10-digit WhatsApp number"
            className="sf-input pl-10"
            style={{
              borderColor: errors.buyer_whatsapp ? '#DC2626' : undefined,
              opacity: sameAsPhone ? 0.6 : 1
            }}
          />
          <ChatCircle size={16} className="text-[#6B6B6B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.buyer_whatsapp && (
          <p className="text-[#DC2626] text-xs mt-1.5 flex items-center gap-1 font-medium">
            <Warning size={14} /> {errors.buyer_whatsapp}
          </p>
        )}
      </div>

      {/* Delivery Address */}
      <div>
        <label className="block text-sm font-semibold text-[#111111] mb-1.5">
          Delivery Address <span className="text-[#DC2626]">*</span>
        </label>
        <div className="relative">
          <textarea
            name="buyer_address"
            rows={3}
            value={formData.buyer_address}
            onChange={handleChange}
            placeholder="Flat/House No, Street, City, State, PIN code"
            className="sf-textarea pl-10"
            style={{ borderColor: errors.buyer_address ? '#DC2626' : undefined }}
          />
          <MapPin size={16} className="text-[#6B6B6B] absolute left-3.5 top-3.5 pointer-events-none" />
        </div>
        {errors.buyer_address && (
          <p className="text-[#DC2626] text-xs mt-1.5 flex items-center gap-1 font-medium">
            <Warning size={14} /> {errors.buyer_address}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="sf-btn-primary w-full gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span>Processing Order...</span>
        ) : (
          <>
            <ShieldCheck size={20} />
            <span>Place Order &amp; Request UPI QR</span>
          </>
        )}
      </button>

      <p className="text-xs text-[#6B6B6B] text-center">
        By placing this order, you agree to receive payment verification details on WhatsApp.
      </p>

    </form>
  )
}
