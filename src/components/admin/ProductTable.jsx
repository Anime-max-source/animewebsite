import React, { useState } from 'react'
import { Edit2, Trash2, Power, Eye, CheckCircle2, XCircle } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import { CategoryBadge, StockBadge } from '../common/Badge'
import Modal from '../common/Modal'

export default function ProductTable({ products, onEdit, onDelete, onToggleSoldOut }) {
  const [deleteCandidate, setDeleteCandidate] = useState(null)

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-left text-xs text-[#111111]">
          <thead className="bg-[#F5F5F3] text-[11px] uppercase tracking-wider text-[#8A8A8A] border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5 font-semibold">Product</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">HW# / Pos</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Placement</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Series / Category</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Edition / Color</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Price</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Stock</th>
              <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3.5 font-semibold text-center">Quick Sold-Out Toggle</th>
              <th scope="col" className="px-5 py-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {products.map((product) => {
              const isSoldOut = !product.in_stock || product.stock <= 0
              return (
                <tr 
                  key={product.id} 
                  className={`hover:bg-slate-50/80 transition-colors ${isSoldOut ? 'bg-rose-50/30' : ''}`}
                >
                  {/* Image & Title */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="max-w-xs">
                        <p className="font-bold text-[#111111] truncate">{product.name}</p>
                        <p className="text-[10px] text-[#8A8A8A] font-mono truncate">{product.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* HW# and Position Column */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {product.hw_num ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                        HW# {product.hw_num}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs">#{product.sort_order ?? '—'}</span>
                    )}
                  </td>

                  {/* Homepage Placement Badge */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {product.display_section === 'hero' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        <span>👑 Hero</span>
                        {product.sort_order ? <span className="text-[9px] opacity-75">#{product.sort_order}</span> : null}
                      </span>
                    )}
                    {product.display_section === 'spotlight' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        <span>✨ Spotlight</span>
                        {product.sort_order ? <span className="text-[9px] opacity-75">#{product.sort_order}</span> : null}
                      </span>
                    )}
                    {product.display_section === 'favourites' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                        <span>❤️ Favourites</span>
                        {product.sort_order ? <span className="text-[9px] opacity-75">#{product.sort_order}</span> : null}
                      </span>
                    )}
                    {(!product.display_section || product.display_section === 'grid') && (
                      <span className="text-slate-400 text-xs font-medium">—</span>
                    )}
                  </td>

                  {/* Category / Series */}
                  <td className="px-5 py-3.5">
                    <CategoryBadge category={product.series || product.category} />
                  </td>

                  {/* Edition / Color */}
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs">
                    <span className="font-semibold text-slate-800">{product.edition || '—'}</span>
                    {product.color && product.color !== product.edition && (
                      <span className="text-slate-400 text-[10px] block">{product.color}</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="px-5 py-3.5 font-bold text-[#111111]">
                    {formatPrice(product.price)}
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-3.5">
                    <span className={`font-mono font-semibold ${product.stock <= 3 ? 'text-amber-600' : 'text-[#111111]'}`}>
                      {product.stock} units
                    </span>
                  </td>

                  {/* Storefront status badge */}
                  <td className="px-5 py-3.5">
                    <StockBadge inStock={product.in_stock} stock={product.stock} />
                  </td>

                  {/* Quick One-Click Sold Out Toggle Button */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => onToggleSoldOut(product.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        product.in_stock
                          ? 'bg-slate-100 hover:bg-rose-100/70 text-slate-700 hover:text-rose-700 border border-slate-200'
                          : 'bg-[#D6FF4A] hover:bg-[#c9f635] text-black shadow-sm'
                      }`}
                      title="Click to toggle between In Stock and Sold Out without deleting"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{product.in_stock ? 'Mark Sold Out' : 'Restore Stock'}</span>
                    </button>
                  </td>

                  {/* Edit and Delete action buttons */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                        title="Edit Product Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteCandidate(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteCandidate)}
        onClose={() => setDeleteCandidate(null)}
        title="Confirm Product Deletion"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p>
            Are you sure you want to permanently delete{' '}
            <strong className="text-white">"{deleteCandidate?.name}"</strong>?
          </p>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-200">
            <strong>Tip:</strong> If you simply ran out of stock, use <strong>"Mark Sold Out"</strong> instead so buyers can still see the item in your catalog.
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => setDeleteCandidate(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteCandidate) {
                  onDelete(deleteCandidate.id)
                  setDeleteCandidate(null)
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
            >
              Delete Product
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
