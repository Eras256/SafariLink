/**
 * Team Matching Profile API Route
 * GET /api/team-matching/profile?hackathonId=xxx
 * POST /api/team-matching/profile - Create profile
 * PUT /api/team-matching/profile - Update profile
 * 
 * Runs server-side without traditional backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { profilesStorage, TeamMatchingProfile } from '@/lib/team-matching/storage';

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

    const profileKey = `${hackathonId}:${userId}`;
    const profile = profilesStorage.get(profileKey);

    if (!profile) {
      return NextResponse.json(
        {
          success: true,
          profile: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/profile GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hackathonId, ...profileData } = body;
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

    const profileKey = `${hackathonId}:${userId}`;
    const now = new Date().toISOString();

    const profile: TeamMatchingProfile = {
      id: profileKey,
      userId,
      hackathonId,
      skills: profileData.skills || [],
      lookingFor: profileData.lookingFor || [],
      preferredRole: profileData.preferredRole || 'flexible',
      availability: profileData.availability || 'full-time',
      bio: profileData.bio || '',
      githubUrl: profileData.githubUrl || '',
      createdAt: now,
      updatedAt: now,
    };

    profilesStorage.set(profileKey, profile);

    return NextResponse.json(
      {
        success: true,
        profile,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/profile POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { hackathonId, ...profileData } = body;
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

    const profileKey = `${hackathonId}:${userId}`;
    const existingProfile = profilesStorage.get(profileKey);

    if (!existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Profile not found',
        },
        { status: 404 }
      );
    }

    const updatedProfile: TeamMatchingProfile = {
      ...existingProfile,
      ...profileData,
      updatedAt: new Date().toISOString(),
    };

    profilesStorage.set(profileKey, updatedProfile);

    return NextResponse.json(
      {
        success: true,
        profile: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API] Error in /api/team-matching/profile PUT:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

