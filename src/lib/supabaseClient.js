import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
)

// Default unauthenticated / public client
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null

/**
 * Creates an authenticated Supabase client that injects Clerk's JWT
 * for Supabase Row Level Security (RLS) enforcement.
 * @param {Function} getClerkToken - function returning Clerk JWT session token
 */
export function getAuthenticatedSupabase(getClerkToken) {
  if (!isSupabaseConfigured) return null

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: async () => {
        try {
          const token = await getClerkToken({ template: 'supabase' })
          if (token) {
            return { Authorization: `Bearer ${token}` }
          }
        } catch (err) {
          console.warn('Failed to retrieve Clerk Supabase JWT:', err)
        }
        return {}
      }
    }
  })
}
