import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  MessageSquare, 
  Minus, 
  Plus, 
  Sparkles,
  Share2
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/formatPrice'
import { StockBadge, CategoryBadge } from '../../components/common/Badge'
import ProductCard from '../../components/storefront/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useApp()
  const { addToCart, items } = useCart()

  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto p-8 rounded-2xl bg-white border border-black/5 shadow-sm">
        <h2 className="text-2xl font-black text-[#111111] font-display">Product Not Found</h2>
        <p className="text-xs text-[#6B6B6B] font-medium">The anime collectible you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#111111] hover:bg-black text-xs font-bold text-white shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Catalog
        </Link>
      </div>
    )
  }

  const isSoldOut = !product.in_stock || product.stock <= 0
  const cartItem = items.find((i) => i.id === product.id)
  const isAlreadyInCart = Boolean(cartItem)

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!isSoldOut) {
      addToCart(product, quantity)
    }
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-[#111111] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>

        <div className="flex items-center gap-2 font-medium">
          <Link to="/" className="hover:text-[#111111]">Shop</Link>
          <span>/</span>
          <Link to={`/?category=${product.category}`} className="capitalize hover:text-[#111111]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111111] font-bold truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Product Image Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-black/5 shadow-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-cover object-center ${isSoldOut ? 'grayscale-[30%]' : ''}`}
            />
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-sm tracking-widest uppercase shadow-2xl">
                  Sold Out
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {product.hw_num && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-black border border-amber-500 shadow-sm">
                  Collector HW# {product.hw_num}
                </span>
              )}
              <CategoryBadge category={product.series || product.category} />
              <StockBadge inStock={product.in_stock} stock={product.stock} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight leading-snug font-display">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-2">
              <span className="text-3xl font-black text-[#111111] font-display">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-emerald-800 font-bold bg-[#E3EFE1] px-3 py-1 rounded-full border border-emerald-300">
                Free Express Delivery
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed pt-2 border-t border-black/5 font-medium">
            {product.description}
          </p>

          {/* Collector Specifications Box */}
          <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">Collector Specifications</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {product.hw_num && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Collector #</span>
                  <span className="font-black text-amber-700 text-sm">HW# {product.hw_num}</span>
                </div>
              )}
              {product.series && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Series</span>
                  <span className="font-bold text-[#111111]">{product.series}</span>
                </div>
              )}
              {product.edition && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Edition</span>
                  <span className="font-bold text-[#111111]">{product.edition}</span>
                </div>
              )}
              {product.color && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Color</span>
                  <span className="font-bold text-[#111111]">{product.color}</span>
                </div>
              )}
              {product.sort_order !== undefined && (
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Catalog Position</span>
                  <span className="font-bold text-[#111111]">#{product.sort_order}</span>
                </div>
              )}
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="block text-[10px] text-[#8A8A8A] font-semibold uppercase">Scale</span>
                <span className="font-bold text-[#111111]">1:64 Die-Cast</span>
              </div>
            </div>
          </div>

          {/* Add to Cart Actions */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-black/5 shadow-sm space-y-4">
            
            {!isSoldOut ? (
              <div className="space-y-4">
                {/* Quantity selector */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111]">Quantity</span>
                  <div className="flex items-center gap-2 bg-[#F5F5F3] p-1.5 rounded-full border border-stone-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] hover:bg-white transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-[#111111] w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#6B6B6B] hover:text-[#111111] hover:bg-white transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main CTA */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-glow-primary transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isAlreadyInCart ? 'Add More to Cart' : `Add ${quantity} to Cart • ${formatPrice(product.price * quantity)}`}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-rose-600 font-bold text-sm">
                  This collectible is currently Sold Out.
                </p>
                <p className="text-xs text-[#6B6B6B]">
                  New batch is being manufactured or imported. Check back soon!
                </p>
                <button
                  disabled
                  className="w-full py-3.5 px-6 rounded-full bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed border border-slate-200"
                >
                  Sold Out
                </button>
              </div>
            )}

            {/* Share and wishlist */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#6B6B6B]">
              <span className="text-[11px]">Product ID: <strong className="font-mono text-[#111111]">{product.id}</strong></span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 hover:text-[#111111] font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Product'}</span>
              </button>
            </div>

          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-[#111111] font-medium">100% Authentic Hot Wheels</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-[#111111] font-medium">WhatsApp Payment Support</span>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-black/5">
          <h3 className="text-xl font-black text-[#111111] tracking-tight font-display mb-6">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
