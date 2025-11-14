/**
 * Team Matching Respond API Route
 * POST /api/team-matching/respond
 * Body: { matchId: "xxx", action: "INTERESTED" | "NOT_INTERESTED" }
 * 
 * Handles user response to a match
 * Runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { matchesStorage } from '@/lib/team-matching/storage';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, action } = body;
    const userId = request.headers.get('x-user-id') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!matchId || !action || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'matchId, action, and userId are required',
        },
        { status: 400 }
      );
    }

    if (action !== 'INTERESTED' && action !== 'NOT_INTERESTED') {
      return NextResponse.json(
        {
          success: false,
          error: 'action must be INTERESTED or NOT_INTERESTED',
        },
        { status: 400 }
      );
    }

    const match = matchesStorage.get(matchId);

    if (!match) {
      return NextResponse.json(
        {
          success: false,
          error: 'Match not found',
        },
        { status: 404 }
      );
    }

    // Update match based on user role
    if (match.senderId === userId) {
      match.senderAction = action;
    } else if (match.receiverId === userId) {
      match.receiverAction = action;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'User is not part of this match',
        },
        { status: 403 }
      );
    }

    // Check if both parties are interested
    if (match.senderAction === 'INTERESTED' && match.receiverAction === 'INTERESTED') {
      match.status = 'MUTUAL_INTEREST';
    } else if (match.senderAction === 'NOT_INTERESTED' || match.receiverAction === 'NOT_INTERESTED') {
      match.status = 'NOT_INTERESTED';
    }

    match.updatedAt = new Date().toISOString();
    matchesStorage.set(matchId, match);

    return NextResponse.json(
      {
        success: true,
        match,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/respond POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

