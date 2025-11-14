/**
 * Team Matching Matches API Route
 * GET /api/team-matching/matches?hackathonId=xxx&limit=10
 * 
 * Returns potential matches for the user
 * Runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { profilesStorage, matchesStorage, TeamMatch } from '@/lib/team-matching/storage';

// CRITICAL: Force Node.js runtime (not Edge Runtime)
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
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

    // Get user's profile
    const profileKey = `${hackathonId}:${userId}`;
    const userProfile = profilesStorage.get(profileKey);

    if (!userProfile) {
      return NextResponse.json(
        {
          success: true,
          matches: [],
          message: 'Please create a profile first',
        },
        { status: 200 }
      );
    }

    // Find potential matches (simplified matching algorithm)
    const matches: any[] = [];
    const userSkills = userProfile.skills || [];
    const userLookingFor = userProfile.lookingFor || [];

    for (const [key, profile] of profilesStorage.entries()) {
      // Skip own profile
      if (key === profileKey) continue;
      
      // Only match profiles from same hackathon
      if (profile.hackathonId !== hackathonId) continue;

      // Calculate match score
      const profileSkills = profile.skills || [];
      const profileLookingFor = profile.lookingFor || [];
      
      // Skill overlap
      const skillOverlap = userSkills.filter(skill => 
        profileLookingFor.includes(skill) || profileSkills.includes(skill)
      ).length;
      
      // Looking for overlap
      const lookingForOverlap = userLookingFor.filter(item => 
        profileSkills.includes(item)
      ).length;

      const matchScore = (skillOverlap + lookingForOverlap) * 10;

      if (matchScore > 0) {
        const matchId = `${profileKey}:${key}`;
        const match: TeamMatch = {
          id: matchId,
          senderId: userId,
          receiverId: profile.userId,
          hackathonId,
          matchScore,
          skillScore: skillOverlap * 10,
          timezoneScore: 50, // Default
          strengths: [
            `Shared skills: ${skillOverlap}`,
            `Complementary interests: ${lookingForOverlap}`,
          ],
          considerations: [],
          status: 'PENDING',
          candidate: profile,
          createdAt: new Date().toISOString(),
        };
        
        // Store match if it doesn't exist
        if (!matchesStorage.has(matchId)) {
          matchesStorage.set(matchId, match);
        }
        
        matches.push(match);
      }
    }

    // Sort by match score and limit
    matches.sort((a, b) => b.matchScore - a.matchScore);
    const limitedMatches = matches.slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        matches: limitedMatches,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/matches GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

