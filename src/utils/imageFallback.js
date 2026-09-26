export const DEFAULT_PRODUCT_FALLBACK = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'

export const handleImageError = (e, fallback = DEFAULT_PRODUCT_FALLBACK) => {
  if (e?.currentTarget && e.currentTarget.src !== fallback) {
    e.currentTarget.onerror = null
    e.currentTarget.src = fallback
  }
}
