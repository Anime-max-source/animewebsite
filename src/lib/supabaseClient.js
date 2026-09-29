import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
)

// Clean unauthenticated / public client that always uses the valid Supabase anon key
// and does not store or read sessions from localStorage (prevents RS256 token leakage)
export const supabaseAnon = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }) 
  : null

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
    // Only use Clerk third-party template named 'supabase' (configured with Supabase JWT Secret)
    const token = await getter({ template: 'supabase' })
    if (token) {
      // Decode JWT header to verify algorithm
      try {
        const header = JSON.parse(atob(token.split('.')[0]))
        if (header.alg === 'HS256') {
          return token
        } else {
          console.warn(`[Supabase] Clerk token algorithm is ${header.alg}, but PostgREST expects HS256. Skipping token to prevent PGRST301.`)
          return null
        }
      } catch {
        return null
      }
    }
  } catch (err) {
    // Template 'supabase' is not configured in Clerk Dashboard.
    // NOTE: NEVER fall back to getter() without template because Clerk's raw session token
    // is signed with RS256 and will trigger PostgREST error PGRST301 ("No suitable key or wrong key type").
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
