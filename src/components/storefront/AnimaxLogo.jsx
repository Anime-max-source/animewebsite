import React, { useEffect, useState } from 'react'

/**
 * AnimaxLogo — Kinetic Editorial wordmark.
 *
 * Rendering strategy:
 *  • Mounts in "pending" state with a zero-opacity placeholder that
 *    preserves layout space (prevents CLS / reflow smearing).
 *  • Listens for the Syne font to become ready via document.fonts.
 *    Once it's available, sets fontReady=true and fades in at full opacity.
 *  • This eliminates the "smudged/blurry" appearance that happened when
 *    the browser painted the wordmark in a wrong-width fallback font before
 *    Syne loaded (sub-pixel hinting on differently-wide glyphs → blur).
 *
 * Sizing rules (from prompt):
 *  • Only HEIGHT is ever set on the wrapper (h-8 mobile / h-10 desktop).
 *  • width: auto — never both fixed w+h, never fixed px on both axes.
 *  • flex-shrink: 0 — the header flex container cannot squash the logo.
 *
 * Icon-only variant:
 *  • Below 360 px we swap to a single red square (🔥 replaced with flame
 *    shape drawn in pure CSS, no emoji, no SVG font dep) so the header
 *    never crowds on very small phones.
 */
export default function AnimaxLogo({ className = 'h-8', iconOnly = false, style = {} }) {
  const [fontReady, setFontReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Check immediately in case fonts were already loaded (repeat visits / fast
    // connections). If not, wait for the specific Syne 800 face.
    const checkFont = async () => {
      try {
        if (document.fonts && document.fonts.check) {
          if (document.fonts.check('800 1em Syne')) {
            if (!cancelled) setFontReady(true)
            return
          }
          await document.fonts.load('800 1em Syne')
          if (!cancelled) setFontReady(true)
        } else {
          // Fallback: assume ready after a short timeout (older browsers)
          setTimeout(() => { if (!cancelled) setFontReady(true) }, 400)
        }
      } catch {
        // If the Font Loading API fails, render anyway after 500 ms
        setTimeout(() => { if (!cancelled) setFontReady(true) }, 500)
      }
    }

    checkFont()
    return () => { cancelled = true }
  }, [])

  // ── Icon-only variant (for ≤360 px header) ──────────────────────────────
  if (iconOnly) {
    return (
      <span
        aria-label="AnimeMax"
        className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}
        style={{
          width: 'auto',
          aspectRatio: '1',
          background: '#DC2626',
          borderRadius: '6px',
          ...style,
        }}
      >
        {/* Flame icon via Phosphor — no SVG text dep, no emoji */}
        <svg
          viewBox="0 0 24 24"
          fill="white"
          aria-hidden="true"
          style={{ width: '60%', height: '60%' }}
        >
          <path d="M12 2C12 2 7 8 7 13a5 5 0 0010 0c0-5-5-11-5-11zm0 14.5a2.5 2.5 0 01-2.5-2.5c0-2.5 2.5-5 2.5-5s2.5 2.5 2.5 5a2.5 2.5 0 01-2.5 2.5z" />
        </svg>
      </span>
    )
  }

  // ── Full wordmark ────────────────────────────────────────────────────────
  return (
    <span
      aria-label="AnimeMax"
      className={`inline-flex items-center flex-shrink-0 ${className}`}
      style={{
        // Height is set by the className (h-8 / h-10 / text-*). Width is auto.
        width: 'auto',
        // Hide until font is confirmed — preserves layout space so no CLS jump
        opacity: fontReady ? 1 : 0,
        transition: 'opacity 0.15s ease',
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        // Inherit height from className so we never set both w+h explicitly
        fontSize: 'inherit',
        ...style,
      }}
    >
      <span style={{ color: '#111111' }}>Anime</span>
      <span style={{ color: '#DC2626' }}>Max</span>
    </span>
  )
}
