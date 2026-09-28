/**
 * src/lib/cloudinary.js
 *
 * Cloudinary image hosting helpers for AnimeMax.
 *
 * Security model:
 *  - Only unsigned uploads are performed from the browser.
 *  - The upload preset name and cloud name are client-visible (that is fine;
 *    the preset restrictions — allowed formats, max size, fixed folder — do
 *    the real access control on Cloudinary's servers).
 *  - The API Secret is NEVER imported here. If image deletion is needed,
 *    implement it in a Supabase Edge Function that holds the secret server-side.
 */

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {}
const CLOUD_NAME  = env.VITE_CLOUDINARY_CLOUD_NAME  || ''
const PROD_PRESET = env.VITE_CLOUDINARY_PRODUCTS_PRESET || 'animemax_products'
const BAN_PRESET  = env.VITE_CLOUDINARY_BANNERS_PRESET  || 'animemax_banners'

/** True when the env vars are filled in with real values */
export const isCloudinaryConfigured = Boolean(
  CLOUD_NAME && CLOUD_NAME !== 'your_cloud_name'
)

/** The two preset names, exported so callers can reference them by name */
export const PRESETS = {
  products: PROD_PRESET,
  banners:  BAN_PRESET,
}

// ─── Allowed MIME types (what the Cloudinary preset also restricts) ──────────
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
const MAX_BYTES = 5 * 1024 * 1024  // 5 MB

/**
 * Upload a File to Cloudinary using an unsigned upload preset.
 *
 * @param {File}   file   - The image file selected by the user.
 * @param {string} preset - Upload preset name (use PRESETS.products or PRESETS.banners).
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 * @throws {Error} with a human-readable message on validation or network failure.
 */
export async function uploadImage(file, preset = PROD_PRESET) {
  // ── Client-side validation ─────────────────────────────────────────────────
  if (!file) {
    throw new Error('No file provided for upload.')
  }
  if (!ALLOWED_TYPES.has(file.type.toLowerCase())) {
    throw new Error(
      `Invalid file type "${file.type}". Only JPG, PNG, and WebP images are accepted.`
    )
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1)
    throw new Error(
      `File is ${mb} MB — the maximum allowed size is 5 MB. Please compress or resize the image first.`
    )
  }
  if (!isCloudinaryConfigured) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME in your .env file.'
    )
  }

  // ── Build multipart/form-data payload ─────────────────────────────────────
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', preset)

  // ── POST to Cloudinary upload endpoint ────────────────────────────────────
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  let response
  try {
    response = await fetch(endpoint, { method: 'POST', body: fd })
  } catch (networkErr) {
    throw new Error(
      `Network error while uploading to Cloudinary: ${networkErr.message}. ` +
      `Check your internet connection and try again.`
    )
  }

  if (!response.ok) {
    let detail = `HTTP ${response.status}`
    try {
      const body = await response.json()
      detail = body?.error?.message || detail
    } catch { /* ignore */ }
    throw new Error(`Cloudinary upload failed: ${detail}`)
  }

  const data = await response.json()
  if (!data?.secure_url) {
    throw new Error('Cloudinary returned an unexpected response — no secure_url found.')
  }

  return { secure_url: data.secure_url, public_id: data.public_id }
}

/**
 * Apply Cloudinary transformations to a stored image URL.
 *
 * Inserts a transformation segment right after `/upload/` in the URL.
 * Always adds `q_auto,f_auto` for automatic quality + format (WebP on supporting
 * browsers). Width, height, and crop are optional.
 *
 * If the URL is not a Cloudinary URL (e.g. a legacy Supabase URL, an Unsplash
 * URL, or empty/null), returns it unchanged so old data never breaks.
 *
 * @param {string}  url               - Stored image URL.
 * @param {object}  [opts]
 * @param {number}  [opts.width]      - Target width in px.
 * @param {number}  [opts.height]     - Target height in px.
 * @param {string}  [opts.crop]       - Cloudinary crop mode ('fill' | 'limit' | ...).
 * @param {string}  [opts.extra]      - Any additional raw transformation string.
 * @returns {string}
 *
 * Preset sizes used in this project:
 *   Grid card thumb  → { width: 400, height: 500, crop: 'fill' }
 *   Product detail   → { width: 1200 }
 *   Cart thumbnail   → { width: 160, height: 160, crop: 'fill' }
 *   Hero banner      → { width: 1600 }
 */
export function cldUrl(url, { width, height, crop, extra = '' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url || ''

  // Avoid re-transforming an already transformed Cloudinary URL
  if (/\/upload\/[^/]*[a-z]_[^/]+\//.test(url)) return url

  const parts = ['q_auto', 'f_auto']
  if (width)  parts.push(`w_${width}`)
  if (height) parts.push(`h_${height}`)
  const effectiveCrop = crop !== undefined ? crop : (width && height ? 'fill' : '')
  if (effectiveCrop) parts.push(`c_${effectiveCrop}`)
  if (extra) parts.push(extra)

  const transform = parts.join(',')

  // Insert after '/upload/' (handles versioned and non-versioned URLs)
  return url.replace(/\/upload\/(?!.*\/upload\/)/, `/upload/${transform}/`)
}
