import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
)

let clerkTokenGetter = null

/**
 * Register Clerk's getToken function (called by ClerkAuthSync)
 * so every Supabase operation automatically includes the signed-in user/owner JWT.
 * @param {Function|null} getter 
 */
export function setClerkTokenGetter(getter) {
  clerkTokenGetter = getter
}

export function getClerkTokenGetter() {
  return clerkTokenGetter
}

async function resolveClerkToken(getter) {
  if (typeof getter !== 'function') return null
  try {
    // 1. First attempt: standard Clerk third-party template named 'supabase'
    const token = await getter({ template: 'supabase' })
    if (token) return token
  } catch (err) {
    // Template 'supabase' may not be configured in Clerk Dashboard; fall back to session token
  }

  try {
    // 2. Fallback: Clerk session JWT
    const fallbackToken = await getter()
    if (fallbackToken) return fallbackToken
  } catch (err) {
    console.warn('Failed to retrieve Clerk session token:', err)
  }

  return null
}

// Supabase client instance with dynamic third-party auth wiring for Storefront and Admin
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      accessToken: async () => {
        return await resolveClerkToken(clerkTokenGetter)
      },
      global: {
        headers: async () => {
          const token = await resolveClerkToken(clerkTokenGetter)
          if (token) {
            return { Authorization: `Bearer ${token}` }
          }
          return {}
        }
      }
    })
  : null

/**
 * Creates an authenticated Supabase client using an explicit or registered token getter.
 * @param {Function} [customGetter] - optional function returning Clerk JWT
 */
export function getAuthenticatedSupabase(customGetter) {
  if (!isSupabaseConfigured) return null
  const getter = customGetter || clerkTokenGetter

  return createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => {
      return await resolveClerkToken(getter)
    },
    global: {
      headers: async () => {
        const token = await resolveClerkToken(getter)
        if (token) {
          return { Authorization: `Bearer ${token}` }
        }
        return {}
      }
    }
  })
}
