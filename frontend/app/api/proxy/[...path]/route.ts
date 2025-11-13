/**
 * API Proxy Route para Next.js
 * Permite que el frontend haga requests al backend sin problemas de CORS
 * y sin necesidad de configurar URLs en el cliente
 */

import { NextRequest, NextResponse } from 'next/server';

// URL del backend - puede venir de variable de entorno o usar detección
function getBackendUrl(): string {
  // Prioridad 1: Variable de entorno explícita
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Prioridad 2: Variable de entorno del servidor (no expuesta al cliente)
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  
  // Prioridad 3: Detección automática basada en el host de Vercel
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && !vercelUrl.includes('localhost')) {
    // En Vercel, intentar usar subdominio api
    const hostname = vercelUrl.replace('https://', '').replace('http://', '').split('/')[0];
    // Si es safari-link.vercel.app, intentar api.safari-link.vercel.app
    // Pero esto solo funciona si el backend está en ese subdominio
    // Por ahora, retornar null para que el proxy falle claramente
    // y el usuario sepa que necesita configurar la variable
    return `https://api.${hostname}`;
  }
  
  // Prioridad 4: Valor por defecto (solo para desarrollo local)
  // En producción sin configuración, esto fallará intencionalmente
  // para que el usuario sepa que necesita configurar el backend
  return process.env.NODE_ENV === 'production' 
    ? '' // En producción sin config, retornar vacío para error claro
    : 'http://localhost:4000';
}

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'DELETE');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PATCH');
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const backendUrl = getBackendUrl();
    
    // Si no hay backend configurado en producción, retornar error claro
    if (!backendUrl) {
      return NextResponse.json(
        { 
          error: 'Backend not configured',
          message: 'El backend no está configurado. Por favor configura NEXT_PUBLIC_API_URL o BACKEND_URL en las variables de entorno de Vercel.',
          hint: 'Si no tienes backend desplegado, esta funcionalidad no estará disponible.'
        },
        { status: 503 }
      );
    }
    
    const path = params.path.join('/');
    const url = new URL(path, `${backendUrl}/api/`);
    
    // Copiar query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.append(key, value);
    });

    // Preparar headers
    const headers = new Headers();
    request.headers.forEach((value, key) => {
      // Excluir headers que no deben pasarse
      if (
        !key.toLowerCase().startsWith('host') &&
        !key.toLowerCase().startsWith('x-vercel') &&
        !key.toLowerCase().startsWith('x-forwarded')
      ) {
        headers.set(key, value);
      }
    });

    // Preparar body
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch {
        // No body
      }
    }

    // Hacer la petición al backend
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
    });

    // Copiar respuesta
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
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error', message: error.message },
      { status: 500 }
    );
  }
}

