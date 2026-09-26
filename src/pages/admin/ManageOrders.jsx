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
    <div className="space-y-6 max-w-7xl mx-auto font-sans antialiased text-[#111827]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Orders & Fulfillment
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Review incoming orders, launch WhatsApp chats with UPI QR links, and update fulfillment stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#EDEDED] text-xs font-semibold text-[#111827] hover:bg-gray-50 shadow-2xs transition-all"
            title="Sync latest orders from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#3B82F6]' : 'text-[#6B7280]'}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Orders'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#111827] bg-white px-3.5 py-1.5 rounded-xl border border-[#EDEDED] shadow-2xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>WhatsApp UPI Active</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#EDEDED] shadow-2xs">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending QR' },
            { id: 'qr_sent', label: 'QR Sent' },
            { id: 'payment_confirmed', label: 'Payment Verified' },
            { id: 'shipped', label: 'Shipped' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                statusFilter === tab.id
                  ? 'bg-[#3B82F6] text-white shadow-2xs'
                  : 'bg-[#F5F6F8] text-[#6B7280] hover:text-[#111827] hover:bg-gray-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                statusFilter === tab.id 
                  ? 'bg-white text-[#3B82F6]' 
                  : 'bg-white text-[#6B7280] border border-[#EDEDED]'
              }`}>
                {countByStatus[tab.id] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search name, phone, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F5F6F8] border border-[#EDEDED] rounded-xl pl-9 pr-4 py-2 text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
          <Search className="w-3.5 h-3.5 text-[#9CA3AF] absolute left-3 top-2.5" />
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
