import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/signup'];
const PROTECTED_ROUTES = ['/checkout', '/order-success'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth-token')?.value;

  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (token) return NextResponse.redirect(new URL('/', req.url));
    return NextResponse.next();
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }

  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*', '/order-success/:path*', '/login', '/signup'],
};