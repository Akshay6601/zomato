import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplistic token check to run inside Edge middleware context
export function middleware(request: NextRequest) {
  const token = request.cookies.get('zomato_session')?.value;
  const { pathname } = request.nextUrl;

  // Check if session exists (token exists)
  const hasSession = !!token;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (!hasSession && !isAuthPage) {
    // User is not logged in and trying to access protected page
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isAuthPage) {
    // User is logged in and trying to access login/register
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all HTML pages except static assets, favicon, and API paths
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
