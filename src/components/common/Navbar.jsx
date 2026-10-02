import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  ShoppingBag, 
  User, 
  Shield, 
  Search, 
  Menu, 
  X, 
  Flame, 
  ChevronDown, 
  Package, 
  LogOut,
  Sparkles
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useApp } from '../../context/AppContext'
import { isClerkConfigured } from '../../lib/clerkClient'

export default function Navbar() {
  const { cartCount, setIsCartOpen } = useCart()
  const { mockUser, setMockUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const navCategories = [
    { name: 'All Products', path: '/' },
    { name: 'Figures', path: '/?category=figures' },
    { name: 'Clothing', path: '/?category=clothing' },
    { name: 'Posters', path: '/?category=posters' },
    { name: 'Accessories', path: '/?category=accessories' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.search
    return location.search.includes(path.replace('/?', ''))
  }

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-[#0a0c14]/90">
      {/* Top micro bar for notices */}
      <div className="bg-gradient-to-r from-violet-950/60 via-slate-900 to-rose-950/60 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>⚡ Fast Dispatch • Safe UPI Payments on WhatsApp</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
          <span>Curated Collector Merchandise</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] p-0.5 shadow-glow-primary group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0a0c14] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#ff3366] group-hover:text-rose-400 transition-colors" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-wider anime-gradient-text font-display">
                ANIME<span className="text-white">MAX</span>
              </span>
              <span className="block text-[9px] tracking-widest uppercase font-semibold text-slate-400 -mt-1">
                Official Merch
              </span>
            </div>
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(cat.path)
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search figures, hoodies, posters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121624] border border-slate-700/80 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#ff3366] focus:ring-1 focus:ring-[#ff3366] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            


            {/* Buyer Account / Login Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-1.5 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800 transition-colors"
                title="Account"
              >
                <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-rose-400">
                  {mockUser.role === 'guest' ? <User className="w-4 h-4 text-slate-400" /> : mockUser.fullName.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 glass-dropdown rounded-xl shadow-2xl p-2 border border-slate-700/70 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <p className="text-xs font-semibold text-white truncate">{mockUser.fullName}</p>
                    <p className="text-[11px] text-slate-400 capitalize">Role: {mockUser.role}</p>
                  </div>

                  {mockUser.role === 'guest' ? (
                    <>
                      <Link
                        to="/signin"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                      >
                        <User className="w-4 h-4" /> Sign In / Sign Up
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800/60 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" /> My Profile & Address
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800/60 hover:text-white transition-colors"
                      >
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                    </>
                  )}


                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-r from-rose-900/40 to-violet-900/40 hover:from-rose-900/60 hover:to-violet-900/60 border border-rose-700/40 text-rose-300 hover:text-white shadow-glow-primary transition-all group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff3366] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0c14] shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#121624] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </form>

            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 text-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between">
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-slate-300 hover:text-white flex items-center gap-1.5 py-1"
              >
                <Package className="w-4 h-4" /> Order History
              </Link>

            </div>
          </div>
        )}

      </div>
    </header>
  )
}
