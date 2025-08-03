// Accessibility fixes for form elements
export const fixFormAccessibility = () => {
  // Fix hidden file inputs without proper labels
  const hiddenFileInputs = document.querySelectorAll('input[type="file"][style*="display: none"], input[type="file"][style*="display:none"]')
  
  hiddenFileInputs.forEach((input, index) => {
    const inputElement = input as HTMLInputElement
    
    // Add required accessibility attributes if missing
    if (!inputElement.getAttribute('title') && !inputElement.getAttribute('aria-label')) {
      inputElement.setAttribute('aria-label', 'File upload')
      inputElement.setAttribute('title', 'Choose file to upload')
    }
    
    // Add a unique ID if missing
    if (!inputElement.id) {
      inputElement.id = `file-input-${index}`
    }
    
    // Make it properly hidden for screen readers but still accessible
    inputElement.className = 'sr-only'
    inputElement.removeAttribute('style')
  })
  
  // Fix any buttons without proper labels or roles
  const unlabeledButtons = document.querySelectorAll('button:not([aria-label]):not([title]):empty')
  unlabeledButtons.forEach((button, index) => {
    const buttonElement = button as HTMLButtonElement
    buttonElement.setAttribute('aria-label', `Button ${index + 1}`)
  })
  
  // Fix elements with user-select issues
  const selectElements = document.querySelectorAll('.sidebar-entry-btn, [class*="sidebar"], button, [role="button"]')
  selectElements.forEach(element => {
    const el = element as HTMLElement
    if (el.style.userSelect || getComputedStyle(el).userSelect !== 'none') {
      el.style.setProperty('-webkit-user-select', 'none')
      el.style.setProperty('-moz-user-select', 'none')
      el.style.setProperty('-ms-user-select', 'none')
      el.style.setProperty('user-select', 'none')
    }
  })
}

// Run accessibility fixes when DOM is ready
if (typeof window !== 'undefined') {
  // Run immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixFormAccessibility)
  } else {
    fixFormAccessibility()
  }
  
  // Also run after any dynamic content changes
  const observer = new MutationObserver(() => {
    setTimeout(fixFormAccessibility, 100)
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
  
  // Export cleanup function
  const cleanup = () => {
    observer.disconnect()
    document.removeEventListener('DOMContentLoaded', fixFormAccessibility)
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup)
}
