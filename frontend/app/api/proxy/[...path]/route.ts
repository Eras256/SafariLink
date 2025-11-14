/**
 * API Proxy Route for Next.js
 * Allows frontend to make requests to backend without CORS issues
 * and without needing to configure URLs on the client
 */

import { NextRequest, NextResponse } from 'next/server';

// Backend URL - can come from environment variable or use detection
function getBackendUrl(): string {
  // Priority 1: Explicit environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Priority 2: Server environment variable (not exposed to client)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  
  // Priority 3: Automatic detection based on Vercel host
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && !vercelUrl.includes('localhost')) {
    // On Vercel, try to use api subdomain
    const hostname = vercelUrl.replace('https://', '').replace('http://', '').split('/')[0];
    // If it's safari-link.vercel.app, try api.safari-link.vercel.app
    // But this only works if backend is on that subdomain
    // For now, return null so proxy fails clearly
    // and user knows they need to configure the variable
    return `https://api.${hostname}`;
  }
  
  // Priority 4: Default value (only for local development)
  // In production without configuration, this will intentionally fail
  // so user knows they need to configure the backend
  return process.env.NODE_ENV === 'production' 
    ? '' // In production without config, return empty for clear error
    : 'http://localhost:4000';
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const backendUrl = getBackendUrl();
    
    // If no backend configured in production, return clear error
    if (!backendUrl) {
      return NextResponse.json(
        { 
          error: 'Backend not configured',
          message: 'Backend is not configured. Please configure NEXT_PUBLIC_API_URL or BACKEND_URL in Vercel environment variables.',
          hint: 'If you don\'t have a backend deployed, this functionality will not be available.'
        },
        { status: 503 }
      );
    }
    
    const path = params.path.join('/');
    const url = new URL(path, `${backendUrl}/api/`);
    
    // Copy query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Prepare headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Exclude headers that should not be passed
      if (
        !key.toLowerCase().startsWith('host') &&
        !key.toLowerCase().startsWith('x-vercel') &&
        !key.toLowerCase().startsWith('x-forwarded')
      ) {
        headers.set(key, value);
      }
    });

    // Prepare body
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch {
        // No body
      }
    }

    // Make request to backend with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds
    
    try {
      const response = await fetch(url.toString(), {
        method,
        headers,
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Copy response
      const data = await response.text();
      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch {
        jsonData = data;
      }

      return NextResponse.json(jsonData, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If it's a connection error, backend is not available
      if (fetchError.name === 'AbortError' || fetchError.message?.includes('fetch failed') || fetchError.message?.includes('ECONNREFUSED')) {
        return NextResponse.json(
          { 
            error: 'Backend not available',
            message: 'Backend is not available. This functionality requires a deployed and configured backend.',
            hint: 'If you don\'t have a backend deployed, this functionality will not be available.'
          },
          { status: 503 }
        );
      }
      throw fetchError;
    }
  } catch (error: any) {
    console.error('Proxy error:', error);
    
    // If it's already a JSON error response, return it
    if (error.status && error.json) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Proxy error', 
        message: 'Error processing request. Backend may not be available.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

