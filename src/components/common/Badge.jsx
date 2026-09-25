import React from 'react'

export function StockBadge({ inStock, stock }) {
  if (!inStock || stock <= 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 tracking-wide uppercase">
        Sold Out
      </span>
    )
  }

  if (stock && stock <= 5) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        Only {stock} Left
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
      In Stock
    </span>
  )
}

export function OrderStatusBadge({ status }) {
  const statusConfig = {
    pending: {
      label: 'Pending QR Code',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      dot: 'bg-amber-500'
    },
    qr_sent: {
      label: 'QR Sent on WhatsApp',
      bg: 'bg-sky-50 text-sky-800 border-sky-200',
      dot: 'bg-sky-500'
    },
    payment_confirmed: {
      label: 'Payment Verified',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dot: 'bg-emerald-500'
    },
    shipped: {
      label: 'Order Shipped',
      bg: 'bg-purple-50 text-purple-800 border-purple-200',
      dot: 'bg-purple-500'
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      dot: 'bg-rose-500'
    }
  }

  const current = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${current.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${current.dot}`}></span>
      {current.label}
    </span>
  )
}

export function CategoryBadge({ category }) {
  const categoryColors = {
    figures: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    clothing: 'bg-blue-50 text-blue-700 border-blue-200',
    posters: 'bg-rose-50 text-rose-700 border-rose-200',
    accessories: 'bg-amber-50 text-amber-700 border-amber-200'
  }

  const style = categoryColors[category?.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase border ${style}`}>
      {category}
    </span>
  )
}
