import React, { useState } from 'react'
import { MessageSquare, CheckCircle, Clock, Truck, XCircle, Eye, Phone, MapPin, QrCode } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import { OrderStatusBadge } from '../common/Badge'
import { OWNER_UPI_ID } from '../../lib/clerkClient'
import Modal from '../common/Modal'

export default function OrderTable({ orders, onUpdateStatus }) {
  const [inspectOrder, setInspectOrder] = useState(null)
  const [showQrModal, setShowQrModal] = useState(null)

  const statuses = [
    { value: 'pending', label: '1. Pending QR' },
    { value: 'qr_sent', label: '2. QR Sent' },
    { value: 'payment_confirmed', label: '3. Payment Verified' },
    { value: 'shipped', label: '4. Shipped' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const generateWhatsAppMessage = (order) => {
    const cleanPhone = (order.buyer_whatsapp || order.buyer_phone || '').replace(/\D/g, '')
    const itemsList = order.items.map((i) => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('\n')
    
    const message = 
      `👋 Hi ${order.buyer_name}!\n\n` +
      `Thank you for your order at *AnimeMax*!\n` +
      `📦 *Order ID:* #${order.id}\n\n` +
      `*Your Items:*\n${itemsList}\n\n` +
      `💰 *Total Amount:* ${formatPrice(order.total_amount)}\n\n` +
      `📲 *UPI Payment ID:* \`${OWNER_UPI_ID}\`\n\n` +
      `Please pay via Google Pay, PhonePe, or Paytm and send a screenshot of the payment receipt or UTR number here.\n\n` +
      `Once verified, we will dispatch your parcel to:\n📍 ${order.buyer_address}\n\n` +
      `Thank you for supporting AnimeMax! 🎌`

    return `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(message)}`
  }

  // UPI deep link & QR generator link
  const generateUpiQrUrl = (order) => {
    const upiLink = `upi://pay?pa=${OWNER_UPI_ID}&pn=AnimeMax&am=${order.total_amount}&cu=INR&tn=Order-${order.id}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-[#111111]">
          <thead className="bg-[#F5F5F3] text-[11px] uppercase tracking-wider text-[#8A8A8A] border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Order ID & Date</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Buyer Details</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Items</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Total</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3.5 font-semibold text-center">Fulfillment Actions</th>
              <th scope="col" className="px-5 py-3.5 font-semibold text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-xs text-[#8A8A8A]">
                  <p className="font-bold text-sm text-[#111111] mb-1">No orders found</p>
                  <p>There are no orders matching this filter yet.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => {
              return (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* ID & Date */}
                  <td className="px-5 py-3.5">
                    <p className="font-mono font-bold text-[#111111]">#{order.id}</p>
                    <p className="text-[10px] text-[#8A8A8A] mt-0.5 font-medium">
                      {new Date(order.created_at).toLocaleDateString()} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>

                  {/* Buyer Details */}
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-[#111111]">{order.buyer_name}</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 mt-0.5 font-medium">
                      <MessageSquare className="w-3 h-3" />
                      <span>{order.buyer_whatsapp}</span>
                    </div>
                  </td>

                  {/* Items summary */}
                  <td className="px-5 py-3.5">
                    <div className="max-w-xs truncate text-[#111111] font-medium">
                      {order.items.map((i) => `${i.name} (x${i.qty})`).join(', ')}
                    </div>
                    <span className="text-[10px] text-[#8A8A8A]">
                      {order.items.reduce((acc, i) => acc + i.qty, 0)} total items
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-5 py-3.5 font-bold text-[#111111] text-sm">
                    {formatPrice(order.total_amount)}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-5 py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      aria-label="Order status"
                      className="bg-[#F5F5F3] border border-slate-200 text-xs text-[#111111] font-semibold rounded-full px-3 py-1.5 focus:outline-none focus:border-[#111111] cursor-pointer"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Quick WhatsApp & QR Link */}
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={generateWhatsAppMessage(order)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D6FF4A] hover:bg-[#c9f635] text-black shadow-sm transition-all"
                        title="Open WhatsApp with pre-filled order details & UPI request"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Send QR</span>
                      </a>

                      <button
                        onClick={() => setShowQrModal(order)}
                        className="p-1.5 rounded-full bg-slate-100 text-slate-700 hover:text-black hover:bg-slate-200 transition-colors"
                        title="View Generated UPI QR Code"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Inspect Details */}
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setInspectOrder(order)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
                      title="Inspect full order"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>

      {/* Inspect Order Modal */}
      <Modal
        isOpen={Boolean(inspectOrder)}
        onClose={() => setInspectOrder(null)}
        title={`Order Inspection #${inspectOrder?.id}`}
      >
        {inspectOrder && (
          <div className="space-y-4 text-xs text-slate-300">
            {/* Status & Date */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <p className="text-slate-400">Order Placed On</p>
                <p className="text-white font-medium">
                  {new Date(inspectOrder.created_at).toLocaleString()}
                </p>
              </div>
              <OrderStatusBadge status={inspectOrder.status} />
            </div>

            {/* Buyer Details */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#D6FF4A]">
                Buyer Delivery Information
              </h4>
              <p><strong className="text-slate-400">Name:</strong> {inspectOrder.buyer_name}</p>
              <p><strong className="text-slate-400">Phone:</strong> {inspectOrder.buyer_phone}</p>
              <p><strong className="text-slate-400">WhatsApp:</strong> {inspectOrder.buyer_whatsapp}</p>
              <p><strong className="text-slate-400">Shipping Address:</strong> {inspectOrder.buyer_address}</p>
              <p><strong className="text-slate-400">User Type:</strong> {inspectOrder.user_id ? `Registered (${inspectOrder.user_id})` : 'Guest Checkout'}</p>
            </div>

            {/* Ordered Items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#B8A4FF]">
                Purchased Items ({inspectOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden">
                {inspectOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#0f121d]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-9 h-9 rounded object-cover bg-slate-800"
                      />
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Qty: {item.qty} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-white">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-base text-[#D6FF4A]">{formatPrice(inspectOrder.total_amount)}</span>
            </div>

            {/* Quick WhatsApp Action */}
            <div className="pt-2">
              <a
                href={generateWhatsAppMessage(inspectOrder)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#D6FF4A] hover:bg-[#c9f635] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open WhatsApp Chat with {inspectOrder.buyer_name}</span>
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* QR Code Preview Modal */}
      <Modal
        isOpen={Boolean(showQrModal)}
        onClose={() => setShowQrModal(null)}
        title={`UPI QR Preview for #${showQrModal?.id}`}
        maxWidth="max-w-md"
      >
        {showQrModal && (
          <div className="flex flex-col items-center text-center space-y-4 text-xs text-slate-300">
            <p>
              This QR code can be scanned with Google Pay, PhonePe, or Paytm for{' '}
              <strong className="text-white">{formatPrice(showQrModal.total_amount)}</strong>.
            </p>

            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <img
                src={generateUpiQrUrl(showQrModal)}
                alt="UPI QR Code"
                className="w-52 h-52 object-contain"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 w-full text-center">
              <p className="text-slate-400 text-[11px]">UPI ID: <strong className="text-white font-mono">{OWNER_UPI_ID}</strong></p>
              <p className="text-slate-400 text-[11px] mt-0.5">Amount: <strong className="text-[#D6FF4A] font-bold">{formatPrice(showQrModal.total_amount)}</strong></p>
            </div>

            <a
              href={generateWhatsAppMessage(showQrModal)}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#D6FF4A] hover:bg-[#c9f635] text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send QR Link to Buyer's WhatsApp</span>
            </a>
          </div>
        )}
      </Modal>
    </>
  )
}
