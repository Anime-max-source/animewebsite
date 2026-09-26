import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from '@phosphor-icons/react'
import CheckoutForm from '../../components/storefront/CheckoutForm'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Checkout() {
  const { items, cartTotal, cartCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="sf-empty-state max-w-md mx-auto my-20">
        <ShoppingBag size={32} className="text-[#6B6B6B] mb-4" />
        <h2 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Your Cart is Empty
        </h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-[45ch] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          Add some anime collectibles before proceeding to checkout.
        </p>
        <Link to="/" className="sf-btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Go to Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#111111] font-medium transition-colors mb-3"
        >
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          Checkout &amp; WhatsApp Delivery
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-1">
          Enter your shipping details. Your UPI payment QR code will be sent to your WhatsApp number.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Form ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-white rounded-[12px] border border-[#E5E5E5] p-6 sm:p-8">
          <CheckoutForm />
        </div>

        {/* ── Order Summary ─────────────────────────────────────────── */}
        <div className="lg:col-span-5 bg-[#F8F8F6] rounded-[12px] border border-[#E5E5E5] p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E5]">
            <h2 className="text-sm font-bold text-[#111111] flex items-center gap-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              <ShoppingBag size={20} className="text-[#111111]" />
              <span>Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </h2>
            <Link to="/cart" className="text-xs font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors">
              Edit
            </Link>
          </div>

          {/* Item list */}
          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-[#111111] truncate text-xs">{item.name}</p>
                    <p className="text-[#6B6B6B] text-xs mt-0.5">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-[#DC2626] flex-shrink-0 text-xs">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-2 pt-4 border-t border-[#E5E5E5] text-sm text-[#6B6B6B]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#111111]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery (India)</span>
              <span className="font-semibold text-[#111111]">FREE</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
              <span>Total Due</span>
              <span className="text-lg text-[#DC2626]">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
