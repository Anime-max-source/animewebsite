import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import CheckoutForm from '../../components/storefront/CheckoutForm'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Checkout() {
  const { items, cartTotal, cartCount } = useCart()

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-4 font-sans">
        <h2 className="text-2xl font-black text-[#111111] font-display">Your Cart is Empty</h2>
        <p className="text-xs text-[#6B6B6B] font-medium leading-relaxed">Add some anime collectibles before proceeding to checkout.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-white shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Go to Catalog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-sans">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B6B6B] hover:text-[#111111] font-bold transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-display">
          Checkout & WhatsApp Delivery
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-0.5 font-medium">
          Enter your shipping details. Your UPI payment QR code will be sent to your WhatsApp number.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Checkout Form Container */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm">
          <CheckoutForm />
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-black/5 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-black text-[#111111] flex items-center gap-2 font-display">
              <ShoppingBag className="w-4 h-4 text-[#111111]" />
              <span>Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
            </h2>
            <Link to="/cart" className="text-xs font-bold text-[#6B6B6B] hover:text-[#111111] transition-colors">
              Edit
            </Link>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-12 h-14 object-cover rounded-xl bg-slate-100 border border-black/5 flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-[#111111] truncate">{item.name}</p>
                    <p className="text-[#6B6B6B] text-[11px] font-medium">Qty: {item.qty} × {formatPrice(item.price)}</p>
                  </div>
                </div>
                <span className="font-black text-[#111111] flex-shrink-0">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 text-xs text-[#6B6B6B] font-medium">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-[#111111] font-bold">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Express Delivery (India)</span>
              <span className="text-emerald-700 font-bold">FREE</span>
            </div>
            <div className="flex justify-between text-base font-black text-[#111111] pt-2 border-t border-slate-100">
              <span>Total Due</span>
              <span className="text-lg text-[#111111] font-black">{formatPrice(cartTotal)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
