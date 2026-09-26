import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Flame, 
  Sparkles, 
  ChevronRight,
  Shield,
  Info
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../context/AppContext'

export default function StorefrontTopBar({ onMobileMenuToggle }) {
  const { cartCount, setIsCartOpen } = useCart()
  const { mockUser, orders } = useApp()
  const [activeToggle, setActiveToggle] = useState('shop') // 'shop' | 'about'
  const [aboutModalOpen, setAboutModalOpen] = useState(false)

  const isBuyerSignedIn = mockUser && mockUser.role !== 'guest'
  const buyerOrdersCount = orders ? orders.length : 0

  const handleToggle = (tab) => {
    setActiveToggle(tab)
    if (tab === 'about') {
      setAboutModalOpen(true)
    }
  }

  return (
    <>
      <header className="w-full bg-white rounded-full px-4 sm:px-6 py-2.5 shadow-sm border border-black/5 flex items-center justify-between gap-3">
        
        {/* Left: Summary Chip & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile menu button for small screens */}
          <button
            type="button"
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-full text-[#111111] hover:bg-black/5 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Order/Account summary chip */}
          {isBuyerSignedIn ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3EFE1] border border-black/5 text-xs font-semibold text-[#111111]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline">
                {buyerOrdersCount > 0 ? `${buyerOrdersCount} Orders · Last 7 days` : 'Active Buyer Account'}
              </span>
              <span className="sm:hidden font-bold">
                {buyerOrdersCount} Orders
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100/80 text-xs font-medium text-[#111111]">
              <span>👋</span>
              <span className="hidden sm:inline">Welcome to AnimeMax</span>
              <span className="sm:hidden">Welcome</span>
            </div>
          )}
        </div>

        {/* Center: Pill Toggle "Shop" / "About" */}
        <div className="flex items-center p-1 rounded-full bg-gray-100/90 border border-black/5">
          <button
            type="button"
            onClick={() => handleToggle('shop')}
            className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeToggle === 'shop'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => handleToggle('about')}
            className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeToggle === 'about'
                ? 'bg-white text-[#111111] shadow-sm'
                : 'text-[#6B6B6B] hover:text-[#111111]'
            }`}
          >
            About
          </button>
        </div>

        {/* Right: Social proof avatars + Cart + Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Social Proof: Stack of mini avatars */}
          <div className="hidden xl:flex items-center gap-2 pr-2 border-r border-gray-200">
            <div className="flex -space-x-2 overflow-hidden">
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Shopper 1"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Shopper 2"
              />
              <img
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="Shopper 3"
              />
            </div>
            <span className="text-[11px] font-medium text-[#6B6B6B]">
              2.4k otaku shopping
            </span>
          </div>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] transition-all group"
            aria-label="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#111111] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </button>

          {/* Buyer Avatar + Name or Sign In Button */}
          {isBuyerSignedIn ? (
            <Link
              to="/account"
              className="flex items-center gap-2 p-1 sm:pr-3 rounded-full hover:bg-gray-100 transition-colors"
              title="Account settings"
            >
              <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold overflow-hidden border border-black/10">
                {mockUser.imageUrl ? (
                  <img src={mockUser.imageUrl} alt={mockUser.fullName || 'User'} className="w-full h-full object-cover" />
                ) : (
                  mockUser.fullName?.charAt(0) || 'U'
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#111111] max-w-[120px] truncate">
                {mockUser.fullName}
              </span>
            </Link>
          ) : (
            <Link
              to="/signin"
              className="px-4 py-1.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
            >
              Sign In
            </Link>
          )}

        </div>

      </header>

      {/* About AnimeMax Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-black/5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => {
                setAboutModalOpen(false)
                setActiveToggle('shop')
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#C9E4C5] flex items-center justify-center text-[#111111] mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-[#111111] font-display">About AnimeMax Store</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 mb-4">
              Authentic Anime Statues, Collector Hoodies & Premium Accessories.
            </p>

            <div className="space-y-3 text-xs text-[#111111] leading-relaxed">
              <div className="p-3 rounded-2xl bg-gray-50 border border-black/5">
                <h4 className="font-bold mb-1">🎌 Direct Tokyo Sourcing</h4>
                <p className="text-[#6B6B6B]">
                  Every figure and prop is officially licensed and imported directly from Akihabara manufacturers (Bandai, Good Smile Company, Kotobukiya).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-black/5">
                <h4 className="font-bold mb-1">⚡ Zero Upfront Payment Friction</h4>
                <p className="text-[#6B6B6B]">
                  Order with 1-click on the storefront. Receive your instant UPI QR on WhatsApp, verify your order with the shopkeeper, and pay seamlessly via GPay, PhonePe, or Paytm.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-gray-50 border border-black/5">
                <h4 className="font-bold mb-1">📦 Armored Packaging</h4>
                <p className="text-[#6B6B6B]">
                  Collector boxes arrive mint. Triple-layer bubble wrap and reinforced outer cartons ensure your prized merchandise reaches you in pristine condition.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAboutModalOpen(false)
                  setActiveToggle('shop')
                }}
                className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-black transition-colors"
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
