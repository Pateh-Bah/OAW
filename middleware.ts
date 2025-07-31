import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Get the pathname
  const pathname = req.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup']
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard']

  // For now, we'll handle authentication on the client side
  // This middleware mainly handles route protection
  
  // Allow access to public routes
  if (publicRoutes.includes(pathname) || pathname.startsWith('/auth/')) {
    return res
  }

  // For protected routes, let the client-side auth handle it
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
