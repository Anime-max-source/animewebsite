export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''

export const isClerkConfigured = Boolean(
  CLERK_PUBLISHABLE_KEY && 
  CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
  !CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export const OWNER_CLERK_ID = import.meta.env.VITE_OWNER_CLERK_ID || 'user_owner_animemax'
export const OWNER_WHATSAPP = import.meta.env.VITE_OWNER_WHATSAPP || '+919876543210'
export const OWNER_UPI_ID = import.meta.env.VITE_OWNER_UPI_ID || 'animemax@upi'

/**
 * Checks if a Clerk user object holds the 'owner' role according to Section 8.1
 * Enforces role via publicMetadata.role === 'owner'
 * @param {object|null} user
 * @returns {boolean}
 */
export function isOwnerUser(user) {
  if (!user) return false
  const role = user.publicMetadata?.role || user.public_metadata?.role
  return role === 'owner' || user.id === OWNER_CLERK_ID
}
