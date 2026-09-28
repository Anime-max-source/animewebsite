import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  X,
  Plus,
  Minus,
  Trash,
  ShoppingBag,
  ArrowRight,
  ChatCircle
} from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { handleImageError } from '../../utils/imageFallback'
import { cldUrl } from '../../lib/cloudinary'

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{ background: 'rgba(17,17,17,0.4)' }}
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex" style={{ paddingLeft: 'min(2.5rem, 10vw)' }}>
        <div
          className="w-screen max-w-md bg-white border-l border-[#E5E5E5] flex flex-col"
          style={{
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >

          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-[#E5E5E5] flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center">
                <ShoppingBag size={20} className="text-[#111111]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111111] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>Your Cart</h2>
                <p className="text-xs text-[#6B6B6B]">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-[12px] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6] border border-transparent hover:border-[#E5E5E5] transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#F8F8F6]">
            {items.length === 0 ? (
              /* Empty State */
              <div className="h-full flex flex-col items-start justify-center p-8 bg-white rounded-[12px] border border-[#E5E5E5]">
                <ShoppingBag size={32} className="text-[#6B6B6B] mb-4" />
                <h3 className="text-xl font-bold text-[#111111] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  Your cart is empty
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-[45ch] mb-6">
                  Explore our scale figures, clothing, and posters to add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="sf-btn-primary"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-4 rounded-[12px] bg-white border border-[#E5E5E5] transition-colors hover:bg-[#F8F8F6]"
                >
                  <img
                    src={cldUrl(item.image_url, { width: 160, height: 160, crop: 'fill' })}
                    alt={item.name}
                    loading="lazy"
                    onError={handleImageError}
                    className="w-16 h-20 rounded-[12px] object-cover bg-[#F8F8F6] border border-[#E5E5E5] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-[#111111] truncate leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-[#DC2626] mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5E5E5]">
                      {/* Quantity stepper */}
                      <div className="flex items-center gap-2 bg-[#F8F8F6] rounded-[12px] px-2 py-1 border border-[#E5E5E5]">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-5 h-5 rounded-[12px] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-[#111111] w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-5 h-5 rounded-[12px] flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-[12px] text-[#6B6B6B] hover:text-[#DC2626] hover:bg-[#F8F8F6] transition-colors"
                        title="Remove item"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer: Summary + Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#E5E5E5] bg-white space-y-4">
              {/* Line items */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Shipping (India)</span>
                  <span className="font-semibold text-[#111111]">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#111111] pt-2 border-t border-[#E5E5E5]">
                  <span>Total Due</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>

              {/* WhatsApp payment advisory */}
              <div className="p-3.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-sm text-[#111111] flex items-start gap-2.5 leading-relaxed">
                <ChatCircle size={20} className="text-[#6B6B6B] flex-shrink-0 mt-0.5" />
                <span className="text-[#6B6B6B]">
                  Payment QR will be sent to your WhatsApp after checkout. No card required.
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                className="sf-btn-primary w-full gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
