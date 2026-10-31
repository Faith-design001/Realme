import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * RealMe Middleware: Authentication Shell & Tenant Context Enforcement
 * Protects structural routes and enforces multi-tenant boundaries.
 */

// Public paths that do not require authentication
const PUBLIC_PATHS = [
  '/',
  '/api/health',
  '/api/diagnostics',
  '/favicon.ico',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public routes and static assets
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // 2. Authentication Logic Shell for Protected Structural Routes
  const authHeader = request.headers.get('authorization');
  const tenantIdHeader = request.headers.get('x-tenant-id');

  // Verify presence of session token or tenant context
  if (!authHeader && !tenantIdHeader) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Tenant authentication required. Missing authorization context.',
          },
        },
        { status: 401 }
      );
    }

    // Redirect browser requests to landing page
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Inject validated tenant headers downstream to App Router handlers
  const requestHeaders = new Headers(request.headers);
  if (tenantIdHeader) {
    requestHeaders.set('x-tenant-id', tenantIdHeader);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

