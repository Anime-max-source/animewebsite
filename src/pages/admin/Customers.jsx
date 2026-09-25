import React, { useState } from 'react'
import { 
  Users, 
  Search, 
  MessageSquare, 
  ShoppingBag, 
  Mail, 
  Phone, 
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Customers() {
  const { orders, buyerProfiles } = useApp()
  const [searchFilter, setSearchFilter] = useState('')

  // Aggregate customers from orders and buyerProfiles
  const customerMap = new Map()

  // Process buyer profiles first
  Object.values(buyerProfiles || {}).forEach((prof) => {
    customerMap.set(prof.user_id, {
      id: prof.user_id,
      name: prof.name || 'Registered Buyer',
      phone: prof.phone || prof.whatsapp || 'N/A',
      whatsapp: prof.whatsapp || prof.phone || 'N/A',
      address: prof.address || 'N/A',
      isRegistered: true,
      ordersCount: 0,
      totalSpent: 0,
      lastOrderDate: null
    })
  })

  // Process orders
  orders.forEach((order) => {
    const key = order.user_id || order.buyer_whatsapp || order.buyer_phone || order.buyer_name
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        id: key,
        name: order.buyer_name,
        phone: order.buyer_phone,
        whatsapp: order.buyer_whatsapp,
        address: order.buyer_address,
        isRegistered: Boolean(order.user_id),
        ordersCount: 0,
        totalSpent: 0,
        lastOrderDate: order.created_at
      })
    }
    const cust = customerMap.get(key)
    cust.ordersCount += 1
    cust.totalSpent += Number(order.total_amount) || 0
    if (!cust.lastOrderDate || new Date(order.created_at) > new Date(cust.lastOrderDate)) {
      cust.lastOrderDate = order.created_at
    }
  })

  const customerList = Array.from(customerMap.values()).filter((c) => {
    const q = searchFilter.toLowerCase()
    return (
      !searchFilter ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.whatsapp.toLowerCase().includes(q)
    )
  })

  const totalSpentAll = customerList.reduce((acc, c) => acc + c.totalSpent, 0)
  const repeatCustomers = customerList.filter((c) => c.ordersCount > 1).length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-display">
            Customer Directory
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Manage buyer relationships, order history, and direct WhatsApp contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8A8A8A] bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm font-semibold">
            {customerList.length} Total Buyers
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#8A8A8A]">Total Customers</p>
            <h3 className="text-2xl font-black text-[#111111] mt-1">{customerList.length}</h3>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">Guest & registered accounts</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#D6FF4A]/30 flex items-center justify-center text-black">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#8A8A8A]">Repeat Buyers</p>
            <h3 className="text-2xl font-black text-[#111111] mt-1">{repeatCustomers}</h3>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">Placed 2+ orders</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#B8A4FF]/30 flex items-center justify-center text-black">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#8A8A8A]">Total Customer Spend</p>
            <h3 className="text-2xl font-black text-[#111111] mt-1">{formatPrice(totalSpentAll)}</h3>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">Across all order items</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[#D6FF4A]/30 flex items-center justify-center text-black">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#F5F5F3] border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-[#111111] placeholder-[#8A8A8A] focus:outline-none focus:border-black"
          />
          <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3.5 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-[#111111]">
          <thead className="bg-[#F5F5F3] text-[11px] uppercase tracking-wider text-[#8A8A8A] border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Customer</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Account Type</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">WhatsApp / Phone</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Orders</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Total Spent</th>
              <th scope="col" className="px-5 py-3.5 font-semibold text-right">Quick Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customerList.map((customer) => {
              const cleanPhone = (customer.whatsapp || customer.phone || '').replace(/\D/g, '')
              const waLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodeURIComponent(`Hi ${customer.name}, thank you for choosing AnimeMax!`)}`

              return (
                <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Name & Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D6FF4A] to-[#B8A4FF] p-[1.5px] shrink-0">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#111111]">
                          {customer.name.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="font-bold text-[#111111]">{customer.name}</p>
                        <p className="text-[11px] text-[#8A8A8A] truncate max-w-xs">{customer.address}</p>
                      </div>
                    </div>
                  </td>

                  {/* Account Type */}
                  <td className="px-5 py-3.5">
                    {customer.isRegistered ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#B8A4FF]/20 text-[#5939bd] border border-[#B8A4FF]/40">
                        <ShieldCheck className="w-3 h-3" /> Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-[#8A8A8A]">
                        Guest Buyer
                      </span>
                    )}
                  </td>

                  {/* WhatsApp / Phone */}
                  <td className="px-5 py-3.5 font-medium text-[#111111]">
                    <div className="flex items-center gap-1 text-xs">
                      <span>{customer.whatsapp || customer.phone}</span>
                    </div>
                  </td>

                  {/* Orders count */}
                  <td className="px-5 py-3.5">
                    <span className="font-semibold">{customer.ordersCount} orders</span>
                  </td>

                  {/* Total spent */}
                  <td className="px-5 py-3.5 font-bold text-[#111111]">
                    {formatPrice(customer.totalSpent)}
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-3.5 text-right">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D6FF4A] hover:bg-[#c9f635] text-black shadow-sm transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </div>
  )
}
