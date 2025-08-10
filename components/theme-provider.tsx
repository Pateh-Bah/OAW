"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      value={{
        light: "light",
        dark: "dark",
        navy: "navy",
        blue: "blue",
        sky: "sky",
      }}
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}