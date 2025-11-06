from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import requests
import os

app = FastAPI()

class Builder(BaseModel):
    userId: str
    walletAddress: str
    builderScore: int
    skills: List[str]
    githubUrl: Optional[str]
    timezone: str
    preferredRole: str  # "developer", "designer", "pm"
    lookingForRoles: List[str]
    language: Optional[str] = "en"  # Preferred language: "en", "sw", "fr"
    hackathonId: Optional[str] = None  # For virtual hackathon matching
    availability: Optional[str] = "full-time"  # "full-time", "part-time", "weekend"

class TeamMatchRequest(BaseModel):
    builder: Builder
    candidatePool: List[Builder]
    maxResults: int = 5

class TeamMatchResponse(BaseModel):
    matches: List[dict]

# Skill embeddings (simplified - use sentence transformers in production)
SKILL_CATEGORIES = {
    'frontend': ['react', 'nextjs', 'vue', 'angular', 'typescript', 'css', 'tailwind'],
    'backend': ['nodejs', 'python', 'go', 'rust', 'express', 'fastapi'],
    'blockchain': ['solidity', 'hardhat', 'foundry', 'web3js', 'ethersjs', 'wagmi'],
    'design': ['figma', 'photoshop', 'illustrator', 'ui', 'ux'],
    'ai': ['pytorch', 'tensorflow', 'langchain', 'openai', 'ml'],
    'mobile': ['react-native', 'flutter', 'swift', 'kotlin'],
}

def get_skill_vector(skills: List[str]) -> np.ndarray:
    """Convert skills list to vector"""
    vector = np.zeros(len(SKILL_CATEGORIES))
    
    for i, (category, category_skills) in enumerate(SKILL_CATEGORIES.items()):
        for skill in skills:
            if skill.lower() in category_skills:
                vector[i] += 1
    
    return vector

def calculate_github_activity(github_url: Optional[str]) -> float:
    """Fetch GitHub activity score"""
    if not github_url:
        return 0.0
    
    try:
        username = github_url.split('github.com/')[-1].strip('/')
        response = requests.get(
            f'https://api.github.com/users/{username}',
            headers={'Authorization': f'token {os.getenv("GITHUB_TOKEN")}'}
        )
        
        if response.status_code == 200:
            data = response.json()
            # Simple scoring: repos + followers + contributions
            return min((data.get('public_repos', 0) + 
                       data.get('followers', 0) * 2) / 100, 1.0)
        return 0.0
    except:
        return 0.0

def calculate_compatibility(builder1: Builder, builder2: Builder) -> float:
    """Calculate compatibility score between two builders"""
    
    # 1. Complementary skills (40% weight)
    skills1 = get_skill_vector(builder1.skills)
    skills2 = get_skill_vector(builder2.skills)
    
    # Inverse similarity = complementary skills
    skill_similarity = cosine_similarity([skills1], [skills2])[0][0]
    complementary_score = 1 - skill_similarity
    
    # 2. Role compatibility (30% weight)
    role_match = 0.0
    if builder2.preferredRole in builder1.lookingForRoles:
        role_match = 1.0
    
    # 3. Builder score compatibility (20% weight)
    score_diff = abs(builder1.builderScore - builder2.builderScore)
    score_compat = max(0, 1 - (score_diff / 500))  # Normalize
    
    # 4. Timezone compatibility (10% weight) - CRITICAL for virtual hackathons
    # Parse timezone offset
    tz1_offset = int(builder1.timezone.split('UTC')[1].split(':')[0] if 'UTC' in builder1.timezone else 0)
    tz2_offset = int(builder2.timezone.split('UTC')[1].split(':')[0] if 'UTC' in builder2.timezone else 0)
    tz_diff = abs(tz1_offset - tz2_offset)
    tz_compat = max(0, 1 - (tz_diff / 12))
    
    # 5. Language compatibility (5% weight) - Important for African participants
    lang_match = 1.0 if builder1.language == builder2.language else 0.5
    if builder1.language == "sw" and builder2.language == "sw":
        lang_match = 1.2  # Bonus for Swahili speakers (often underrepresented)
    
    # 6. Availability compatibility (5% weight) - Critical for virtual hackathons
    avail_match = 1.0
    if builder1.availability != builder2.availability:
        # Part-time + weekend is OK, but full-time + part-time is less ideal
        if builder1.availability == "full-time" and builder2.availability in ["part-time", "weekend"]:
            avail_match = 0.7
        elif builder1.availability in ["part-time", "weekend"] and builder2.availability == "full-time":
            avail_match = 0.7
        else:
            avail_match = 0.9
    
    # Weighted sum (adjusted for virtual hackathons)
    total_score = (
        complementary_score * 0.35 +  # Skills still most important
        role_match * 0.25 +           # Role compatibility
        score_compat * 0.15 +         # Experience level
        tz_compat * 0.15 +            # Timezone MORE important for virtual
        lang_match * 0.05 +           # Language preference
        avail_match * 0.05           # Availability matching
    )
    
    return min(total_score, 1.0)  # Cap at 1.0

@app.post("/match-team", response_model=TeamMatchResponse)
async def match_team(request: TeamMatchRequest):
    """
    Find best team matches for a builder
    Returns ranked list of compatible builders
    """
    matches = []
    
    for candidate in request.candidatePool:
        if candidate.userId == request.builder.userId:
            continue
        
        # Calculate compatibility
        compat_score = calculate_compatibility(request.builder, candidate)
        
        # Get GitHub activity
        github_score = calculate_github_activity(candidate.githubUrl)
        
        # Final score (weighted)
        final_score = compat_score * 0.8 + github_score * 0.2
        
        matches.append({
            'userId': candidate.userId,
            'walletAddress': candidate.walletAddress,
            'builderScore': candidate.builderScore,
            'skills': candidate.skills,
            'preferredRole': candidate.preferredRole,
            'compatibilityScore': round(compat_score * 100, 2),
            'githubActivityScore': round(github_score * 100, 2),
            'finalScore': round(final_score * 100, 2),
            'reason': f"Strong {candidate.preferredRole} match with complementary {', '.join(candidate.skills[:3])} skills"
        })
    
    # Sort by final score
    matches.sort(key=lambda x: x['finalScore'], reverse=True)
    
    return TeamMatchResponse(matches=matches[:request.maxResults])

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "team-matcher"}

