import React, { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import OrderTable from '../../components/admin/OrderTable'
import { Search, MessageSquare, Clock, CheckCircle2, RefreshCw } from 'lucide-react'

export default function ManageOrders() {
  const { orders, updateOrderStatus, refreshOrders } = useApp()
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Re-fetch orders from Supabase on mount
  useEffect(() => {
    if (refreshOrders) {
      refreshOrders()
    }
  }, [])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    if (refreshOrders) {
      await refreshOrders()
    }
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.buyer_whatsapp.includes(searchQuery) ||
      o.buyer_phone.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  const countByStatus = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    qr_sent: orders.filter((o) => o.status === 'qr_sent').length,
    payment_confirmed: orders.filter((o) => o.status === 'payment_confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-display">
            Manage Orders & UPI Fulfillment
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1 font-medium">
            Review incoming orders, launch direct WhatsApp chats with UPI QR links, and update statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#111111] hover:bg-slate-50 shadow-sm transition-all"
            title="Sync latest orders from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ff3366]' : 'text-[#8A8A8A]'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Orders'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#111111] bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#D6FF4A] animate-pulse"></span>
            <span>WhatsApp UPI Fulfillment</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: '1. Pending QR' },
            { id: 'qr_sent', label: '2. QR Sent' },
            { id: 'payment_confirmed', label: '3. Payment Verified' },
            { id: 'shipped', label: '4. Shipped' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-[#F5F5F3] text-[#8A8A8A] hover:text-[#111111]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${statusFilter === tab.id ? 'bg-[#D6FF4A] text-black' : 'bg-white text-[#8A8A8A]'}`}>
                {countByStatus[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search name, phone, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F5F3] border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-[#111111] placeholder-[#8A8A8A] focus:outline-none focus:border-[#111111]"
          />
          <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3 top-2.5" />
        </div>

      </div>

      {/* Orders Table */}
      <OrderTable
        orders={filteredOrders}
        onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
      />
    </div>
  )
}
