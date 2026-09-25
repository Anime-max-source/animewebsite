import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, ShieldCheck, MapPin, User, Phone, CheckCircle, AlertCircle } from 'lucide-react'
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
    // Clear error for edited field
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
        user_id: mockUser.id || null, // null for guest checkout
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

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff3366', '#8b5cf6', '#06b6d4', '#f59e0b']
      })

      // Clear cart
      clearCart()

      // Redirect to Order Confirmation page
      navigate(`/order-confirmation/${created.id}`)
    } catch (err) {
      console.error('Failed to submit order', err)
      setSubmitError(err?.message || 'Something went wrong submitting your order. Please check your network and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Submission Error Banner */}
      {submitError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3 shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-rose-950">Unable to complete order</h4>
            <p className="text-rose-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Sign-in status prompt */}
      {mockUser.role === 'guest' ? (
        <div className="p-3.5 rounded-2xl bg-[#F5F5F3] border border-stone-200/80 text-xs text-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">👤</span>
            <span>Checking out as <strong>Guest</strong> (Account optional).</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-rose-600 hover:text-rose-700 font-bold underline text-xs transition-colors"
          >
            Sign In to save address
          </button>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Signed in as <strong>{mockUser.fullName}</strong>. Details will auto-save to your account.</span>
        </div>
      )}

      {/* WhatsApp payment advisory */}
      <div className="p-4 rounded-2xl bg-[#E3EFE1] border border-emerald-300/80 text-xs text-emerald-950 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0 shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-emerald-950 text-sm font-display">Manual UPI Payment on WhatsApp</h4>
            <p className="text-emerald-900 mt-1 leading-relaxed font-medium">
              After placing this order, you do NOT pay on this screen. The AnimeMax owner will review your order and send a custom <strong>UPI QR code</strong> directly to your WhatsApp number within 5–15 minutes!
            </p>
          </div>
        </div>
      </div>

      {/* Customer Full Name */}
      <div>
        <label className="block text-xs font-bold text-[#111111] mb-1.5">
          Full Name <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleChange}
            placeholder="Your full name"
            className={`w-full bg-[#F5F5F3] border ${errors.buyer_name ? 'border-rose-500' : 'border-stone-200'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#ff3366] transition-all`}
          />
          <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>
        {errors.buyer_name && (
          <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.buyer_name}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-xs font-bold text-[#111111] mb-1.5">
          Mobile Phone Number (for delivery SMS/calls) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="tel"
            name="buyer_phone"
            value={formData.buyer_phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            className={`w-full bg-[#F5F5F3] border ${errors.buyer_phone ? 'border-rose-500' : 'border-stone-200'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#ff3366] transition-all`}
          />
          <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>
        {errors.buyer_phone && (
          <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.buyer_phone}
          </p>
        )}
      </div>

      {/* WhatsApp Number checkbox & field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#111111]">
            WhatsApp Number (Required for receiving UPI QR) <span className="text-rose-500">*</span>
          </label>
          <label className="flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={handleSameAsPhoneToggle}
              className="rounded bg-stone-100 border-stone-300 text-[#ff3366] focus:ring-0"
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
            className={`w-full bg-[#F5F5F3] border ${errors.buyer_whatsapp ? 'border-rose-500' : 'border-stone-200'} ${sameAsPhone ? 'opacity-70 bg-stone-100/60' : ''} rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#ff3366] transition-all`}
          />
          <MessageSquare className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
        </div>
        {errors.buyer_whatsapp && (
          <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.buyer_whatsapp}
          </p>
        )}
      </div>

      {/* Shipping Address */}
      <div>
        <label className="block text-xs font-bold text-[#111111] mb-1.5">
          Delivery Address (House/Flat No, Street, City, State & PIN code) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <textarea
            name="buyer_address"
            rows={3}
            value={formData.buyer_address}
            onChange={handleChange}
            placeholder="Flat/House No, Street, City, State, PIN code"
            className={`w-full bg-[#F5F5F3] border ${errors.buyer_address ? 'border-rose-500' : 'border-stone-200'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#111111] placeholder-stone-400 focus:outline-none focus:bg-white focus:border-[#ff3366] transition-all`}
          />
          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
        </div>
        {errors.buyer_address && (
          <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.buyer_address}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff3366] via-rose-600 to-[#8b5cf6] hover:opacity-95 text-white font-bold text-base tracking-wide shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
      >
        {isSubmitting ? (
          <span>Processing Order...</span>
        ) : (
          <>
            <ShieldCheck className="w-5 h-5" />
            <span>Place Order & Request UPI QR</span>
          </>
        )}
      </button>

      <p className="text-center text-[11px] text-[#6B6B6B]">
        By placing this order, you agree to receive payment verification details on WhatsApp.
      </p>

    </form>
  )
}
