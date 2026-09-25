import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, MessageSquare, ArrowRight, Package, Clock, ShieldCheck, Home } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../utils/formatPrice'
import { OrderStatusBadge } from '../components/common/Badge'
import { OWNER_WHATSAPP, OWNER_UPI_ID } from '../lib/clerkClient'

export default function OrderConfirmation() {
  const { orderId } = useParams()
  const { orders, mockUser } = useApp()

  let order = orders.find((o) => o.id === orderId)
  if (!order) {
    try {
      const saved = JSON.parse(localStorage.getItem('animemax_orders_v1') || '[]')
      order = saved.find((o) => o.id === orderId)
    } catch {}
  }

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#111111]">Order Confirmed!</h1>
        <p className="text-xs text-[#6B6B6B]">Order #{orderId} has been successfully recorded.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-stone-200 text-xs font-semibold text-[#111111] hover:bg-stone-50 shadow-sm transition-all"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    )
  }

  const cleanOwnerPhone = OWNER_WHATSAPP.replace(/\D/g, '')
  const whatsappMsg = encodeURIComponent(
    `Hi AnimeMax! I just placed Order #${order.id} for ₹${order.total_amount}. My WhatsApp number is ${order.buyer_whatsapp}. Please send my UPI QR code to complete payment!`
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 pb-16">
      
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#111111] font-display">
          Your Order Has Been Placed!
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-lg mx-auto">
          Order <strong className="font-mono text-[#111111]">#{order.id}</strong> is registered. You'll receive your payment UPI QR code on WhatsApp shortly.
        </p>
      </div>

      {/* 4-Step Payment & Fulfillment Process */}
      <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600">
          Next Steps: How Your Payment Works
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-stone-200/80 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center font-bold flex-shrink-0 text-xs">
              1
            </span>
            <div>
              <h4 className="font-semibold text-[#111111]">Order Alert Sent</h4>
              <p className="text-[#6B6B6B] mt-0.5 leading-relaxed">The shopkeeper has been notified of your order details.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#E3EFE1] border border-emerald-300/80 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0 text-xs">
              2
            </span>
            <div>
              <h4 className="font-semibold text-emerald-950">UPI QR on WhatsApp</h4>
              <p className="text-emerald-900 mt-0.5 leading-relaxed">Expect a QR message at <strong className="text-emerald-950 font-bold">{order.buyer_whatsapp}</strong> within 5-15 mins.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-stone-200/80 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-purple-100 border border-purple-200 text-purple-600 flex items-center justify-center font-bold flex-shrink-0 text-xs">
              3
            </span>
            <div>
              <h4 className="font-semibold text-[#111111]">Scan & Pay via UPI</h4>
              <p className="text-[#6B6B6B] mt-0.5 leading-relaxed">Scan with GPay, PhonePe, or Paytm and reply with screenshot/UTR.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F5F3] border border-stone-200/80 flex gap-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 text-xs">
              4
            </span>
            <div>
              <h4 className="font-semibold text-[#111111]">Dispatched with Tracking</h4>
              <p className="text-[#6B6B6B] mt-0.5 leading-relaxed">Parcel will be safely bubble-wrapped and dispatched to your address.</p>
            </div>
          </div>

        </div>

        {/* Instant WhatsApp link for proactive buyer */}
        <div className="pt-2">
          <a
            href={`https://wa.me/${cleanOwnerPhone}?text=${whatsappMsg}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Fast-Track: Message Owner on WhatsApp Now</span>
          </a>
        </div>
      </div>

      {/* Order Summary Receipt */}
      <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-sm font-bold text-[#111111]">Order Details</h3>
            <p className="text-[11px] text-[#6B6B6B]">{new Date(order.created_at).toLocaleString()}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Shipping address & buyer */}
        <div className="p-3.5 rounded-2xl bg-[#F5F5F3] border border-stone-200/70 text-xs text-[#111111] space-y-1">
          <p><strong className="text-[#6B6B6B]">Recipient:</strong> {order.buyer_name}</p>
          <p><strong className="text-[#6B6B6B]">WhatsApp / Phone:</strong> {order.buyer_whatsapp}</p>
          <p><strong className="text-[#6B6B6B]">Shipping Address:</strong> {order.buyer_address}</p>
        </div>

        {/* Items */}
        <div className="divide-y divide-stone-100 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-11 h-11 object-cover rounded-xl bg-stone-100 border border-stone-200"
                />
                <div>
                  <p className="font-semibold text-[#111111]">{item.name}</p>
                  <p className="text-[11px] text-[#6B6B6B]">Qty: {item.qty} × {formatPrice(item.price)}</p>
                </div>
              </div>
              <span className="font-bold text-[#111111]">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-sm font-bold text-[#111111]">
          <span>Total Amount Payable</span>
          <span className="text-base text-rose-600">{formatPrice(order.total_amount)}</span>
        </div>
      </div>

      {/* Bottom links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white border border-stone-200 text-[#111111] font-bold hover:bg-stone-50 text-center shadow-sm transition-all"
        >
          Continue Shopping
        </Link>
        {mockUser.role !== 'guest' && (
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-center font-bold transition-all"
          >
            View in Order History
          </Link>
        )}
      </div>

    </div>
  )
}
