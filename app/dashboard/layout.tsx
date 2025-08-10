"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthProvider } from "@/contexts/AuthContext"
import { useState, useEffect } from "react"
import { 
  Home, 
  Users, 
  UserCheck, 
  Building, 
  FolderOpen, 
  Calculator, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeSwitcher } from "@/components/theme-switcher"

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Staff', href: '/dashboard/staff', icon: Users },
  { name: 'Customers', href: '/dashboard/customers', icon: UserCheck },
  { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
  { name: 'Sites', href: '/dashboard/sites', icon: Building },
  { name: 'Budget', href: '/dashboard/budget', icon: Calculator },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('mobile-sidebar')
      const menuButton = document.getElementById('mobile-menu-button')
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  // Close sidebar when route changes (mobile navigation)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60 shadow-sm">
          <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Mobile menu button */}
              <Button
                id="mobile-menu-button"
                variant="ghost"
                size="icon"
                className="lg:hidden text-oaw-text hover:bg-oaw-blue-light h-9 w-9"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-oaw-blue text-white font-bold text-xs sm:text-sm shadow-sm">
                  OAW
                </div>
                <span className="font-semibold text-oaw-text text-sm sm:text-base hidden xs:block">
                  Dashboard
                </span>
              </Link>
              
              {/* Desktop search - hidden on mobile */}
              <div className="relative w-48 sm:w-64 hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-oaw-text-light" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 h-8 sm:h-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-oaw-text text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:block">
                <ThemeSwitcher />
              </div>
              {/* Mobile search button */}
              <Button variant="ghost" size="icon" className="md:hidden text-oaw-text hover:bg-oaw-blue-light h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="relative text-oaw-text hover:bg-oaw-blue-light h-9 w-9">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 text-xs bg-oaw-blue text-white">
                  3
                </Badge>
              </Button>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />
              {/* Compact theme button on small screens */}
              <div className="md:hidden">
                <ThemeSwitcher compact />
              </div>
              
              <Button 
                variant="ghost" 
                onClick={handleLogout} 
                className="gap-2 text-oaw-text hover:bg-red-50 hover:text-red-600 h-9 px-2 sm:px-3"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:top-14 sm:lg:top-16 lg:z-30 lg:w-64 lg:bg-white lg:dark:bg-gray-900 lg:shadow-sm lg:flex">
            <div className="flex h-full w-full flex-col">
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-oaw-blue-light text-oaw-blue shadow-sm border border-oaw-blue/20"
                          : "text-oaw-text-light hover:bg-gray-50 hover:text-oaw-text dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4">
                <div className="flex items-center gap-3 rounded-lg bg-oaw-blue-light p-3 border border-oaw-blue/20">
                  <div className="h-8 w-8 rounded-full bg-oaw-blue flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-oaw-text">
                      Admin User
                    </p>
                    <p className="text-xs text-oaw-text-light">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          <aside 
            id="mobile-sidebar"
            className={`fixed inset-y-0 left-0 top-14 sm:top-16 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex h-full flex-col">
              {/* Mobile sidebar header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-oaw-text">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  className="text-oaw-text hover:bg-gray-100 dark:hover:bg-gray-800 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-oaw-blue-light text-oaw-blue shadow-sm border border-oaw-blue/20"
                          : "text-oaw-text-light hover:bg-gray-50 hover:text-oaw-text dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t">
                <div className="flex items-center gap-3 rounded-lg bg-oaw-blue-light p-3 border border-oaw-blue/20">
                  <div className="h-8 w-8 rounded-full bg-oaw-blue flex items-center justify-center text-white text-sm font-medium shadow-sm flex-shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-oaw-text">
                      Admin User
                    </p>
                    <p className="text-xs text-oaw-text-light">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 lg:pl-64">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}