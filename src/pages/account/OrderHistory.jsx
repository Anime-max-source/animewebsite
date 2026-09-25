import React from 'react'
import { Link } from 'react-router-dom'
import { Package, Clock, MessageSquare, ArrowRight, ShoppingBag } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'
import { OrderStatusBadge } from '../../components/common/Badge'
import { OWNER_WHATSAPP } from '../../lib/clerkClient'

export default function OrderHistory() {
  const { orders, mockUser } = useApp()

  // Filter orders belonging to the logged-in buyer
  const myOrders = orders.filter((o) => mockUser?.id && o.user_id === mockUser?.id)

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight font-display">
            My Anime Orders
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
            Track fulfillment status, QR delivery, and dispatch updates.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-gray-700 text-xs font-semibold shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-rose-500" /> Shop More
        </Link>
      </div>

      {myOrders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-black/5 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#111111]">No Orders Found</h3>
          <p className="text-xs text-[#6B6B6B] max-w-sm mx-auto">
            You haven't placed any orders yet. Check out our latest figures and hoodies!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] text-white text-xs font-bold shadow-md hover:opacity-90 transition-opacity"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4 hover:shadow-md transition-shadow"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-[#111111] text-sm">#{order.id}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-[#6B6B6B]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* Items in order */}
              <div className="space-y-2.5">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-[#111111]">{item.name}</p>
                        <p className="text-[11px] text-[#6B6B6B]">Qty: {item.qty} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#111111]">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer row: Total and WhatsApp inquiry */}
              <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#6B6B6B]">Total Paid / Due:</span>
                  <span className="text-sm font-bold text-rose-600">{formatPrice(order.total_amount)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${OWNER_WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi AnimeMax, I have an update/inquiry regarding Order #${order.id}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
