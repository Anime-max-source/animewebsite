import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Check } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import { StockBadge, CategoryBadge } from '../common/Badge'
import { useCart } from '../../context/CartContext'
import { handleImageError } from '../../utils/imageFallback'

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart()
  const isSoldOut = !product.in_stock || product.stock <= 0
  const cartItem = items.find((i) => i.id === product.id)
  const isAlreadyInCart = Boolean(cartItem)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isSoldOut) {
      addToCart(product, 1)
    }
  }

  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-300 shadow-sm hover:shadow-md ${isSoldOut ? 'opacity-85' : ''}`}>
      
      {/* Product Image & Badges */}
      <Link to={`/product/${product.id}`} className="relative aspect-[4/5] overflow-hidden bg-slate-100 block">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          onError={handleImageError}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? 'grayscale-[40%]' : ''}`}
        />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.hw_num && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black tracking-wider uppercase bg-amber-400 text-black border border-amber-500 shadow-sm">
              HW# {product.hw_num}
            </span>
          )}
          <CategoryBadge category={product.series || product.category} />
        </div>

        <div className="absolute top-3 right-3 z-10">
          <StockBadge inStock={product.in_stock} stock={product.stock} />
        </div>

        {/* Sold out overlay banner if not in stock */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs tracking-widest uppercase shadow-lg transform -rotate-6">
              Sold Out
            </div>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-[#111111] font-bold text-sm line-clamp-2 hover:text-rose-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {(product.edition || product.color) && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#6B6B6B] font-semibold truncate">
              {product.edition && (
                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-[10px] font-bold">
                  {product.edition}
                </span>
              )}
              {product.color && product.color !== product.edition && (
                <span className="text-gray-500 truncate text-[11px]">
                  • {product.color}
                </span>
              )}
            </div>
          )}

          <p className="text-xs text-[#6B6B6B] line-clamp-2 mt-1.5 leading-relaxed font-medium">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-[#8A8A8A] block font-semibold uppercase">Price</span>
            <span className="text-base font-black text-[#111111] tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/product/${product.id}`}
              className="p-2 rounded-xl text-[#6B6B6B] hover:text-[#111111] hover:bg-slate-100 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleQuickAdd}
              disabled={isSoldOut}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isSoldOut
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : isAlreadyInCart
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                  : 'bg-gradient-to-r from-[#ff3366] to-[#e02456] hover:from-[#ff4d7d] hover:to-[#ff3366] text-white shadow-sm'
              }`}
              title={isSoldOut ? 'Item is sold out' : 'Add to cart'}
            >
              {isAlreadyInCart && !isSoldOut ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>{isSoldOut ? 'Sold Out' : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
