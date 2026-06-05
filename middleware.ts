import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function validateSession(token: string | null): { valid: boolean; userId?: number; email?: string } | null {
  if (!token) return null;
  
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');
    if (parts.length >= 3) {
      const userId = parseInt(parts[0], 10);
      const email = parts[1];
      if (!isNaN(userId) && email) {
        return { valid: true, userId, email };
      }
    }
  } catch (e) {
    // Invalid token
  }
  
  return { valid: false };
}

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value
  const session = validateSession(sessionToken ?? null)
  const isLoggedIn = session?.valid ?? false

  const { pathname } = request.nextUrl

  // Redirect root based on login status
  if (pathname === '/') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/timesheets', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect timesheets routes
  if (pathname.startsWith('/timesheets')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect logged-in users away from login page
  if (pathname.startsWith('/login') && isLoggedIn) {
    return NextResponse.redirect(new URL('/timesheets', request.url))
  }

  // Allow other paths to proceed
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}