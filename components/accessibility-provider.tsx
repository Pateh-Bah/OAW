'use client'

import { useEffect } from 'react'
import { fixFormAccessibility } from '@/lib/accessibility-fixes'

export function AccessibilityProvider() {
  useEffect(() => {
    // Fix accessibility issues when component mounts
    fixFormAccessibility()
    
    // Set up periodic checks for dynamically added content
    const intervalId = setInterval(fixFormAccessibility, 2000)
    
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return null // This component doesn't render anything
}
