import React, { useState } from 'react'
import { Plus, Search, Filter, ArrowUpRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ProductTable from '../../components/admin/ProductTable'
import ProductForm from '../../components/admin/ProductForm'
import Modal from '../../components/common/Modal'

export default function ManageProducts() {
  const { products, addProduct, updateProduct, deleteProduct, toggleSoldOut, resetCatalog } = useApp()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const distinctCategories = Array.from(
    new Set(products.map(p => p.series || p.category).filter(Boolean))
  ).sort()

  const filteredProducts = products.filter((p) => {
    const q = searchFilter.toLowerCase().trim()
    const matchesSearch = 
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.series?.toLowerCase().includes(q) ||
      p.edition?.toLowerCase().includes(q) ||
      p.color?.toLowerCase().includes(q) ||
      (p.hw_num && String(p.hw_num).includes(q)) ||
      (p.sort_order && String(p.sort_order).includes(q))
    const pCat = (p.category || '').toLowerCase()
    const pSeries = (p.series || '').toLowerCase()
    const matchesCat = categoryFilter === 'all' || pCat === categoryFilter.toLowerCase() || pSeries === categoryFilter.toLowerCase()
    return matchesSearch && matchesCat
  }).sort((a, b) => (a.sort_order ?? a.hw_num ?? 999) - (b.sort_order ?? b.hw_num ?? 999))

  const handleAddSubmit = async (formData) => {
    await addProduct(formData)
    setIsAddModalOpen(false)
  }

  const handleEditSubmit = async (formData) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData)
      setEditingProduct(null)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight font-display">
            Manage Products & Inventory
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1 font-medium">
            Add new collectibles, edit pricing, or toggle items between in-stock and sold out.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => resetCatalog()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-all"
            title="Restore default catalog items"
          >
            Restore Default Catalog
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111111] hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-[#D6FF4A]" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, HW#, series, or color..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-[#F5F5F3] border border-slate-200 rounded-full pl-9 pr-4 py-2 text-xs text-[#111111] placeholder-[#8A8A8A] focus:outline-none focus:border-[#111111]"
          />
          <Search className="w-3.5 h-3.5 text-[#8A8A8A] absolute left-3.5 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto self-end">
          <span className="text-xs text-[#8A8A8A]">Series / Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F5F5F3] border border-slate-200 text-xs text-[#111111] font-semibold rounded-full px-3.5 py-1.5 focus:outline-none focus:border-[#111111] cursor-pointer"
          >
            <option value="all">All Series / Categories ({products.length})</option>
            {distinctCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={(prod) => setEditingProduct(prod)}
        onDelete={(id) => deleteProduct(id)}
        onToggleSoldOut={(id) => toggleSoldOut(id)}
      />

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Anime Merchandise"
      >
        <ProductForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title={`Edit Product: ${editingProduct?.name}`}
      >
        {editingProduct && (
          <ProductForm
            initialProduct={editingProduct}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingProduct(null)}
          />
        )}
      </Modal>
    </div>
  )
}
