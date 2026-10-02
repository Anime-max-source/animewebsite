import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  List
} from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../context/AppContext'
import AnimaxLogo from './AnimaxLogo'

export default function StorefrontTopBar({ onMobileMenuToggle }) {
  const { cartCount, setIsCartOpen } = useCart()
  const { mockUser, orders } = useApp()
  const navigate = useNavigate()

  const isBuyerSignedIn = mockUser && mockUser.role !== 'guest'
  const buyerOrdersCount = isBuyerSignedIn && mockUser?.id && orders
    ? orders.filter((o) => o.user_id === mockUser.id).length
    : 0

  return (
    <header className="w-full bg-white border border-[#E5E5E5] rounded-[12px] px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 mb-6 min-w-0 h-14" style={{ minHeight: '56px' }}>

      {/* Left: Mobile menu + Brand logo / Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile menu button — hidden on desktop (lg:hidden) */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[12px] text-[#111111] hover:bg-[#F8F8F6] transition-colors flex-shrink-0"
          aria-label="Open navigation menu"
        >
          <List size={20} />
        </button>

        {/* On mobile: display AnimaxLogo directly in the top bar */}
        <Link to="/" className="lg:hidden flex items-center flex-shrink-0" aria-label="AnimeMax home">
          <AnimaxLogo className="animemax-logo-topbar" />
        </Link>

        {/* Status chip / Welcome on desktop */}
        {isBuyerSignedIn ? (
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-xs font-semibold text-[#111111] font-['Inter'] truncate">
            <span className="w-2 h-2 rounded-[12px] bg-emerald-500 flex-shrink-0" />
            <span className="hidden sm:inline truncate">
              {buyerOrdersCount > 0 ? `${buyerOrdersCount} Orders · Buyer Account` : 'Active Buyer Account'}
            </span>
          </div>
        ) : (
          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-xs font-medium text-[#111111] font-['Inter']">
            <span>Welcome to AnimeMax</span>
          </div>
        )}
      </div>

      {/* Right: Cart + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

        {/* Cart button — 44px min touch target */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] hover:bg-[#F1F1EE] text-[#111111] transition-colors flex-shrink-0"
          aria-label="View Shopping Cart"
          style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#DC2626] text-white text-[10px] font-bold w-5 h-5 rounded-[12px] flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>

        {/* Buyer Avatar or Sign In */}
        {isBuyerSignedIn ? (
          <Link
            to="/account"
            className="flex items-center gap-2 p-1 sm:pr-3 rounded-[12px] hover:bg-[#F8F8F6] border border-transparent hover:border-[#E5E5E5] transition-colors"
            title="Account settings"
          >
            <div className="w-8 h-8 rounded-[12px] bg-[#111111] text-white flex items-center justify-center text-xs font-bold overflow-hidden border border-[#E5E5E5] font-['Inter']">
              {mockUser.imageUrl ? (
                <img src={mockUser.imageUrl} alt={mockUser.fullName || 'User'} className="w-full h-full object-cover" />
              ) : (
                mockUser.fullName?.charAt(0) || 'U'
              )}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-[#111111] max-w-[120px] truncate font-['Inter']">
              {mockUser.fullName}
            </span>
          </Link>
        ) : (
          <Link
            to="/signin"
            className="sf-btn-primary whitespace-nowrap flex-shrink-0"
            style={{ height: '44px', minHeight: '44px', fontSize: '13px', padding: '0 0.75rem' }}
          >
            Sign In
          </Link>
        )}

      </div>
    </header>
  )
}
