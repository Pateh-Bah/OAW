"use client"

import React from "react"
import { Hammer, Wrench } from "lucide-react"

/****
 * BackgroundTools
 * - Decorative, low-opacity tool icons grid for backgrounds
 * - Adapts to current theme via CSS variables
 */
export function BackgroundTools({
  className = "",
  density = 12,
}: {
  className?: string
  density?: number // number of icons per row
}) {
  const icons = [Hammer, Wrench]
  const rows = 4
  const cols = density

  return (
    <div
      aria-hidden
      className={
        "pointer-events-none absolute inset-0 overflow-hidden hero-decor " + className
      }
    >
      {/* gradient wash that adapts to theme */}
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25] mix-blend-multiply">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
             style={{ background: "radial-gradient(closest-side, hsl(var(--oaw-blue)/0.35), transparent)" }} />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
             style={{ background: "radial-gradient(closest-side, hsl(var(--accent)/0.30), transparent)" }} />
      </div>

      {/* icon grid */}
      <div className="absolute inset-0 grid"
           style={{
             gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
             gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
           }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const Icon = icons[i % icons.length]
          const delay = (i % 6) * 0.2
          const size = 16 + ((i * 7) % 16) // 16-32
          return (
            <div key={i} className="flex items-center justify-center">
              <Icon
                className="text-[hsl(var(--oaw-blue)/0.12)] dark:text-[hsl(var(--oaw-blue)/0.18)] animate-float-slow"
                style={{ animationDelay: `${delay}s` }}
                width={size}
                height={size}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
