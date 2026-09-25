import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  ChevronDown, 
  Flame, 
  ExternalLink, 
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function AdminSidebar() {
  const location = useLocation()
  const { orders, mockUser } = useApp()

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingCount > 0 ? pendingCount : null
    },
    {
      name: 'Homepage Content',
      path: '/admin/content',
      icon: Sparkles,
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: Users,
    },
    {
      name: 'Messages / Support',
      path: '/admin/messages',
      icon: MessageSquare,
    },
  ]

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className="w-64 bg-[#0B0B0B] border-r border-[#1C1C1C] flex flex-col justify-between p-4 min-h-screen shrink-0 text-white font-sans select-none">
      <div className="space-y-6">
        
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-2.5 px-3 pt-2">
          <div className="w-8 h-8 rounded-xl bg-[#D6FF4A] flex items-center justify-center text-black shadow-sm">
            <Flame className="w-5 h-5 fill-black text-black" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold text-base tracking-tight text-white font-display">
              Anime<span className="text-[#D6FF4A]">Max</span>
            </span>
            <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider ml-1">
              Admin
            </span>
          </div>
        </div>

        {/* Owner Profile Block */}
        <div className="mx-1 px-3 py-2.5 rounded-2xl bg-[#141414] border border-[#222222] flex items-center justify-between hover:border-[#333333] transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D6FF4A] to-[#B8A4FF] p-[1.5px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#0B0B0B] flex items-center justify-center text-xs font-bold text-white">
                {mockUser?.fullName?.charAt(0) || 'O'}
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate group-hover:text-[#D6FF4A] transition-colors">
                {mockUser?.fullName || 'Store Owner'}
              </p>
              <p className="text-[10px] text-[#8A8A8A] truncate">
                {mockUser?.primaryEmailAddress?.emailAddress || 'owner@animemax.store'}
              </p>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] shrink-0 group-hover:text-white transition-colors" />
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white text-black rounded-full shadow-md'
                    : 'text-[#8A8A8A] hover:text-white hover:bg-white/5 rounded-xl'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-black' : 'text-[#8A8A8A]'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      active
                        ? 'bg-black text-[#D6FF4A]'
                        : 'bg-[#D6FF4A] text-black'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Promo/Upsell Card & Storefront link */}
      <div className="space-y-3 pt-4">
        
        {/* Promo / Upsell Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181818] via-[#141414] to-[#121212] border border-[#252525] relative overflow-hidden shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-[#D6FF4A]/10 border border-[#D6FF4A]/20 flex items-center justify-center text-[#D6FF4A] mb-3">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-white tracking-tight">
            Automate UPI Payments
          </h4>
          <p className="text-[11px] text-[#8A8A8A] mt-1 leading-snug">
            Connect Razorpay or Cashfree to replace manual WhatsApp QR confirmation.
          </p>
          <Link
            to="/admin/orders"
            className="mt-3 w-full py-2 px-3 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-white text-[11px] font-semibold flex items-center justify-between transition-colors border border-[#333333]"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3 text-[#D6FF4A]" />
          </Link>
        </div>

        {/* Storefront Link */}
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#8A8A8A] hover:text-white hover:bg-white/5 transition-colors"
        >
          <span>View Public Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  )
}
