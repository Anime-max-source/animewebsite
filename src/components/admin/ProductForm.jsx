import React, { useState, useMemo } from 'react'
import { Sparkles, Image, DollarSign, Layers, PackageCheck, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function ProductForm({ initialProduct = null, onSubmit, onCancel, isSubmitting = false }) {
  const { products = [] } = useApp()

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price || '',
    category: initialProduct?.category || 'HW Mainline',
    series: initialProduct?.series || '',
    edition: initialProduct?.edition || '',
    color: initialProduct?.color || '',
    hw_num: initialProduct?.hw_num !== undefined ? initialProduct.hw_num : '',
    image_url: initialProduct?.image_url || '',
    stock: initialProduct?.stock !== undefined ? initialProduct.stock : 10,
    in_stock: initialProduct?.in_stock !== undefined ? initialProduct.in_stock : true,
    display_section: initialProduct?.display_section || 'grid',
    sort_order: initialProduct?.sort_order !== undefined ? initialProduct.sort_order : 0,
  })

  const [confirmReplace, setConfirmReplace] = useState(false)
  const [errors, setErrors] = useState({})

  // Detect collisions with existing placed products
  const collisionWarning = useMemo(() => {
    const otherProducts = products.filter(p => p.id !== initialProduct?.id)

    if (formData.display_section === 'hero') {
      const heroHolder = otherProducts.find(p => p.display_section === 'hero')
      if (heroHolder) {
        return `Hero Banner is currently showing "${heroHolder.name}". Assigning this product will replace it.`
      }
    }

    if (formData.display_section === 'spotlight') {
      const spotHolder = otherProducts.find(p => p.display_section === 'spotlight')
      if (spotHolder) {
        return `Spotlight Card is currently showing "${spotHolder.name}". Assigning this product will replace it.`
      }
    }

    if (formData.display_section === 'favourites') {
      const favHolders = otherProducts.filter(p => p.display_section === 'favourites')
      if (favHolders.length >= 2) {
        const sortedFavs = [...favHolders].sort((a, b) => (b.sort_order || 0) - (a.sort_order || 0))
        return `Favourites Carousel already has 2 products (${favHolders.map(p => `"${p.name}"`).join(', ')}). Assigning this product will replace "${sortedFavs[0].name}".`
      }
    }

    return null
  }, [formData.display_section, products, initialProduct])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errors[name] || (name === 'display_section' && errors.placement)) {
      setErrors((prev) => ({ ...prev, [name]: undefined, placement: undefined }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      newErrors.price = 'Valid price is required'
    }
    if (!formData.image_url.trim()) newErrors.image_url = 'Image URL is required'
    if (collisionWarning && !confirmReplace) {
      newErrors.placement = 'Please confirm replacing the currently featured product before saving'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const hwParsed = formData.hw_num !== '' && !isNaN(formData.hw_num) ? parseInt(formData.hw_num) : undefined
    const sortOrderParsed = formData.sort_order !== '' && !isNaN(formData.sort_order) 
      ? parseInt(formData.sort_order) 
      : (hwParsed !== undefined ? hwParsed : 0)

    onSubmit({
      ...formData,
      category: formData.series || formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      hw_num: hwParsed,
      sort_order: sortOrderParsed,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Product Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Product Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product title..."
          className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
        />
        {errors.name && (
          <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.name}
          </p>
        )}
      </div>

      {/* HW# and Series */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Hot Wheels Collector # (HW#)
          </label>
          <input
            type="number"
            name="hw_num"
            min="1"
            value={formData.hw_num}
            onChange={handleChange}
            placeholder="e.g. 24, 89, 160"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Series
          </label>
          <input
            type="text"
            name="series"
            value={formData.series}
            onChange={handleChange}
            placeholder="e.g. HW J-Imports, Compact Kings"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>
      </div>

      {/* Edition and Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Edition
          </label>
          <input
            type="text"
            name="edition"
            value={formData.edition}
            onChange={handleChange}
            placeholder="e.g. ZAMAC, Spectraflame Orange"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Orange, Metallic Blue"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>
      </div>

      {/* Category & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category or Series"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Price (₹ INR) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            min="0"
            step="1"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price in ₹"
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
          {errors.price && (
            <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.price}
            </p>
          )}
        </div>
      </div>

      {/* Stock and In Stock Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Initial Stock Units
          </label>
          <input
            type="number"
            name="stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
          />
        </div>

        <div className="pt-5">
          <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer bg-[#121624] p-2.5 rounded-xl border border-slate-700">
            <input
              type="checkbox"
              name="in_stock"
              checked={formData.in_stock}
              onChange={handleChange}
              className="rounded bg-slate-800 border-slate-600 text-[#ff3366] focus:ring-0 w-4 h-4"
            />
            <span className="font-semibold">Mark as In-Stock on Storefront</span>
          </label>
        </div>
      </div>

      {/* Homepage Placement Control */}
      <div className="p-3.5 rounded-2xl bg-[#0e1220] border border-slate-700/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Where should this show on the homepage?</span>
            </label>
            <select
              name="display_section"
              value={formData.display_section}
              onChange={(e) => {
                handleChange(e)
                setConfirmReplace(false)
              }}
              className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
            >
              <option value="grid">Product Grid (Default)</option>
              <option value="hero">Hero Banner (Single Slot)</option>
              <option value="spotlight">Spotlight Card (Single Slot)</option>
              <option value="favourites">Favourites Carousel (Max 2)</option>
            </select>
          </div>

          {formData.display_section !== 'grid' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sort Order (Lower = Shown First)
              </label>
              <input
                type="number"
                name="sort_order"
                min="0"
                step="1"
                value={formData.sort_order}
                onChange={handleChange}
                placeholder="0"
                className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
              />
            </div>
          )}
        </div>

        {/* Inline Collision Warning Banner */}
        {collisionWarning && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {collisionWarning}
              </p>
            </div>
            <label className="flex items-center gap-2 pt-1 font-bold text-amber-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmReplace}
                onChange={(e) => {
                  setConfirmReplace(e.target.checked)
                  if (errors.placement) setErrors(prev => ({ ...prev, placement: undefined }))
                }}
                className="rounded bg-slate-800 border-amber-600 text-[#ff3366] focus:ring-0 w-4 h-4"
              />
              <span>Confirm replacement</span>
            </label>
            {errors.placement && (
              <p className="text-rose-400 text-xs font-semibold">
                {errors.placement}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Product Image URL (Supabase Storage or Web Image) <span className="text-rose-500">*</span>
        </label>
        <input
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
        />
        {errors.image_url && (
          <p className="text-rose-400 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.image_url}
          </p>
        )}
      </div>

      {/* Image preview */}
      {formData.image_url && (
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <img
            src={formData.image_url}
            alt="Preview"
            className="w-14 h-14 object-cover rounded-lg bg-slate-800 flex-shrink-0"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div className="text-xs text-slate-400">
            <p className="text-white font-medium">Image Preview</p>
            <p className="truncate max-w-xs">{formData.image_url}</p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">
          Product Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed product description..."
          className="w-full bg-[#121624] border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#ff3366]"
        />
      </div>

      {/* Modal Actions */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff3366] to-[#8b5cf6] text-white text-xs font-bold shadow-glow-primary hover:opacity-90 transition-opacity"
        >
          {initialProduct ? 'Update Product' : 'Add to Catalog'}
        </button>
      </div>

    </form>
  )
}
