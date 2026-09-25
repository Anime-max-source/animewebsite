import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-lg mx-auto text-center space-y-6 font-sans">
        <div className="w-20 h-20 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#111111] font-display">Your Cart is Empty</h2>
          <p className="text-xs text-[#6B6B6B] font-medium leading-relaxed">
            Looks like you haven't added any anime figures or merchandise to your stash yet!
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Start Browsing
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-display">
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">Review items and proceed to checkout.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#8A8A8A] hover:text-rose-600 font-semibold transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-xl bg-slate-100 border border-black/5 flex-shrink-0"
                />
                <div>
                  <Link to={`/product/${item.id}`} className="hover:underline transition-colors">
                    <h3 className="font-bold text-[#111111] text-sm line-clamp-2">{item.name}</h3>
                  </Link>
                  <p className="text-xs text-[#111111] font-black mt-1">{formatPrice(item.price)}</p>
                  <p className="text-[11px] text-[#8A8A8A] uppercase font-semibold mt-0.5">Category: {item.category}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-[#F5F5F3] rounded-full px-2 py-1 border border-stone-200">
                  <button
                    onClick={() => updateQuantity(item.id, item.qty - 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-[#111111] w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.qty + 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[80px]">
                  <p className="text-sm font-black text-[#111111]">{formatPrice(item.price * item.qty)}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-[#8A8A8A] hover:text-rose-600 rounded-full hover:bg-slate-100 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] font-bold transition-colors pt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-white border border-black/5 shadow-sm space-y-6">
          <h2 className="text-base font-black text-[#111111] font-display">Order Summary</h2>

          <div className="space-y-3 text-xs text-[#6B6B6B] font-medium">
            <div className="flex justify-between">
              <span>Items Total ({cartCount})</span>
              <span className="text-[#111111] font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Delivery</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode</span>
              <span className="text-[#111111] font-bold">UPI QR on WhatsApp</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#111111] pt-3 border-t border-slate-100">
              <span>Total Amount</span>
              <span className="text-xl text-[#111111] font-black">{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#E3EFE1] border border-emerald-300/80 text-xs text-emerald-950 flex items-start gap-2.5 font-medium leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <span>No advance payment needed here. Pay directly through UPI after receiving your WhatsApp order QR code.</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-glow-primary transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
