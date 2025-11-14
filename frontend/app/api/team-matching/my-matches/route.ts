/**
 * Team Matching My Matches API Route
 * GET /api/team-matching/my-matches?hackathonId=xxx
 * 
 * Returns matches where user is involved
 * Runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { matchesStorage } from '@/lib/team-matching/storage';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');
    const userId = request.headers.get('x-user-id') || request.headers.get('authorization')?.replace('Bearer ', '');

    if (!hackathonId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'hackathonId and userId are required',
        },
        { status: 400 }
      );
    }

    // Find all matches where user is sender or receiver
    const userMatches: any[] = [];
    
    for (const [, match] of matchesStorage.entries()) {
      if (
        match.hackathonId === hackathonId &&
        (match.senderId === userId || match.receiverId === userId)
      ) {
        userMatches.push(match);
      }
    }

    // Sort by creation date (newest first)
    userMatches.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(
      {
        success: true,
        matches: userMatches,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/my-matches GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

