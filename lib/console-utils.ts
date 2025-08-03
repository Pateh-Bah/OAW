// Console cleanup and debugging helper
// Add this to suppress unwanted console messages in development

declare global {
  interface Window {
    debugOAW?: {
      enable: () => void
      disable: () => void
      test: () => void
    }
  }
}

if (typeof window !== 'undefined') {
  // Store original console methods
  const originalConsole = {
    log: console.log,
    debug: console.debug,
    warn: console.warn,
    error: console.error
  }

  // Filter out noisy debug messages
  const noisyPatterns = [
    /\[AskAI Debug\]/,
    /Download the React DevTools/,
    /Fast Refresh/
  ]

  // Custom console wrapper
  const filterConsole = (method: keyof typeof originalConsole, ...args: any[]) => {
    const message = args.join(' ')
    
    // Skip noisy messages
    if (noisyPatterns.some(pattern => pattern.test(message))) {
      return
    }
    
    // Allow our app messages through
    originalConsole[method](...args)
  }

  // Override console methods
  console.log = (...args) => filterConsole('log', ...args)
  console.debug = (...args) => filterConsole('debug', ...args)
  console.warn = (...args) => filterConsole('warn', ...args)
  
  // Keep errors always visible
  console.error = (...args) => originalConsole.error(...args)

  // Add our own debug helper
  window.debugOAW = {
    enable: () => {
      console.log = originalConsole.log
      console.debug = originalConsole.debug
      console.warn = originalConsole.warn
      console.log('🔧 OAW Debug mode enabled')
    },
    disable: () => {
      console.log = (...args) => filterConsole('log', ...args)
      console.debug = (...args) => filterConsole('debug', ...args)
      console.warn = (...args) => filterConsole('warn', ...args)
      originalConsole.log('🔇 OAW Debug mode disabled - console cleaned')
    },
    test: () => {
      originalConsole.log('🧪 Testing OAW Application...')
      // Test if we're in the app context
      originalConsole.log('✅ Console utility loaded successfully')
    }
  }

  // Auto-clean console in production
  if (process.env.NODE_ENV === 'production') {
    // Disable all console logs in production except errors
    console.log = () => {}
    console.debug = () => {}
    console.warn = () => {}
  }
}

export {}
