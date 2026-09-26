import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Package, Users, X, ArrowRight, ExternalLink } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'
import { handleImageError } from '../../utils/imageFallback'

export default function QuickSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { products, orders, buyerProfiles } = useApp()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const q = query.trim().toLowerCase()

  // Search Products
  const matchingProducts = q
    ? products.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.id?.toLowerCase().includes(q) ||
          p.series?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  // Search Orders
  const matchingOrders = q
    ? orders.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.buyer_name?.toLowerCase().includes(q) ||
          o.buyer_phone?.includes(q) ||
          o.buyer_whatsapp?.includes(q)
      ).slice(0, 4)
    : []

  // Search Customers
  const customerMap = new Map()
  orders.forEach((o) => {
    const key = o.buyer_phone || o.buyer_whatsapp || o.buyer_name
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: o.buyer_name,
        phone: o.buyer_phone || o.buyer_whatsapp,
        ordersCount: 1
      })
    }
  })
  const matchingCustomers = q
    ? Array.from(customerMap.values()).filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      ).slice(0, 4)
    : []

  const totalResults = matchingProducts.length + matchingOrders.length + matchingCustomers.length

  const handleSelect = (path) => {
    onClose()
    navigate(path)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#EDEDED] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#EDEDED] gap-3">
          <Search className="w-5 h-5 text-[#9CA3AF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers by name, ID, or phone..."
            className="flex-1 text-sm text-[#111827] placeholder-[#9CA3AF] outline-none bg-transparent font-sans"
          />
          {query ? (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-2 py-0.5 text-[11px] font-mono text-[#6B7280] bg-gray-100 border border-gray-200 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!q ? (
            <div className="py-8 text-center text-xs text-[#9CA3AF]">
              <p className="font-medium text-[#6B7280] mb-1">Quick Search</p>
              <p>Type to search across the entire AnimeMax store inventory, orders, and buyers.</p>
              <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-[#9CA3AF]">
                <span>Try searching:</span>
                <button onClick={() => setQuery('HW')} className="text-[#3B82F6] hover:underline">"HW"</button>
                <span>•</span>
                <button onClick={() => setQuery('Order')} className="text-[#3B82F6] hover:underline">"Order"</button>
                <span>•</span>
                <button onClick={() => setQuery('Rahul')} className="text-[#3B82F6] hover:underline">"Rahul"</button>
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-[#9CA3AF]">
              <p className="font-semibold text-[#111827] mb-1">No matching results found</p>
              <p>We couldn't find anything matching "{query}". Try a different keyword.</p>
            </div>
          ) : (
            <>
              {/* Products Section */}
              {matchingProducts.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    <Package className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Products ({matchingProducts.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingProducts.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handleSelect('/admin/products')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F6F8] transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            onError={handleImageError}
                            className="w-9 h-9 rounded-lg object-cover bg-gray-100 border border-gray-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#111827] group-hover:text-[#3B82F6] truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-[#6B7280] truncate">
                              {p.id} • {p.series || p.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-[#111827]">{formatPrice(p.price)}</p>
                          <span className={`text-[10px] font-medium ${p.in_stock && p.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {p.in_stock && p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Section */}
              {matchingOrders.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Orders ({matchingOrders.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingOrders.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => handleSelect('/admin/orders')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F6F8] transition-colors text-left group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#111827] group-hover:text-[#3B82F6]">
                              #{o.id}
                            </span>
                            <span className="text-xs text-[#6B7280] truncate">— {o.buyer_name}</span>
                          </div>
                          <p className="text-[11px] text-[#9CA3AF]">
                            {o.buyer_phone || o.buyer_whatsapp}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-bold text-[#111827]">{formatPrice(o.total_amount)}</p>
                          <span className="text-[10px] font-medium uppercase text-blue-600">
                            {o.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Customers Section */}
              {matchingCustomers.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">
                    <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Customers ({matchingCustomers.length})</span>
                  </div>
                  <div className="mt-1 space-y-1">
                    {matchingCustomers.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelect('/admin/customers')}
                        className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F5F6F8] transition-colors text-left group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#111827] group-hover:text-[#3B82F6]">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-[#6B7280]">{c.phone}</p>
                        </div>
                        <span className="text-xs text-[#3B82F6] font-medium flex items-center gap-1">
                          View History <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-[#F5F6F8] border-t border-[#EDEDED] flex items-center justify-between text-[11px] text-[#6B7280]">
          <div className="flex items-center gap-3">
            <span>Navigation: Click or press Enter</span>
            <span>•</span>
            <span>Close: ESC</span>
          </div>
          <span className="text-[#3B82F6] font-medium">AnimeMax Admin Search</span>
        </div>
      </div>
    </div>
  )
}
