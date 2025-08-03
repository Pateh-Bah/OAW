"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs sm:text-sm">
              OAW
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white hidden xs:block">
              Overhead Aluminium Workshop
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white xs:hidden">
              OAW
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 px-1">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 px-1">
              About
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 px-1">
              Services
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors py-2 px-1">
              Contact
            </Link>
            <Button asChild className="h-9 px-4 lg:px-6 text-sm">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors min-touch-target"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t bg-white dark:bg-gray-900">
            <Link 
              href="/" 
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors rounded-md mx-2 min-touch-target"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors rounded-md mx-2 min-touch-target"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/services" 
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors rounded-md mx-2 min-touch-target"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors rounded-md mx-2 min-touch-target"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <div className="px-4 pt-2">
              <Button asChild className="w-full h-12 text-base font-medium">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}