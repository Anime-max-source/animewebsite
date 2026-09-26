import React, { useState, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { 
  Heart, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Search, 
  Sparkles, 
  Flame, 
  ShoppingBag, 
  Check, 
  X,
  ArrowUpRight
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'

export default function Home() {
  const { products, banners = {} } = useApp()
  const { addToCart, items } = useCart()

  const heroBanner = banners?.hero || {}
  const weeklyDropBanner = banners?.weekly_drop || {}
  const collectorSpotlightBanner = banners?.collector_spotlight || {}
  const styleEditorialBanner = banners?.style_editorial || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // URL State
  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('q') || ''

  // UI State
  const [showSearchInput, setShowSearchInput] = useState(Boolean(searchQuery))
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [showFiltersModal, setShowFiltersModal] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  
  // Local Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('animemax_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const toggleWishlist = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
      localStorage.setItem('animemax_wishlist', JSON.stringify(next))
      return next
    })
  }

  // Slot-based Product Placements (Admin controlled)
  const heroProduct = useMemo(() => {
    return products.find(p => p.display_section === 'hero') || null
  }, [products])

  const spotlightProduct = useMemo(() => {
    return products.find(p => p.display_section === 'spotlight') || null
  }, [products])

  const gridProducts = useMemo(() => {
    return products
      .filter(p => !p.display_section || p.display_section === 'grid')
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
  }, [products])

  // Favourites Mini-Carousel state
  const [favIndex, setFavIndex] = useState(0)
  const favouriteProducts = useMemo(() => {
    const assignedFavs = products.filter(p => p.display_section === 'favourites')
    if (assignedFavs.length > 0) {
      return assignedFavs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    }
    return [...products]
      .filter(p => !p.display_section || p.display_section === 'grid')
      .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999))
      .slice(0, 6)
  }, [products])

  const nextFav = () => {
    if (favouriteProducts.length <= 2) return
    setFavIndex(prev => (prev + 2 >= favouriteProducts.length ? 0 : prev + 2))
  }

  const prevFav = () => {
    if (favouriteProducts.length <= 2) return
    setFavIndex(prev => (prev - 2 < 0 ? Math.max(0, favouriteProducts.length - 2) : prev - 2))
  }

  const currentFavs = favouriteProducts.slice(favIndex, favIndex + 2)

  // Filter Categories - includes All, baseline categories, and any product series
  const filterPills = useMemo(() => {
    const basePills = [
      { id: 'all', label: 'All' },
      { id: 'figures', label: 'Figures' },
      { id: 'posters', label: 'Posters' },
      { id: 'clothing', label: 'Apparel' },
      { id: 'accessories', label: 'Accessories' },
    ]
    const seriesSet = new Set()
    products.forEach(p => {
      const s = p.series || p.category
      if (s && !['figures', 'posters', 'clothing', 'accessories'].includes(s.toLowerCase())) {
        seriesSet.add(s)
      }
    })
    const dynamicSeries = Array.from(seriesSet).sort().map(s => ({
      id: s.toLowerCase(),
      label: s
    }))
    return [...basePills, ...dynamicSeries]
  }, [products])

  const handleCategoryChange = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', catId)
    }
    setSearchParams(searchParams)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (localSearch.trim()) {
      searchParams.set('q', localSearch.trim())
    } else {
      searchParams.delete('q')
    }
    setSearchParams(searchParams)
  }

  // Filtered Catalog products (respecting sort_order / HW# and display_section)
  const filteredCatalog = useMemo(() => {
    return products.filter((item) => {
      const itemCat = (item.category || '').toLowerCase()
      const itemSeries = (item.series || '').toLowerCase()
      const active = activeCategory.toLowerCase()
      const matchesCat = active === 'all' || itemCat === active || itemSeries === active

      const q = searchQuery.toLowerCase().trim()
      const matchesQuery = !q || 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.series && item.series.toLowerCase().includes(q)) ||
        (item.edition && item.edition.toLowerCase().includes(q)) ||
        (item.color && item.color.toLowerCase().includes(q)) ||
        (item.hw_num && String(item.hw_num) === q) ||
        (item.hw_num && String(item.hw_num).includes(q)) ||
        (item.sort_order && String(item.sort_order).includes(q))

      const matchesStock = !inStockOnly || (item.in_stock && item.stock > 0)
      return matchesCat && matchesQuery && matchesStock
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'hw-asc') return (a.sort_order ?? a.hw_num ?? 999) - (b.sort_order ?? b.hw_num ?? 999)
      if (sortBy === 'hw-desc') return (b.sort_order ?? b.hw_num ?? 999) - (a.sort_order ?? a.hw_num ?? 999)
      // Default 'featured' sorting: respect sort_order (lower = first), then created_at desc
      const orderA = a.sort_order !== undefined && a.sort_order !== null ? a.sort_order : 999
      const orderB = b.sort_order !== undefined && b.sort_order !== null ? b.sort_order : 999
      if (orderA !== orderB) return orderA - orderB
      return new Date(b.created_at || 0) - new Date(a.created_at || 0)
    })
  }, [products, activeCategory, searchQuery, inStockOnly, sortBy])

  // Featured right-column picks from catalog
  const pickProduct1 = useMemo(() => {
    return gridProducts[0] || products.find(p => p.id !== heroProduct?.id && p.id !== spotlightProduct?.id) || products[0] || null
  }, [products, gridProducts, heroProduct, spotlightProduct])

  const pickProduct2 = useMemo(() => {
    return gridProducts[1] || products.find(p => p.id !== heroProduct?.id && p.id !== spotlightProduct?.id && p.id !== pickProduct1?.id) || products[1] || null
  }, [products, gridProducts, heroProduct, spotlightProduct, pickProduct1])

  return (
    <div className="space-y-6">

      {/* 3. Page Header — "Explore" */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Title & Filter Pills */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight font-display">
            Explore
          </h1>

          {/* Row of rounded filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filterPills.map((pill) => {
              const isActive = activeCategory === pill.id
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => handleCategoryChange(pill.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-[#111111] shadow-sm border-b-2 border-[#111111]'
                      : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-white/50'
                  }`}
                >
                  {pill.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right-aligned: "Filters" button + Search icon button */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          
          {/* Search Toggle / Input */}
          {showSearchInput ? (
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                autoFocus
                placeholder="Search products..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="bg-white rounded-full pl-9 pr-8 py-2 text-xs text-[#111111] border border-black/5 shadow-sm focus:outline-none focus:ring-1 focus:ring-black w-48 sm:w-60"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
              <button
                type="button"
                onClick={() => {
                  setShowSearchInput(false)
                  setLocalSearch('')
                  searchParams.delete('q')
                  setSearchParams(searchParams)
                }}
                className="absolute right-2.5 p-1 text-gray-400 hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowSearchInput(true)}
              className="p-2.5 rounded-full bg-white text-[#111111] shadow-sm border border-black/5 hover:bg-gray-50 transition-colors"
              title="Search store"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Filters Button */}
          <button
            type="button"
            onClick={() => setShowFiltersModal(true)}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#111111] text-xs font-bold shadow-sm border border-black/5 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {(inStockOnly || sortBy !== 'featured') && (
              <span className="w-2 h-2 rounded-full bg-[#111111]" />
            )}
          </button>

        </div>

      </div>

      {/* 4. Hero & Promo Cards (Mixed Grid, Masonry-Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Row 1, Left 2 cols: Hero Banner Slot (Dynamic or Promo Fallback) */}
        {heroProduct ? (
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-[#C9E4C5] p-7 sm:p-9 flex flex-col justify-between min-h-[340px] sm:min-h-[360px] shadow-sm border border-black/5 group">
            <div className="relative z-10 max-w-sm sm:max-w-md space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-[#111111] text-[11px] font-extrabold uppercase tracking-wider">
                  Featured Hero • {heroProduct.category || 'Special Edition'}
                </span>
                {heroProduct.in_stock && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                    In Stock
                  </span>
                )}
              </div>

              <Link to={`/product/${heroProduct.id}`}>
                <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-[1.05] font-display hover:underline line-clamp-2">
                  {heroProduct.name}
                </h2>
              </Link>

              <p className="text-xs sm:text-sm text-[#111111]/80 leading-relaxed font-medium line-clamp-2">
                {heroProduct.description || 'Authentic limited collectible. Order now with instant WhatsApp payment confirmation.'}
              </p>

              <div className="pt-3 flex items-center gap-3">
                <Link
                  to={`/product/${heroProduct.id}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-transform active:scale-95 group-hover:shadow-md"
                >
                  <span>Shop Now — {formatPrice(heroProduct.price)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  type="button"
                  onClick={() => addToCart(heroProduct, 1)}
                  disabled={!heroProduct.in_stock}
                  className="p-3.5 rounded-full bg-white text-[#111111] hover:bg-gray-100 shadow-sm border border-black/5 transition-transform active:scale-95 disabled:opacity-50"
                  title="Quick add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bleeding Character / Product Hero Graphic */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-5/12 pointer-events-none overflow-hidden flex items-end justify-end">
              <img
                src={heroProduct.image_url}
                alt={heroProduct.name}
                className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#C9E4C5]/20 to-[#C9E4C5]" />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-[#C9E4C5] p-7 sm:p-9 flex flex-col justify-between min-h-[340px] sm:min-h-[360px] shadow-sm border border-black/5 group">
            <div className="relative z-10 max-w-sm sm:max-w-md space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-black/10 text-[#111111] text-[11px] font-extrabold uppercase tracking-wider">
                {heroBanner.eyebrow_tag || 'Exclusive Season Drop'}
              </span>

              <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-[1.05] font-display">
                {heroBanner.headline || 'GET UP TO 50% OFF'}
              </h2>

              <p className="text-xs sm:text-sm text-[#111111]/80 leading-relaxed font-medium">
                {heroBanner.subtext || 'Authentic scale figures, heavy-weight embroidered hoodies, and holographic wall scrolls. Fresh Akihabara import shipments.'}
              </p>

              {heroBanner.cta_text && (
                <div className="pt-3">
                  <a
                    href={heroBanner.cta_link || '#catalog-view'}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-transform active:scale-95 group-hover:shadow-md"
                  >
                    <span>{heroBanner.cta_text}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            {/* Bleeding Character / Product Hero Graphic */}
            {heroBanner.image_url && (
              <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-5/12 pointer-events-none overflow-hidden flex items-end justify-end">
                <img
                  src={heroBanner.image_url}
                  alt={heroBanner.headline || 'Anime Statue Promo'}
                  className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#C9E4C5]/20 to-[#C9E4C5]" />
              </div>
            )}
          </div>
        )}

        {/* Row 1, Right 1 col: Product Card 1 (Our Picks or Store Collection) */}
        {pickProduct1 ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col justify-between relative group hover:shadow-md transition-shadow">
            {/* Top Row: Variant dots + Wishlist Heart */}
            <div className="flex items-center justify-between mb-3 z-10 relative">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-2 ring-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
              </div>
              <button
                type="button"
                onClick={(e) => toggleWishlist(pickProduct1.id, e)}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Wishlist item"
              >
                <Heart 
                  className={`w-4 h-4 ${wishlist.includes(pickProduct1.id) ? 'fill-rose-500 text-rose-500' : ''}`} 
                />
              </button>
            </div>

            {/* Centered Product Photo */}
            <Link to={`/product/${pickProduct1.id}`} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 block">
              <img
                src={pickProduct1.image_url}
                alt={pickProduct1.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Details & Pricing */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B6B]">
                  Our Picks
                </span>
                {pickProduct1.hw_num && (
                  <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200">
                    HW# {pickProduct1.hw_num}
                  </span>
                )}
              </div>
              <Link to={`/product/${pickProduct1.id}`}>
                <h3 className="text-sm font-bold text-[#111111] line-clamp-1 hover:underline">
                  {pickProduct1.name}
                </h3>
              </Link>
              {(pickProduct1.edition || pickProduct1.series) && (
                <p className="text-[11px] text-[#8A8A8A] font-medium truncate mt-0.5">
                  {pickProduct1.edition} • {pickProduct1.series}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => addToCart(pickProduct1, 1)}
                  className="text-xs font-semibold text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold">
                  {formatPrice(pickProduct1.price)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B6B]">
                Store Collection
              </span>
              <h3 className="text-xl font-black text-[#111111] tracking-tight font-display">
                Curated Merchandise
              </h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Authentic anime merchandise, figures, clothing, posters and accessories.
              </p>
            </div>
            <Link
              to="/?category=all"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:underline"
            >
              <span>Browse collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Row 2, Left 1 col: Secondary Promo (Pastel Yellow #F5E7A8) */}
        <div className="rounded-3xl bg-[#F5E7A8] p-6 shadow-sm border border-black/5 flex flex-col justify-between min-h-[220px] relative group overflow-hidden">
          
          <div className="flex items-start justify-between relative z-10">
            <span className="px-3 py-1 rounded-full bg-black/10 text-[#111111] text-[10px] font-extrabold uppercase tracking-wider">
              {weeklyDropBanner.eyebrow_tag || 'Weekly Drop'}
            </span>
            <Link
              to={weeklyDropBanner.cta_link || '/?category=clothing'}
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm group-hover:bg-[#111111] group-hover:text-white transition-colors"
              aria-label="View new arrivals"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-1 relative z-10">
            <h3 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight font-display leading-tight">
              {weeklyDropBanner.headline || 'New Arrivals — Fresh Drops Weekly'}
            </h3>
            <p className="text-xs text-[#111111]/80 font-medium">
              {weeklyDropBanner.subtext || 'Curated street apparel & limited run art scrolls.'}
            </p>
          </div>

          {weeklyDropBanner.image_url && (
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-25 overflow-hidden pointer-events-none">
              <img
                src={weeklyDropBanner.image_url}
                alt="Weekly Drop Promo"
                className="w-full h-full object-cover"
              />
            </div>
          )}

        </div>

        {/* Row 2, Middle 1 col: "Favourites" Mini-Carousel Widget */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col justify-between min-h-[220px]">
          
          {/* Header with Arrow Nav */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-[#111111]">Favourites</h3>
            </div>
            
            {currentFavs.length > 2 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={prevFav}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] flex items-center justify-center transition-colors"
                  aria-label="Previous favourite"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextFav}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] flex items-center justify-center transition-colors"
                  aria-label="Next favourite"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {currentFavs.length > 0 ? (
            <>
              {/* 2 Small Thumbnails side by side */}
              <div className="grid grid-cols-2 gap-2 my-2">
                {currentFavs.map((fav) => (
                  <Link
                    key={fav.id}
                    to={`/product/${fav.id}`}
                    className="p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors group flex flex-col"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-white mb-1.5">
                      <img
                        src={fav.image_url}
                        alt={fav.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <p className="text-[11px] font-bold text-[#111111] truncate">{fav.name}</p>
                    <p className="text-[10px] text-[#6B6B6B] font-semibold">{formatPrice(fav.price)}</p>
                  </Link>
                ))}
              </div>

              {/* See All Pill Button */}
              <div className="pt-1">
                <Link
                  to="/?category=all"
                  className="w-full py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-[#111111] text-xs font-bold text-center block transition-colors"
                >
                  See All
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-[#8A8A8A]">No items available yet.</p>
              <a
                href="#catalog-view"
                className="text-xs font-bold text-[#111111] hover:underline block"
              >
                Browse Catalog ↓
              </a>
            </div>
          )}

        </div>

        {/* Row 2, Right 1 col: Product Card 2 (Fan Favorite or Genuine Imports) */}
        {pickProduct2 ? (
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col justify-between relative group hover:shadow-md transition-shadow">
            {/* Top Row: Variant dots + Wishlist Heart */}
            <div className="flex items-center justify-between mb-3 z-10 relative">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-2 ring-white" />
              </div>
              <button
                type="button"
                onClick={(e) => toggleWishlist(pickProduct2.id, e)}
                className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
                aria-label="Wishlist item"
              >
                <Heart 
                  className={`w-4 h-4 ${wishlist.includes(pickProduct2.id) ? 'fill-rose-500 text-rose-500' : ''}`} 
                />
              </button>
            </div>

            {/* Centered Product Photo */}
            <Link to={`/product/${pickProduct2.id}`} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 block">
              <img
                src={pickProduct2.image_url}
                alt={pickProduct2.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {/* Details & Pricing */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B6B]">
                  Fan Favorite
                </span>
                {pickProduct2.hw_num && (
                  <span className="text-[9px] font-black uppercase text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200">
                    HW# {pickProduct2.hw_num}
                  </span>
                )}
              </div>
              <Link to={`/product/${pickProduct2.id}`}>
                <h3 className="text-sm font-bold text-[#111111] line-clamp-1 hover:underline">
                  {pickProduct2.name}
                </h3>
              </Link>
              {(pickProduct2.edition || pickProduct2.series) && (
                <p className="text-[11px] text-[#8A8A8A] font-medium truncate mt-0.5">
                  {pickProduct2.edition} • {pickProduct2.series}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => addToCart(pickProduct2, 1)}
                  className="text-xs font-semibold text-[#6B6B6B] hover:text-[#111111] flex items-center gap-1"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold">
                  {formatPrice(pickProduct2.price)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 flex flex-col justify-between min-h-[220px]">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B6B6B]">
                Quality Guaranteed
              </span>
              <h3 className="text-xl font-black text-[#111111] tracking-tight font-display">
                100% Official Merch
              </h3>
              <p className="text-xs text-[#6B6B6B] leading-relaxed">
                Direct imports packaged with protective wrapping and WhatsApp delivery updates.
              </p>
            </div>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600">
              Verified Japanese Importers
            </span>
          </div>
        )}

        {/* Row 3, Left 1 col: Spotlight Card Slot (Dynamic or Collector Fallback) */}
        {spotlightProduct ? (
          <div className="rounded-3xl overflow-hidden relative shadow-sm border border-black/5 min-h-[300px] flex flex-col justify-between p-6 group">
            {/* Background Image Bleed */}
            <img
              src={spotlightProduct.image_url}
              alt={spotlightProduct.name}
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

            {/* Top Heart */}
            <div className="relative z-10 flex justify-end">
              <button
                type="button"
                onClick={(e) => toggleWishlist(spotlightProduct.id, e)}
                className="p-2 rounded-full bg-white/80 backdrop-blur-md text-[#111111] hover:text-rose-500 transition-colors"
                aria-label="Wishlist item"
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(spotlightProduct.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Bottom Overlaid Content & Pill CTA */}
            <div className="relative z-10 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Spotlight • {spotlightProduct.category || 'Featured'}
                </span>
                <Link to={`/product/${spotlightProduct.id}`}>
                  <h3 className="text-xl font-black text-white tracking-tight leading-snug font-display hover:underline line-clamp-2">
                    {spotlightProduct.name}
                  </h3>
                </Link>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <Link
                  to={`/product/${spotlightProduct.id}`}
                  className="inline-block px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#111111] text-xs font-extrabold shadow-sm transition-transform active:scale-95"
                >
                  View Item — {formatPrice(spotlightProduct.price)}
                </Link>
                <button
                  type="button"
                  onClick={() => addToCart(spotlightProduct, 1)}
                  disabled={!spotlightProduct.in_stock}
                  className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-[#111111] transition-colors disabled:opacity-50"
                  title="Quick add to cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl overflow-hidden relative shadow-sm border border-black/5 min-h-[300px] flex flex-col justify-between p-6 group">
            {/* Background Image Bleed */}
            {collectorSpotlightBanner.image_url ? (
              <>
                <img
                  src={collectorSpotlightBanner.image_url}
                  alt={collectorSpotlightBanner.headline || 'Character Spotlight'}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-900 via-zinc-900 to-black" />
            )}

            {/* Top Heart */}
            <div className="relative z-10 flex justify-end">
              <button
                type="button"
                onClick={(e) => toggleWishlist('spotlight-1', e)}
                className="p-2 rounded-full bg-white/80 backdrop-blur-md text-[#111111] hover:text-rose-500 transition-colors"
                aria-label="Wishlist item"
              >
                <Heart className={`w-4 h-4 ${wishlist.includes('spotlight-1') ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

            {/* Bottom Overlaid Content & Pill CTA */}
            <div className="relative z-10 space-y-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-300">
                  {collectorSpotlightBanner.eyebrow_tag || 'Collector Spotlight'}
                </span>
                <h3 className="text-xl font-black text-white tracking-tight leading-snug font-display">
                  {collectorSpotlightBanner.headline || 'Demon Slayer Nichirin Swords & Statues'}
                </h3>
              </div>

              {collectorSpotlightBanner.cta_text && (
                <Link
                  to={collectorSpotlightBanner.cta_link || '/?category=accessories'}
                  className="inline-block px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#111111] text-xs font-extrabold shadow-sm transition-transform active:scale-95"
                >
                  {collectorSpotlightBanner.cta_text}
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Row 3, Right 2 cols: Wide Editorial Banner */}
        <div className="lg:col-span-2 rounded-3xl overflow-hidden bg-[#ECECE8] p-7 sm:p-9 shadow-sm border border-black/5 relative flex flex-col justify-between min-h-[300px] group">
          
          <div className="relative z-10 max-w-sm sm:max-w-md space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/10 text-[#111111] text-[10px] font-extrabold uppercase tracking-wider">
                {styleEditorialBanner.eyebrow_tag || 'Style Editorial'}
              </span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight leading-tight font-display">
              {styleEditorialBanner.headline || 'Bring Bold Fashion → Your Anime, Your Style'}
            </h3>

            <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed font-medium">
              {styleEditorialBanner.subtext || 'Heavyweight cotton hoodies, woven tapestry jackets, and Akatsuki cloaks crafted for fans who wear their passion boldly.'}
            </p>

            {styleEditorialBanner.cta_text && (
              <div className="pt-2">
                <Link
                  to={styleEditorialBanner.cta_link || '/?category=clothing'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
                >
                  <span>{styleEditorialBanner.cta_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Top-Right Arrow Icon */}
          <Link
            to={styleEditorialBanner.cta_link || '/?category=clothing'}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#111111] shadow-sm group-hover:bg-[#111111] group-hover:text-white transition-colors z-10"
            aria-label="View collection"
          >
            <ArrowUpRight className="w-5 h-5" />
          </Link>

          {/* Lifestyle Graphic Bleed */}
          {styleEditorialBanner.image_url && (
            <div className="absolute right-0 bottom-0 top-0 w-1/2 pointer-events-none overflow-hidden flex items-end justify-end">
              <img
                src={styleEditorialBanner.image_url}
                alt={styleEditorialBanner.headline || 'Anime Fashion Banner'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#ECECE8]/40 to-[#ECECE8]" />
            </div>
          )}

        </div>

      </div>

      {/* 5. Complete Shoppable Catalog Section */}
      <section id="catalog-view" className="pt-4 space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111111] font-display">
              All Merchandise ({filteredCatalog.length})
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Showing {activeCategory === 'all' ? 'all items' : activeCategory} items with instant WhatsApp checkout
            </p>
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                searchParams.delete('q')
                setSearchParams(searchParams)
              }}
              className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
            >
              <span>Clear search "{searchQuery}"</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredCatalog.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredCatalog.map((product) => {
              const isCarted = items.some(i => i.id === product.id)
              const isWished = wishlist.includes(product.id)

              return (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-md transition-shadow relative"
                >
                  {/* Top Row: Category Label + Wishlist Heart */}
                  <div className="flex items-center justify-between mb-2.5 z-10 relative">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.hw_num && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-200/80 px-2 py-0.5 rounded-full">
                          HW# {product.hw_num}
                        </span>
                      )}
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B] bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {product.series || product.category || 'Merch'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleWishlist(product.id, e)}
                      className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-rose-500 transition-colors"
                      aria-label="Wishlist item"
                    >
                      <Heart className={`w-4 h-4 ${isWished ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Product Image */}
                  <Link 
                    to={`/product/${product.id}`} 
                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3 block"
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {!product.in_stock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-extrabold tracking-wider uppercase">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Title & Description */}
                  <div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-1 hover:underline">
                        {product.name}
                      </h3>
                    </Link>
                    {(product.edition || product.color) && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#6B6B6B] font-semibold truncate">
                        {product.edition && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 font-bold">
                            {product.edition}
                          </span>
                        )}
                        {product.color && product.color !== product.edition && (
                          <span className="text-gray-500 truncate">
                            • {product.color}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-[11px] text-[#6B6B6B] line-clamp-1 mt-1">
                      {product.description}
                    </p>

                    {/* Price & Add to Cart */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#111111] text-white text-xs font-bold">
                        {formatPrice(product.price)}
                      </span>

                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        disabled={!product.in_stock}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          !product.in_stock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isCarted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 hover:bg-[#111111] hover:text-white text-[#111111]'
                        }`}
                      >
                        {isCarted ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-black/5 my-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#111111]">No products found</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 max-w-sm mx-auto">
              We couldn't find any products matching your active filters or search terms.
            </p>
            <button
              type="button"
              onClick={() => {
                handleCategoryChange('all')
                setInStockOnly(false)
                setSortBy('featured')
                searchParams.delete('q')
                setSearchParams(searchParams)
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#111111] text-white text-xs font-bold hover:bg-black"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      {/* Filters Modal */}
      {showFiltersModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowFiltersModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-[#111111]">Filter Products</h3>

            <div className="space-y-4 my-4 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none"
                >
                  <option value="featured">Featured / HW# Position (Default)</option>
                  <option value="hw-asc">HW# (Low to High: #1 → #250)</option>
                  <option value="hw-desc">HW# (High to Low: #250 → #1)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 font-bold text-[#111111] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-black focus:ring-0"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setInStockOnly(false)
                  setSortBy('featured')
                }}
                className="flex-1 py-2 rounded-full border border-gray-200 text-xs font-bold text-[#6B6B6B]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 py-2 rounded-full bg-[#111111] text-white text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
