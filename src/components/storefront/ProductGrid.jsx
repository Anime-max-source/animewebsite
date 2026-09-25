import React, { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

export default function ProductGrid({ products, initialCategory = 'all', initialQuery = '' }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState('featured') // 'featured' | 'price-low' | 'price-high' | 'newest'
  const [showInStockOnly, setShowInStockOnly] = useState(false)

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'figures', label: 'Scale Figures' },
    { id: 'clothing', label: 'Hoodies & Cloaks' },
    { id: 'posters', label: 'Posters & Scrolls' },
    { id: 'accessories', label: 'Accessories & Props' },
  ]

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      const categoryMatch = 
        selectedCategory === 'all' || 
        item.category?.toLowerCase() === selectedCategory.toLowerCase()

      // Query match
      const queryMatch = 
        !initialQuery ||
        item.name.toLowerCase().includes(initialQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(initialQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(initialQuery.toLowerCase())

      // In stock match
      const stockMatch = !showInStockOnly || (item.in_stock && item.stock > 0)

      return categoryMatch && queryMatch && stockMatch
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'newest') return new Date(b.created_at || 0) - new Date(a.created_at || 0)
      // Default: In-stock first, then id
      if (a.in_stock && !b.in_stock) return -1
      if (!a.in_stock && b.in_stock) return 1
      return 0
    })
  }, [products, selectedCategory, initialQuery, showInStockOnly, sortBy])

  return (
    <section className="py-6">
      {/* Category Pills & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] text-white shadow-glow-primary'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters and Sorting */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <input
              type="checkbox"
              checked={showInStockOnly}
              onChange={(e) => setShowInStockOnly(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-[#ff3366] focus:ring-0 focus:ring-offset-0"
            />
            <span>In-Stock Only</span>
          </label>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#121624]">Featured</option>
              <option value="price-low" className="bg-[#121624]">Price: Low to High</option>
              <option value="price-high" className="bg-[#121624]">Price: High to Low</option>
              <option value="newest" className="bg-[#121624]">Newest Arrivals</option>
            </select>
          </div>
        </div>

      </div>

      {/* Query Banner if search is active */}
      {initialQuery && (
        <div className="py-3 text-xs text-slate-400 flex items-center justify-between">
          <p>
            Showing results for <span className="text-white font-semibold">"{initialQuery}"</span> ({filteredProducts.length} items found)
          </p>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/80 my-8">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-white font-semibold text-base">No Merchandise Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn't find any products matching your current filters. Try changing category or reset search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all')
              setShowInStockOnly(false)
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  )
}
