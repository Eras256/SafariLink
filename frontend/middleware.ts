import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle Base Account SDK COOP checks and add necessary headers
 * This prevents 500 errors during COOP checks by adding appropriate headers
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add COOP headers to all responses to satisfy Base Account SDK
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Handle HEAD requests for COOP checks (from Base Account SDK)
  if (request.method === 'HEAD') {
    // Return a simple response for HEAD requests
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'HEAD, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return response;
}

// Only run middleware on specific routes to avoid performance issues
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};

