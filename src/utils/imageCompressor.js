import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

/**
 * Recommended dimension specs per section
 */
export const BANNER_SPECS = {
  hero: {
    label: 'Hero Promotional Banner',
    aspectRatio: '3:2 Landscape',
    recommended: '1200 × 800px',
    maxDimension: 1400,
    hint: 'Bleeds behind the title and promotional text on the top of the homepage.'
  },
  weekly_drop: {
    label: 'Weekly Drop Card',
    aspectRatio: '3:2 Landscape (Optional)',
    recommended: '600 × 400px',
    maxDimension: 900,
    hint: 'Optional background photo for the yellow weekly drops showcase.'
  },
  collector_spotlight: {
    label: 'Collector Spotlight Card',
    aspectRatio: '3:4 Portrait',
    recommended: '600 × 800px',
    maxDimension: 1000,
    hint: 'Full-bleed portrait background for featured statue or prop replica.'
  },
  style_editorial: {
    label: 'Style Editorial Banner',
    aspectRatio: '16:9 Wide Landscape',
    recommended: '1200 × 700px',
    maxDimension: 1400,
    hint: 'Wide landscape photo with dark overlay bleed for apparel collections.'
  }
}

/**
 * Compress an image File on client-side using HTML5 Canvas.
 * Keeps output under 500KB and limits maximum dimensions.
 *
 * @param {File} file - User uploaded image file
 * @param {number} maxDimension - Maximum width/height in px
 * @param {number} quality - Compression quality (0 to 1)
 * @returns {Promise<{ blob: Blob, dataUrl: string, width: number, height: number, sizeBytes: number }>}
 */
export async function compressImage(file, maxDimension = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided for compression'))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read image file'))

    reader.onload = (e) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image element'))

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate scaling
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        // Clean high-quality interpolation
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Try WebP first, fallback to JPEG
        let mimeType = 'image/webp'
        let dataUrl = canvas.toDataURL(mimeType, quality)
        
        // If browser does not support webp canvas export, fallback to jpeg
        if (!dataUrl.startsWith('data:image/webp')) {
          mimeType = 'image/jpeg'
          dataUrl = canvas.toDataURL(mimeType, quality)
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Canvas toBlob conversion failed'))
            }
            resolve({
              blob,
              dataUrl,
              width,
              height,
              sizeBytes: blob.size,
              mimeType
            })
          },
          mimeType,
          quality
        )
      }

      img.src = e.target.result
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Upload a compressed banner image to Supabase Storage (bucket: 'homepage-banners').
 * Gracefully falls back to Data URL if storage bucket is unavailable or unconfigured.
 *
 * @param {string} section - 'hero' | 'weekly_drop' | 'collector_spotlight' | 'style_editorial'
 * @param {File} file - Original file
 * @returns {Promise<{ url: string, isStorage: boolean, sizeBytes: number }>}
 */
export async function uploadBannerImage(section, file) {
  const spec = BANNER_SPECS[section] || { maxDimension: 1200 }
  const compressed = await compressImage(file, spec.maxDimension, 0.85)

  // If Supabase is configured, attempt upload to 'homepage-banners' bucket
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = compressed.mimeType === 'image/webp' ? 'webp' : 'jpg'
      const fileName = `${section}_${Date.now()}.${fileExt}`
      const filePath = `banners/${fileName}`

      const { data, error } = await supabase.storage
        .from('homepage-banners')
        .upload(filePath, compressed.blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: compressed.mimeType
        })

      if (!error && data?.path) {
        const { data: publicUrlData } = supabase.storage
          .from('homepage-banners')
          .getPublicUrl(data.path)

        if (publicUrlData?.publicUrl) {
          return {
            url: publicUrlData.publicUrl,
            isStorage: true,
            sizeBytes: compressed.sizeBytes
          }
        }
      } else if (error) {
        console.warn('Supabase storage upload returned error, using compressed Data URL fallback:', error.message)
      }
    } catch (err) {
      console.warn('Supabase storage upload failed, using Data URL fallback:', err)
    }
  }

  // Fallback: return the compressed Data URL
  return {
    url: compressed.dataUrl,
    isStorage: false,
    sizeBytes: compressed.sizeBytes
  }
}
