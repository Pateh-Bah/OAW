import React from "react"

// WhatsApp-like subtle tiled background using inline SVG icons
// Icons are minimal outlines to suggest aluminium tools/products
export default function BackgroundPattern() {
  return (
  <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] dark:opacity-[0.08]">
      <svg className="h-full w-full" aria-hidden>
        <defs>
          <pattern id="oawPattern" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Set color via CSS variable; child strokes use currentColor */}
            <g style={{ color: "hsl(var(--oaw-blue))" }} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
              {/* Window */}
              <g transform="translate(16,16)">
                <rect x="0" y="0" width="36" height="28" rx="2"/>
                <line x1="18" y1="0" x2="18" y2="28"/>
                <line x1="0" y1="14" x2="36" y2="14"/>
              </g>
              {/* Door */}
              <g transform="translate(100,20)">
                <rect x="0" y="0" width="20" height="36" rx="2"/>
                <circle cx="15" cy="18" r="1.5"/>
              </g>
              {/* Screwdriver */}
              <g transform="translate(24,96)">
                <path d="M0 8 l16 -16 l4 4 l-16 16"/>
                <rect x="16" y="-8" width="10" height="6" rx="2"/>
              </g>
              {/* Screw (head + shaft) */}
              <g transform="translate(72,72)">
                <circle cx="0" cy="0" r="5"/>
                <line x1="-3" y1="0" x2="3" y2="0"/>
                <line x1="0" y1="-3" x2="0" y2="3"/>
                <path d="M0 5 l0 14 m-3 -4 l6 0 m-6 4 l6 0"/>
              </g>
              {/* Drill (simplified) */}
              <g transform="translate(112,100)">
                <path d="M0 6 h16 a3 3 0 0 0 3 -3 v-2 a3 3 0 0 0 -3 -3 h-16 z"/>
                <rect x="2" y="6" width="6" height="6" rx="1"/>
                <path d="M19 2 h6 l3 2 l-3 2 h-6"/>
                <path d="M8 12 v8 h4"/>
              </g>
              {/* Rivet */}
              <g transform="translate(52,28)">
                <circle cx="0" cy="0" r="3"/>
                <line x1="0" y1="3" x2="0" y2="14"/>
              </g>
              {/* Rivet gun (very simplified) */}
              <g transform="translate(136,48)">
                <path d="M0 0 h16 v6 h-10 l-2 4 h-4 z"/>
                <line x1="16" y1="3" x2="24" y2="3"/>
              </g>
              {/* Mesh (grid) */}
              <g transform="translate(28,52)">
                <rect x="0" y="0" width="18" height="18" rx="2"/>
                <path d="M6 0 v18 M12 0 v18 M0 6 h18 M0 12 h18"/>
              </g>
              {/* Aluminium wall panel */}
              <g transform="translate(84,124)">
                <rect x="0" y="0" width="32" height="18" rx="2"/>
                <path d="M2 4 h28 M2 9 h28 M2 14 h28"/>
              </g>
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#oawPattern)"/>
      </svg>
    </div>
  )
}
