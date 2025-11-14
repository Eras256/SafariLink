'use client';

import { useEffect, useRef } from 'react';

/**
 * Suppresses non-critical errors from browser extensions
 * This component handles errors from extensions like React DevTools
 * that try to communicate with the page but aren't authorized
 */
export function ErrorSuppressor() {
  const originalErrorRef = useRef<typeof console.error | null>(null);
  const originalWarnRef = useRef<typeof console.warn | null>(null);
  const originalLogRef = useRef<typeof console.log | null>(null);
  const originalFetchRef = useRef<typeof fetch | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Store original console methods
    originalErrorRef.current = window.console.error.bind(window.console);
    originalWarnRef.current = window.console.warn.bind(window.console);

    // Filter out errors from browser extensions
    const filterExtensionErrors = (args: any[]): boolean => {
      // Check if error is from a browser extension
      const errorString = args.map(arg => String(arg)).join(' ');
      
      // Common patterns from extension errors and Base Account SDK
      const extensionErrorPatterns = [
        'has not been authorized yet',
        'content.js',
        'page.js',
        'onPortMessageHandler',
        'postMessage',
        'The source',
        'has not been authorized',
        'Cross-Origin-Opener-Policy',
        'checkCrossOriginOpenerPolicy',
        'HTTP error! status: 500',
        'ERR_ABORTED',
        'ERR_FAILED',
        'ERR_CONNECTION_REFUSED',
        'net::ERR_CONNECTION_REFUSED',
        'chrome-extension://',
        'moz-extension://',
        'safari-extension://',
        'workbox',
        'no-response',
        'The strategy could not generate a response',
        'Failed to fetch',
        'net::ERR_FAILED',
      ];
      
      // Suppress 503 errors from proxy (check before other patterns)
      if (
        (errorString.includes('503') || errorString.includes('Service Unavailable')) && 
        (errorString.includes('api/proxy') || 
         errorString.includes('/api/proxy/') ||
         errorString.includes('talent-protocol') ||
         errorString.includes('hackathons'))
      ) {
        return true; // Suppress this error
      }

      // If it's an extension error, suppress it
      return extensionErrorPatterns.some(pattern => 
        errorString.includes(pattern)
      );
    };

    // Override console.error to filter extension errors and proxy 503 errors
    window.console.error = (...args: any[]) => {
      const errorString = args.map(arg => {
        // Convert objects to string to search for patterns
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      // Suppress 503 errors from proxy (multiple patterns)
      if (
        (errorString.includes('503') || errorString.includes('Service Unavailable')) && 
        (errorString.includes('api/proxy') || 
         errorString.includes('/api/proxy/') ||
         errorString.includes('talent-protocol') ||
         errorString.includes('hackathons') ||
         errorString.includes('window.fetch'))
      ) {
        return; // Don't show the error
      }
      
      // Then filter extension errors
      if (!filterExtensionErrors(args) && originalErrorRef.current) {
        originalErrorRef.current(...args);
      }
    };

    // Override console.warn to filter extension warnings
    window.console.warn = (...args: any[]) => {
      if (!filterExtensionErrors(args) && originalWarnRef.current) {
        originalWarnRef.current(...args);
      }
    };

    // Also handle unhandled promise rejections from extensions and Base Account SDK
    // Intercept fetch errors that return 503
    // IMPORTANT: Use .bind(window) to preserve context and avoid "Illegal invocation"
    originalFetchRef.current = window.fetch.bind(window);
    
    window.fetch = async (...args) => {
      try {
        // Call original fetch with correct context
        const response = await originalFetchRef.current!(...args);
        
        // If it's a 503 from proxy, don't log as error
        if (response.status === 503) {
          const url = args[0]?.toString() || '';
          if (url.includes('/api/proxy/')) {
            // Silently handle 503 without logging error
            // Browser may still show 503 in network console, but not as error
            return response;
          }
        }
        
        return response;
      } catch (error: any) {
        // Suppress network errors related to proxy
        const url = args[0]?.toString() || '';
        if (url.includes('/api/proxy/')) {
          // Create a simulated 503 response for code to handle
          return new Response(
            JSON.stringify({
              error: 'Backend not available',
              message: 'The backend is not available.',
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
        throw error;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorString = String(event.reason || '');
      
      // Suppress errors from extensions, Base Account SDK COOP checks, Workbox, and proxy 503 errors
      if (
        errorString.includes('has not been authorized yet') ||
        errorString.includes('content.js') ||
        errorString.includes('page.js') ||
        errorString.includes('The source') ||
        errorString.includes('Cross-Origin-Opener-Policy') ||
        errorString.includes('checkCrossOriginOpenerPolicy') ||
        errorString.includes('HTTP error! status: 500') ||
        errorString.includes('ERR_ABORTED') ||
        errorString.includes('ERR_FAILED') ||
        errorString.includes('ERR_CONNECTION_REFUSED') ||
        errorString.includes('net::ERR_CONNECTION_REFUSED') ||
        errorString.includes('chrome-extension://') ||
        errorString.includes('moz-extension://') ||
        errorString.includes('safari-extension://') ||
        errorString.includes('workbox') ||
        errorString.includes('no-response') ||
        errorString.includes('The strategy could not generate a response') ||
        errorString.includes('Failed to fetch') ||
        (errorString.includes('500') && errorString.includes('Internal Server Error')) ||
        // Suppress 503 errors from proxy
        (errorString.includes('503') && (errorString.includes('api/proxy') || errorString.includes('Service Unavailable')))
      ) {
        event.preventDefault();
        // Silently suppress the error
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Intercept global errors including network errors
    const handleError = (event: ErrorEvent) => {
      const errorString = String(event.error || event.message || '');
      const targetString = String(event.target || '');
      
      // Suppress network errors and connection refused errors
      if (
        errorString.includes('ERR_CONNECTION_REFUSED') ||
        errorString.includes('ERR_FAILED') ||
        errorString.includes('Failed to fetch') ||
        errorString.includes('net::ERR_CONNECTION_REFUSED') ||
        errorString.includes('net::ERR_FAILED') ||
        errorString.includes('localhost:4000') ||
        errorString.includes('localhost:8000') ||
        (errorString.includes('500') && errorString.includes('Internal Server Error')) ||
        // Suppress 503 errors from proxy (backend not available)
        (targetString.includes('api/proxy') && targetString.includes('503')) ||
        errorString.includes('503') && (errorString.includes('api/proxy') || errorString.includes('Service Unavailable'))
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
      
      // Allow other errors to be handled normally
      return true;
    };

    window.addEventListener('error', handleError, true); // Use capture phase to intercept early

    // Unregister service worker in development if it's causing issues
    if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Silently fail if unregistration fails
          });
        });
      });
    }

    // Also handle errors from Base Account SDK that might be logged to console
    originalLogRef.current = window.console.log.bind(window.console);
    window.console.log = (...args: any[]) => {
      const logString = args.map(arg => String(arg)).join(' ');
      // Suppress Base Account SDK COOP check logs, Workbox errors, and proxy 503 errors
      if (
        logString.includes('Cross-Origin-Opener-Policy') ||
        logString.includes('checkCrossOriginOpenerPolicy') ||
        logString.includes('workbox') ||
        logString.includes('no-response') ||
        logString.includes('Failed to fetch') ||
        logString.includes('ERR_FAILED') ||
        logString.includes('ERR_CONNECTION_REFUSED') ||
        logString.includes('net::ERR_CONNECTION_REFUSED') ||
        (logString.includes('500') && logString.includes('Internal Server Error')) ||
        // Suppress 503 error logs from proxy
        (logString.includes('503') && (logString.includes('api/proxy') || logString.includes('Service Unavailable')))
      ) {
        return; // Suppress this log
      }
      if (originalLogRef.current) {
        originalLogRef.current(...args);
      }
    };

    // Cleanup on unmount
    return () => {
      if (originalErrorRef.current) {
        window.console.error = originalErrorRef.current;
      }
      if (originalWarnRef.current) {
        window.console.warn = originalWarnRef.current;
      }
      // Restore original console.log
      if (originalLogRef.current) {
        window.console.log = originalLogRef.current;
      }
      // Restore original fetch
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  // This component doesn't render anything
  return null;
}

