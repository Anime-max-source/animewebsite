import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  UserCircle,
  List,
  X,
  Info,
  ArrowRight,
  ShieldCheck,
  Truck,
  ChatCircle
} from '@phosphor-icons/react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../context/AppContext'
import AnimaxLogo from './AnimaxLogo'

export default function StorefrontTopBar({ onMobileMenuToggle }) {
  const { cartCount, setIsCartOpen } = useCart()
  const { mockUser, orders } = useApp()
  const [activeToggle, setActiveToggle] = useState('shop') // 'shop' | 'about'
  const [aboutModalOpen, setAboutModalOpen] = useState(false)

  const isBuyerSignedIn = mockUser && mockUser.role !== 'guest'
  const buyerOrdersCount = isBuyerSignedIn && mockUser?.id && orders
    ? orders.filter((o) => o.user_id === mockUser.id).length
    : 0

  const handleToggle = (tab) => {
    setActiveToggle(tab)
    if (tab === 'about') {
      setAboutModalOpen(true)
    }
  }

  return (
    <>
      {/* ── Top Bar ───────────────────────────────────────────────────── */}
      <header className="w-full bg-white border border-[#E5E5E5] rounded-[12px] px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 mb-6 min-w-0" style={{ minHeight: '56px' }}>

        {/* Left: Mobile menu + Brand logo / Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden rounded-[12px] text-[#111111] hover:bg-[#F8F8F6] transition-colors flex-shrink-0"
            aria-label="Open navigation menu"
            style={{ minWidth: '44px', minHeight: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <List size={20} />
          </button>

          {/* On mobile: display AnimaxLogo directly in the top bar */}
          <Link to="/" className="lg:hidden flex items-center flex-shrink-0" aria-label="AnimeMax home">
            {/* icon-only on very narrow screens, full wordmark on wider */}
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

        {/* Center: Shop / About toggle (hidden on narrow mobile screens) */}
        <div className="hidden sm:flex items-center p-1 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex-shrink-0">
          <button
            type="button"
            onClick={() => handleToggle('shop')}
            className={[
              'px-4 sm:px-5 py-1.5 rounded-[12px] text-xs font-semibold transition-all font-[\'Inter\']',
              activeToggle === 'shop'
                ? 'bg-white text-[#111111] border border-[#E5E5E5]'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            ].join(' ')}
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleToggle('about')}
            className={[
              'px-4 sm:px-5 py-1.5 rounded-[12px] text-xs font-semibold transition-all font-[\'Inter\']',
              activeToggle === 'about'
                ? 'bg-white text-[#111111] border border-[#E5E5E5]'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            ].join(' ')}
          >
            About
          </button>
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

      {/* ── About Modal ────────────────────────────────────────────────── */}
      {aboutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sf-animate-fade-in"
          style={{ background: 'rgba(17,17,17,0.4)' }}
        >
          <div className="bg-white rounded-[12px] border border-[#E5E5E5] max-w-lg w-full p-6 sm:p-8 relative sf-animate-slide-up">
            <button
              onClick={() => {
                setAboutModalOpen(false)
                setActiveToggle('shop')
              }}
              className="absolute top-4 right-4 p-2 rounded-[12px] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center mb-4">
              <Info size={24} className="text-[#DC2626]" />
            </div>

            <h3 className="text-xl font-bold text-[#111111] font-['Syne']">About AnimeMax Store</h3>
            <p className="text-sm text-[#6B6B6B] mt-1 mb-5 font-['Inter']">
              Authentic Anime Statues, Collector Hoodies and Premium Accessories.
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5]">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={20} className="text-[#111111] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] mb-1 font-['Inter']">Direct Tokyo Sourcing</h4>
                    <p className="text-sm text-[#6B6B6B] font-['Inter']">
                      Every figure and prop is officially licensed and imported directly from Akihabara manufacturers (Bandai, Good Smile Company, Kotobukiya).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5]">
                <div className="flex items-start gap-3">
                  <ChatCircle size={20} className="text-[#111111] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] mb-1 font-['Inter']">Manual UPI Payment on WhatsApp</h4>
                    <p className="text-sm text-[#6B6B6B] font-['Inter']">
                      Order on the storefront. Receive your instant UPI QR on WhatsApp, verify your order, and pay via GPay, PhonePe, or Paytm.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5]">
                <div className="flex items-start gap-3">
                  <Truck size={20} className="text-[#111111] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-[#111111] mb-1 font-['Inter']">Armored Packaging</h4>
                    <p className="text-sm text-[#6B6B6B] font-['Inter']">
                      Triple-layer bubble wrap and reinforced outer cartons ensure your prized merchandise reaches you in pristine condition.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAboutModalOpen(false)
                  setActiveToggle('shop')
                }}
                className="sf-btn-primary"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
