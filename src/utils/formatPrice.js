/**
 * Formats a number into Indian Rupee currency format (e.g. ₹1,499)
 * @param {number|string} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numeric)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric)
}
