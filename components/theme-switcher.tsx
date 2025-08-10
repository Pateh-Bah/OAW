"use client"

import React from "react"
import { useTheme } from "next-themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Moon, Sun, Palette } from "lucide-react"

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "navy", label: "Navy", icon: Palette },
  { value: "blue", label: "Blue", icon: Palette },
  { value: "sky", label: "Sky", icon: Palette },
]

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const current = THEME_OPTIONS.find((t) => t.value === theme) ||
                  THEME_OPTIONS.find((t) => t.value === resolvedTheme) ||
                  THEME_OPTIONS[0]

  if (compact) {
    // Compact icon-only cycle button
    const Icon = current?.icon || Sun
    return (
      <button
        type="button"
        aria-label="Change theme"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => {
          const order = THEME_OPTIONS.map((o) => o.value)
          const idx = order.indexOf(theme || resolvedTheme || "light")
          const next = order[(idx + 1) % order.length]
          setTheme(next)
        }}
      >
        <Icon className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="min-w-[160px]">
      <Select value={theme} onValueChange={(v) => setTheme(v)}>
        <SelectTrigger className="h-9 w-[160px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <SelectItem key={value} value={value}>
              <span className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
