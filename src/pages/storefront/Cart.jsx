import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  ArrowRight,
  Trash,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  ChatCircle
} from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { cldUrl } from '../../lib/cloudinary'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="sf-empty-state max-w-md mx-auto my-20">
        <ShoppingBag size={32} className="text-[#6B6B6B] mb-4" />
        <h2 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Your Cart is Empty
        </h2>
        <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-[45ch] mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
          You haven't added any anime figures or merchandise to your cart yet.
        </p>
        <Link to="/" className="sf-btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Start Browsing
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-0.5">Review items and proceed to checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-[#6B6B6B] hover:text-[#DC2626] font-medium transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ── Items List ────────────────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={cldUrl(item.image_url, { width: 160, height: 160, crop: 'fill' })}
                  alt={item.name}
                  loading="lazy"
                  className="w-20 h-24 object-cover rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex-shrink-0"
                />
                <div>
                  <Link to={`/product/${item.id}`} className="hover:text-[#DC2626] transition-colors">
                    <h3 className="font-semibold text-[#111111] text-sm line-clamp-2">{item.name}</h3>
                  </Link>
                  <p className="text-sm font-bold text-[#DC2626] mt-1">{formatPrice(item.price)}</p>
                  <p className="text-xs text-[#6B6B6B] uppercase font-medium mt-0.5 tracking-wider">
                    {item.category}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E5E5]">
                {/* Quantity stepper */}
                <div className="flex items-center gap-2 bg-white border border-[#E5E5E5] rounded-[12px] px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="w-6 h-6 rounded-[12px] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-[#111111] w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="w-6 h-6 rounded-[12px] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-bold text-[#111111]">{formatPrice(item.price * item.qty)}</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-[#6B6B6B] hover:text-[#DC2626] rounded-[12px] hover:bg-white border border-transparent hover:border-[#E5E5E5] transition-colors"
                  title="Remove item"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#111111] font-medium transition-colors pt-2"
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* ── Order Summary Sidebar ─────────────────────────────────── */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] space-y-5">
          <h2 className="text-base font-bold text-[#111111]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-[#6B6B6B]">
            <div className="flex justify-between">
              <span>Items Total ({cartCount})</span>
              <span className="font-semibold text-[#111111]">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping &amp; Delivery</span>
              <span className="font-semibold text-[#111111]">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="font-semibold text-[#111111]">UPI QR on WhatsApp</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#111111] pt-3 border-t border-[#E5E5E5]">
              <span>Total Amount</span>
              <span className="text-xl text-[#DC2626]">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          {/* WhatsApp info */}
          <div className="p-3.5 rounded-[12px] bg-white border border-[#E5E5E5] text-sm text-[#6B6B6B] flex items-start gap-2.5 leading-relaxed">
            <ShieldCheck size={20} className="text-[#111111] flex-shrink-0 mt-0.5" />
            <span>
              No advance payment needed. Pay via UPI after receiving your WhatsApp order QR code.
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="sf-btn-primary w-full gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  )
}
