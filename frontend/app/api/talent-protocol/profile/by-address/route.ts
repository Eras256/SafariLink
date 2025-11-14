/**
 * Endpoint to get Talent Protocol profile by wallet address
 * GET /api/talent-protocol/profile/by-address?address=0x...
 * 
 * Similar to /api/ai, runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchTalentProtocolProfile } from '@/lib/talent-protocol/talent-protocol-api';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    // Validate that address is present
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Address parameter is required',
        },
        { status: 400 }
      );
    }

    // Validate address format (must be a valid Ethereum address)
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Ethereum address format',
        },
        { status: 400 }
      );
    }

    console.log('[API] Fetching Talent Protocol profile for:', address);

    // Call Talent Protocol API
    const result = await fetchTalentProtocolProfile(address);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to fetch Talent Protocol profile',
        },
        { status: 500 }
      );
    }

    // If profile not found, return 404
    if (!result.profile) {
      return NextResponse.json(
        {
          success: true,
          profile: null,
          message: 'Talent Protocol profile not found for this address',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile: result.profile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/talent-protocol/profile/by-address:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

