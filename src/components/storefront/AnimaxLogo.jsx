import React from 'react'

/**
 * AnimeMax wordmark — "Anime" in #111111 + "Max" in #DC2626.
 * Uses 'Syne' font (800 weight) with Kinetic Editorial styling.
 * Pure HTML/CSS wordmark that scales with text size classes without clipping.
 */
export default function AnimaxLogo({ className = 'text-2xl', style = {} }) {
  return (
    <span
      className={`inline-flex items-center font-['Syne'] font-extrabold tracking-[-0.03em] leading-none whitespace-nowrap select-none ${className}`}
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        ...style
      }}
      aria-label="AnimeMax"
    >
      <span style={{ color: '#111111' }}>Anime</span>
      <span style={{ color: '#DC2626' }}>Max</span>
    </span>
  )
}
