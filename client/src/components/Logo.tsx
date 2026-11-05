import React from 'react';

/* Grid Organism T — symbol only (no "Thayana" text per user request)
   SVG metaball / goo filter for organic TE-inspired logo */
export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo T"
      style={{ animation: 'glow-breathe 6s ease-in-out infinite' }}
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter="url(#goo)">
        {/* Top bar of T */}
        <circle cx="30" cy="30" r="14" fill="var(--accent)" />
        <circle cx="50" cy="30" r="14" fill="var(--accent)" />
        <circle cx="70" cy="30" r="14" fill="var(--accent)" />
        <circle cx="90" cy="30" r="14" fill="var(--accent)" />
        {/* Stem of T */}
        <circle cx="60" cy="50" r="14" fill="var(--accent)" />
        <circle cx="60" cy="70" r="14" fill="var(--accent)" />
        <circle cx="60" cy="90" r="14" fill="var(--accent)" />
      </g>
    </svg>
  );
}
