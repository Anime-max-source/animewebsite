/**
 * Validates 10-digit Indian mobile number or international phone format
 * @param {string} phone
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone) return false
  const clean = phone.replace(/[\s\-\(\)\+]/g, '')
  // Validates standard 10-digit number or with 91 prefix
  return /^[6-9]\d{9}$/.test(clean) || /^91[6-9]\d{9}$/.test(clean)
}

/**
 * Validates non-empty string
 * @param {string} str
 * @param {number} minLength
 * @returns {boolean}
 */
export function isNonEmpty(str, minLength = 1) {
  return typeof str === 'string' && str.trim().length >= minLength
}

/**
 * Validates checkout form data
 * @param {{ buyer_name: string, buyer_phone: string, buyer_whatsapp: string, buyer_address: string }} form
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateCheckoutForm(form) {
  const errors = {}

  if (!isNonEmpty(form.buyer_name, 2)) {
    errors.buyer_name = 'Please enter your full name (at least 2 characters)'
  }

  if (!isValidPhone(form.buyer_phone)) {
    errors.buyer_phone = 'Please enter a valid 10-digit mobile number'
  }

  if (!isValidPhone(form.buyer_whatsapp)) {
    errors.buyer_whatsapp = 'Please enter a valid 10-digit WhatsApp number to receive your payment QR'
  }

  if (!isNonEmpty(form.buyer_address, 10)) {
    errors.buyer_address = 'Please enter a complete delivery address with PIN code (min 10 characters)'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}
