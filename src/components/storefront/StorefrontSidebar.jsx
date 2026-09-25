import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Flame, 
  Sparkles, 
  Box, 
  Image as ImageIcon, 
  Shirt, 
  Gem, 
  Plus, 
  LogOut, 
  LogIn, 
  ChevronRight, 
  X, 
  Check, 
  Package,
  Bell
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'

export default function StorefrontSidebar() {
  const { mockUser, setMockUser, orders, products } = useApp()
  const location = useLocation()
  const navigate = useNavigate()

  // Modal states for Quick Actions
  const [modalType, setModalType] = useState(null) // 'request' | 'restock' | null
  const [requestItemName, setRequestItemName] = useState('')
  const [requestAnime, setRequestAnime] = useState('')
  const [restockEmail, setRestockEmail] = useState('')
  const [selectedRestockProduct, setSelectedRestockProduct] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!requestItemName.trim()) return
    showToast(`Request received for "${requestItemName}"! We'll search Japanese suppliers.`)
    setRequestItemName('')
    setRequestAnime('')
    setModalType(null)
  }

  const handleRestockSubmit = (e) => {
    e.preventDefault()
    if (!restockEmail.trim()) return
    showToast(`Alert set! We will notify ${restockEmail} when restocked.`)
    setRestockEmail('')
    setModalType(null)
  }

  // Categories config
  const navCategories = [
    { name: 'Popular Products', query: 'category=figures', icon: Flame },
    { name: 'Explore New', query: '', icon: Sparkles, isExplore: true },
    { name: 'Figures & Statues', query: 'category=figures', icon: Box },
    { name: 'Posters & Wall Art', query: 'category=posters', icon: ImageIcon },
    { name: 'Apparel', query: 'category=clothing', icon: Shirt },
    { name: 'Accessories', query: 'category=accessories', icon: Gem },
  ]

  const currentSearch = location.search

  const isCatActive = (cat) => {
    if (cat.isExplore) {
      return location.pathname === '/' && (!currentSearch || currentSearch === '?category=all')
    }
    return currentSearch.includes(cat.query)
  }

  // Filter 1-2 recent orders for signed-in buyers
  const recentOrders = (orders || []).slice(0, 2)
  const isBuyerSignedIn = mockUser && mockUser.role !== 'guest'

  return (
    <>
      <aside className="w-64 xl:w-72 flex-shrink-0">
        <div className="sticky top-6 bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col justify-between h-[calc(100vh-3rem)] overflow-y-auto scrollbar-none">
          
          {/* Top Section: Logo & Category Navigation */}
          <div className="space-y-6">
            
            {/* Logo / Wordmark */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#111111] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#111111] font-display">
                  AnimeMax
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B6B6B]">
                  Tokyo Merch Store
                </span>
              </div>
            </Link>

            {/* Category Navigation */}
            <nav className="space-y-1">
              {navCategories.map((cat) => {
                const active = isCatActive(cat)
                const IconComponent = cat.icon

                return (
                  <Link
                    key={cat.name}
                    to={cat.query ? `/?${cat.query}` : '/'}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#111111] text-white shadow-sm'
                        : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-black/5'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${active ? 'text-white' : 'text-[#6B6B6B]'}`} />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Quick Actions Mini-Section */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-2 px-2">
                Quick Actions
              </p>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setModalType('request')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-black/5 transition-colors text-left group"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span>Request a product</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalType('restock')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#111111] hover:bg-black/5 transition-colors text-left group"
                >
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors">
                    <Bell className="w-3 h-3" />
                  </div>
                  <span>Notify me on restock</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Recent Orders Mini-List (If Buyer is signed in) */}
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                  Recent Orders
                </p>
                {isBuyerSignedIn && recentOrders.length > 0 && (
                  <Link to="/orders" className="text-[11px] text-[#111111] hover:underline font-semibold">
                    See all
                  </Link>
                )}
              </div>

              {isBuyerSignedIn ? (
                recentOrders.length > 0 ? (
                  <div className="space-y-2.5">
                    {recentOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="p-2.5 rounded-2xl bg-[#E3EFE1]/40 border border-black/5 flex items-center gap-2.5"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white overflow-hidden border border-black/5 flex-shrink-0 flex items-center justify-center">
                          {order.order_items?.[0]?.product?.image_url ? (
                            <img 
                              src={order.order_items[0].product.image_url} 
                              alt="order thumb" 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#111111] truncate">
                            Order #{order.id.slice(0, 6)}
                          </p>
                          <p className="text-[10px] text-[#6B6B6B]">
                            {formatPrice(order.total_amount)} · {order.status}
                          </p>
                        </div>
                        <Link 
                          to={`/order-confirmation/${order.id}`}
                          className="text-[10px] font-semibold text-[#111111] bg-white px-2 py-1 rounded-full border border-black/10 hover:bg-gray-50 flex items-center"
                          title="View order details"
                        >
                          View
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#6B6B6B] px-2 italic">
                    No orders placed yet.
                  </p>
                )
              ) : (
                <div className="p-3 rounded-2xl bg-gray-50 text-center">
                  <p className="text-xs text-[#6B6B6B] mb-2">
                    Sign in to track orders
                  </p>
                  <Link
                    to="/signin"
                    className="inline-block px-3 py-1 rounded-full bg-[#111111] text-white text-[11px] font-medium hover:bg-black transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Section: Auth / Account Status */}
          <div className="pt-4 border-t border-gray-100">
            {isBuyerSignedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {mockUser.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#111111] truncate">{mockUser.fullName}</p>
                    <p className="text-[10px] text-[#6B6B6B] truncate">Signed In</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMockUser({ id: null, fullName: 'Guest Visitor', role: 'guest' })
                    showToast('Logged out of buyer account')
                  }}
                  className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#111111] hover:bg-black/5 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-[#111111] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in to Account</span>
              </Link>
            )}
          </div>

        </div>
      </aside>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Action Modal: Request a Product */}
      {modalType === 'request' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#E3EFE1] flex items-center justify-center text-[#111111] mb-4">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#111111]">Request an Anime Product</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 mb-4">
              Can't find your favorite figure or hoodie? Tell us what you're looking for and our Japan team will source it for you!
            </p>
            <form onSubmit={handleRequestSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Product Name / Character</label>
                <input
                  type="text"
                  required
                  placeholder="Item or figure name..."
                  value={requestItemName}
                  onChange={(e) => setRequestItemName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Anime Series (Optional)</label>
                <input
                  type="text"
                  placeholder="Anime series or franchise..."
                  value={requestAnime}
                  onChange={(e) => setRequestAnime(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-black"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#6B6B6B] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs font-semibold text-white shadow-sm"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Action Modal: Notify on Restock */}
      {modalType === 'restock' && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-black/5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-2xl bg-[#F5E7A8] flex items-center justify-center text-[#111111] mb-4">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#111111]">Get Restock Notification</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 mb-4">
              Enter your email or WhatsApp number and we will ping you as soon as sold-out stock arrives.
            </p>
            <form onSubmit={handleRestockSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Select Item</label>
                <select
                  value={selectedRestockProduct}
                  onChange={(e) => setSelectedRestockProduct(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-black"
                >
                  <option value="">All Upcoming Restocks</option>
                  {(products || []).map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="Email address or WhatsApp number..."
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-black"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="flex-1 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-[#6B6B6B] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs font-semibold text-white shadow-sm"
                >
                  Set Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
