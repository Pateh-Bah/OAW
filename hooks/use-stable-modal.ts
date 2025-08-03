import { useEffect } from 'react'

export function useStableModal() {
  useEffect(() => {
    // Function to force center positioning
    const forceCenterPosition = () => {
      const dialogs = document.querySelectorAll('[data-radix-dialog-content]')
      dialogs.forEach((dialog) => {
        const element = dialog as HTMLElement
        element.style.position = 'fixed'
        element.style.top = '50%'
        element.style.left = '50%'
        element.style.transform = 'translate(-50%, -50%)'
        element.style.right = 'auto'
        element.style.bottom = 'auto'
        element.style.margin = '0'
        element.style.inset = 'auto'
        element.style.zIndex = '50'
      })
    }

    // Force positioning immediately
    forceCenterPosition()

    // Set up mutation observer to handle dynamic changes
    const observer = new MutationObserver(() => {
      setTimeout(forceCenterPosition, 0)
    })

    // Observe changes to dialog elements
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'data-state']
    })

    // Also listen for mouse events that might trigger position changes
    const handleMouseEvents = () => {
      setTimeout(forceCenterPosition, 0)
    }

    document.addEventListener('mouseover', handleMouseEvents)
    document.addEventListener('mouseenter', handleMouseEvents)
    document.addEventListener('mousemove', handleMouseEvents)
    document.addEventListener('focus', handleMouseEvents, true)

    // Cleanup
    return () => {
      observer.disconnect()
      document.removeEventListener('mouseover', handleMouseEvents)
      document.removeEventListener('mouseenter', handleMouseEvents)
      document.removeEventListener('mousemove', handleMouseEvents)
      document.removeEventListener('focus', handleMouseEvents, true)
    }
  }, [])
}
