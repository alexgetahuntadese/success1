import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';

  // Redirect only from universitydoor → successdoor
  if (host.startsWith('universitydoor.vercel.app')) {
    const url = request.nextUrl.clone();

    url.protocol = 'https';
    url.host = 'successdoor.vercel.app';

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

// Avoid running on static files & API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};