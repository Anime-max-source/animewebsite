import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Fire,
  Sparkle,
  Cube,
  Image as PhImage,
  TShirt,
  Diamond,
  Car,
  Truck,
  Lightning,
  Sword,
  Radio,
  User,
  Plus,
  SignOut,
  SignIn,
  CaretRight,
  X,
  Check,
  Package,
  Bell
} from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { formatPrice } from '../../utils/formatPrice'
import AnimaxLogo from './AnimaxLogo'
import { cldUrl } from '../../lib/cloudinary'

export default function StorefrontSidebar() {
  const { mockUser, setMockUser, logout, orders, products, categories = [] } = useApp()
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
    showToast(`Request received for "${requestItemName}"! We'll search our supplier network.`)
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

  // Category Icon Resolver matching the 8 real categories
  const getCategoryIcon = (slug, name, icon) => {
    const s = (slug || name || '').toLowerCase()
    const ic = (icon || '').toLowerCase()
    if (ic === 'car' || s.includes('hot-wheel') || s.includes('wheel')) return Car
    if (ic === 'truck' || s.includes('die-cast') || s.includes('cast')) return Truck
    if (ic === 'bolt' || ic === 'lightning' || s.includes('marvel')) return Lightning
    if (ic === 'sparkles' || ic === 'sparkle' || s.includes('anime')) return Sparkle
    if (ic === 'image' || s.includes('poster') || s.includes('decor') || s.includes('wall')) return PhImage
    if (ic === 'sword' || s.includes('katana') || s.includes('blade')) return Sword
    if (ic === 'radio' || s.includes('rc-car') || s.includes('rc')) return Radio
    if (ic === 'user' || s.includes('shinchan') || s.includes('shin')) return User
    if (s.includes('figure') || s.includes('statue')) return Cube
    if (s.includes('cloth') || s.includes('apparel') || s.includes('hoodie')) return TShirt
    if (s.includes('access') || s.includes('keychain')) return Diamond
    return Sparkle
  }

  // Categories config — Phosphor icons (24px)
  const navCategories = React.useMemo(() => {
    const top = [
      { name: 'Popular Products', query: 'category=hot-wheels', icon: Fire },
      { name: 'Explore New', query: '', icon: Sparkle, isExplore: true },
    ]
    const sorted = [...categories].sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    const dynamicCats = sorted.map(c => ({
      name: c.name,
      query: `category=${c.slug || c.id}`,
      icon: getCategoryIcon(c.slug, c.name, c.icon)
    }))
    return [...top, ...dynamicCats]
  }, [categories])

  const currentSearch = location.search

  const isCatActive = (cat) => {
    if (cat.isExplore) {
      return location.pathname === '/' && (!currentSearch || currentSearch === '?category=all')
    }
    return currentSearch.includes(cat.query)
  }


  const isBuyerSignedIn = mockUser && mockUser.role !== 'guest'
  const myOrders = isBuyerSignedIn && mockUser?.id
    ? (orders || []).filter((o) => o.user_id === mockUser.id)
    : []
  const recentOrders = myOrders.slice(0, 2)

  return (
    <>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-56 xl:w-64 flex-shrink-0 lg:pr-6">
        <div
          className="sticky top-6 flex flex-col"
          style={{
            /* 100dvh accounts for mobile browser UI chrome; vh is fallback */
            height: 'calc(100dvh - 3rem)',
          }}
        >

          {/* Logo — Fixed height matching StorefrontTopBar h-14 (56px) and mb-6 */}
          <div className="h-14 flex items-center flex-shrink-0 mb-6 px-1">
            <Link to="/" className="flex items-center flex-shrink-0" aria-label="AnimeMax home">
              <AnimaxLogo className="text-2xl" />
            </Link>
          </div>

          {/* ── Scrollable Navigation Body ─────────────────────────────── */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-6 custom-scrollbar">

            {/* ── Category Navigation ────────────────────────────────────── */}
            <nav className="flex flex-col gap-0.5">
            {navCategories.map((cat) => {
              const active = isCatActive(cat)
              const IconComponent = cat.icon

              return (
                <Link
                  key={cat.name}
                  to={cat.query ? `/?${cat.query}` : '/'}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#111111] text-white'
                      : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6]'
                  ].join(' ')}
                >
                  <IconComponent
                    size={20}
                    weight={active ? 'bold' : 'regular'}
                    className={active ? 'text-white' : 'text-[#6B6B6B]'}
                  />
                  <span className="truncate font-['Inter']">{cat.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="border-t border-[#E5E5E5]" />

          {/* ── Quick Actions ──────────────────────────────────────────── */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] mb-2 px-1 font-['Inter']">
              Quick Actions
            </p>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setModalType('request')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[#111111] hover:bg-[#F8F8F6] transition-colors text-left font-['Inter']"
              >
                <Plus size={20} className="text-[#6B6B6B] flex-shrink-0" />
                <span>Request a product</span>
              </button>

              <button
                type="button"
                onClick={() => setModalType('restock')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-sm font-medium text-[#111111] hover:bg-[#F8F8F6] transition-colors text-left font-['Inter']"
              >
                <Bell size={20} className="text-[#6B6B6B] flex-shrink-0" />
                <span>Notify me on restock</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#E5E5E5]" />

          {/* ── Recent Orders ──────────────────────────────────────────── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B6B6B] font-['Inter']">
                Recent Orders
              </p>
              {isBuyerSignedIn && recentOrders.length > 0 && (
                <Link
                  to="/orders"
                  className="text-[11px] text-[#DC2626] hover:underline font-semibold font-['Inter']"
                >
                  See all
                </Link>
              )}
            </div>

            {isBuyerSignedIn ? (
              recentOrders.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-2.5 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center gap-2.5"
                    >
                      <div className="w-9 h-9 rounded-[12px] bg-white border border-[#E5E5E5] flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {(order.items?.[0]?.image_url || order.order_items?.[0]?.product?.image_url) ? (
                          <img
                            src={cldUrl(order.items?.[0]?.image_url || order.order_items[0].product.image_url, { width: 96, height: 96, crop: 'fill' })}
                            alt="order thumb"
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package size={20} className="text-[#6B6B6B]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#111111] truncate font-['Inter']">
                          Order #{order.id.slice(0, 6)}
                        </p>
                        <p className="text-[10px] text-[#6B6B6B] font-['Inter']">
                          {formatPrice(order.total_amount)} · {order.status}
                        </p>
                      </div>
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="text-[10px] font-semibold text-[#111111] bg-white px-2 py-1 rounded-[12px] border border-[#E5E5E5] hover:bg-[#F8F8F6] flex items-center font-['Inter']"
                        title="View order details"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6B6B6B] px-1 font-['Inter']">
                  No orders placed yet.
                </p>
              )
            ) : (
              <div className="p-4 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] text-center">
                <p className="text-xs text-[#6B6B6B] mb-3 font-['Inter']">
                  Sign in to track orders
                </p>
                <Link
                  to="/signin"
                  className="sf-btn-primary text-xs h-8 px-4 rounded-[12px]"
                  style={{ height: '32px', minHeight: 'unset' }}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* ── Bottom: Auth / Account ─────────────────────────────────── */}
          <div className="pt-4 border-t border-[#E5E5E5]">
            {isBuyerSignedIn ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-[12px] bg-[#111111] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#E5E5E5] font-['Inter']">
                    {mockUser.imageUrl ? (
                      <img src={mockUser.imageUrl} alt={mockUser.fullName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      mockUser.fullName?.charAt(0) || 'U'
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#111111] truncate font-['Inter']">{mockUser.fullName}</p>
                    <p className="text-[10px] text-[#6B6B6B] font-['Inter']">Signed In</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout()
                    showToast('Logged out of buyer account')
                  }}
                  className="p-2 rounded-[12px] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6] transition-colors"
                  title="Log out"
                >
                  <SignOut size={20} />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="flex items-center gap-2 w-full py-2.5 px-3 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] hover:bg-[#F1F1EE] text-sm font-medium text-[#111111] transition-colors font-['Inter']"
              >
                <SignIn size={20} className="text-[#6B6B6B]" />
                <span>Sign in to Account</span>
              </Link>
            )}
          </div>

          </div>
        </div>
      </aside>

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111111] text-white px-5 py-3 rounded-[12px] border border-[#333] flex items-center gap-3 text-sm font-medium sf-animate-slide-up font-['Inter']">
          <Check size={16} className="text-[#DC2626] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Modal: Request a Product ───────────────────────────────────── */}
      {modalType === 'request' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sf-animate-fade-in"
          style={{ background: 'rgba(17,17,17,0.4)' }}
          onClick={() => setModalType(null)}
        >
          <div
            className="bg-white rounded-[12px] border border-[#E5E5E5] max-w-md w-full p-6 relative sf-animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 rounded-[12px] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center mb-4">
              <Plus size={24} className="text-[#111111]" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] font-['Syne']">Request a Collectible or Product</h3>
            <p className="text-sm text-[#6B6B6B] mt-1 mb-5 font-['Inter']">
              Can't find your favorite collectible or item? Tell us what you're looking for and our team will check availability.
            </p>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5 font-['Inter']">Product Name / Character</label>
                <input
                  type="text"
                  required
                  placeholder="Item or figure name..."
                  value={requestItemName}
                  onChange={(e) => setRequestItemName(e.target.value)}
                  className="sf-input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5 font-['Inter']">Anime Series (Optional)</label>
                <input
                  type="text"
                  placeholder="Anime series or franchise..."
                  value={requestAnime}
                  onChange={(e) => setRequestAnime(e.target.value)}
                  className="sf-input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="sf-btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sf-btn-primary flex-1"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Notify on Restock ───────────────────────────────────── */}
      {modalType === 'restock' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sf-animate-fade-in"
          style={{ background: 'rgba(17,17,17,0.4)' }}
          onClick={() => setModalType(null)}
        >
          <div
            className="bg-white rounded-[12px] border border-[#E5E5E5] max-w-md w-full p-6 relative sf-animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 rounded-[12px] text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F8F8F6] transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-10 h-10 rounded-[12px] bg-[#F8F8F6] border border-[#E5E5E5] flex items-center justify-center mb-4">
              <Bell size={24} className="text-[#111111]" />
            </div>
            <h3 className="text-xl font-bold text-[#111111] font-['Syne']">Get Restock Notification</h3>
            <p className="text-sm text-[#6B6B6B] mt-1 mb-5 font-['Inter']">
              Enter your email or WhatsApp number and we will ping you as soon as sold-out stock arrives.
            </p>
            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5 font-['Inter']">Select Item</label>
                <select
                  value={selectedRestockProduct}
                  onChange={(e) => setSelectedRestockProduct(e.target.value)}
                  className="sf-input"
                  style={{ height: '48px' }}
                >
                  <option value="">All Upcoming Restocks</option>
                  {(products || []).map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#111111] mb-1.5 font-['Inter']">Email or WhatsApp Number</label>
                <input
                  type="text"
                  required
                  placeholder="Email address or WhatsApp number..."
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  className="sf-input"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="sf-btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sf-btn-primary flex-1"
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
