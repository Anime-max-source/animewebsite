import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldAlert } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-[#E3EFE1] border border-[#C9E4C5] flex items-center justify-center text-[#111111]">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-black text-[#111111] tracking-tight font-display">Your Cart</h2>
                <p className="text-xs text-[#6B6B6B] font-medium">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-[#8A8A8A] hover:text-[#111111] hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#E3EFE1]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-black/5 shadow-sm my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#E3EFE1] border border-[#C9E4C5] shadow-xs flex items-center justify-center text-[#111111] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-[#111111] font-display">Your cart is empty</h3>
                <p className="text-xs text-[#6B6B6B] mt-1 max-w-xs leading-relaxed font-medium">
                  Explore our scale figures, clothing, and posters to add items to your cart!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-4 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-all"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover bg-slate-100 border border-black/5 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#111111] truncate leading-snug">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-[#111111] mt-0.5">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      {/* Quantity buttons */}
                      <div className="flex items-center gap-2 bg-[#F5F5F3] rounded-full px-2 py-0.5 border border-stone-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[#111111] w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove item button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#8A8A8A] hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer / Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-black/5 bg-white space-y-4 shadow-sm">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B6B6B] font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111111]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B6B6B] font-medium">
                  <span>Shipping (India)</span>
                  <span className="text-emerald-700 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#111111] pt-2 border-t border-slate-100">
                  <span>Total Due</span>
                  <span className="text-base text-[#111111] font-black">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#E3EFE1] border border-emerald-300/80 text-xs text-emerald-950 flex items-start gap-2.5 font-medium leading-relaxed">
                <span className="text-sm shrink-0">📲</span>
                <span>Payment QR will be sent to your WhatsApp after checkout. No card required now.</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-glow-primary flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
