/**
 * Endpoint to sync Talent Protocol profile by wallet address
 * POST /api/talent-protocol/sync-address
 * 
 * Body: { address: "0x..." }
 * 
 * Similar to /api/ai, runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchTalentProtocolProfile } from '@/lib/talent-protocol/talent-protocol-api';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    // Validate that address is present
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Address is required and must be a string',
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

    console.log('[API] Syncing Talent Protocol profile for:', address);

    // Call Talent Protocol API (sync is basically fetch + return result)
    const result = await fetchTalentProtocolProfile(address);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to sync Talent Protocol profile',
        },
        { status: 500 }
      );
    }

    // If profile not found after sync
    if (!result.profile) {
      return NextResponse.json(
        {
          success: true,
          message: 'Sync completed, but no Talent Protocol profile found for this address',
          profile: null,
          hasProfile: false,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Talent Protocol profile synced successfully',
        profile: result.profile,
        hasProfile: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/talent-protocol/sync-address:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

