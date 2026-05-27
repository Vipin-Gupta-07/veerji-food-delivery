import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Routes that require authentication
const PROTECTED_ROUTES = ['/checkout', '/order-success'];
// Routes that require admin role
const ADMIN_ROUTES = ['/admin'];
// Routes only for non-authenticated users
const AUTH_ROUTES = ['/login', '/signup'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get('auth-token')?.value;
  const user = token ? verifyToken(token) : null;

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL(user.role === 'admin' ? '/admin' : '/restaurant', req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Protect user routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const url = new URL('/login', req.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/checkout/:path*',
    '/order-success/:path*',
    '/login',
    '/signup',
  ],
};
