from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import difflib
import re
import requests
import hashlib
from concurrent.futures import ThreadPoolExecutor
import os

app = FastAPI()

class PlagiarismCheckRequest(BaseModel):
    projectId: str
    description: str
    githubUrl: str
    compareAgainst: Optional[List[str]] = []  # List of project IDs to compare

class PlagiarismResult(BaseModel):
    isPlagiarized: bool
    confidence: float  # 0-100
    matches: List[dict]
    report: dict

def normalize_text(text: str) -> str:
    """Normalize text for comparison"""
    # Remove URLs
    text = re.sub(r'http\S+', '', text)
    # Remove special characters
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    # Lowercase
    text = text.lower()
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

def calculate_text_similarity(text1: str, text2: str) -> float:
    """Calculate similarity between two texts"""
    norm1 = normalize_text(text1)
    norm2 = normalize_text(text2)
    
    # Use SequenceMatcher for similarity
    similarity = difflib.SequenceMatcher(None, norm1, norm2).ratio()
    return similarity * 100

def check_github_originality(github_url: str) -> dict:
    """Check GitHub repo for copied code"""
    try:
        # Extract repo info
        parts = github_url.replace('https://github.com/', '').split('/')
        owner, repo = parts[0], parts[1]
        
        # Get repo info
        headers = {'Authorization': f'token {os.getenv("GITHUB_TOKEN")}'}
        
        # Check if repo is fork
        repo_response = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}',
            headers=headers
        )
        
        if repo_response.status_code != 200:
            return {'error': 'Cannot access repository'}
        
        repo_data = repo_response.json()
        
        # Check commits
        commits_response = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/commits',
            headers=headers
        )
        
        commits = commits_response.json() if commits_response.status_code == 200 else []
        
        # Check languages
        languages_response = requests.get(
            f'https://api.github.com/repos/{owner}/{repo}/languages',
            headers=headers
        )
        
        languages = languages_response.json() if languages_response.status_code == 200 else {}
        
        return {
            'isFork': repo_data.get('fork', False),
            'parentRepo': repo_data.get('parent', {}).get('full_name') if repo_data.get('fork') else None,
            'commitCount': len(commits),
            'languages': languages,
            'createdAt': repo_data.get('created_at'),
            'lastPush': repo_data.get('pushed_at'),
        }
    except Exception as e:
        return {'error': str(e)}

def search_similar_projects(description: str) -> List[dict]:
    """Search for similar projects on GitHub"""
    try:
        # Create search query from description keywords
        keywords = ' '.join(normalize_text(description).split()[:10])
        
        response = requests.get(
            'https://api.github.com/search/repositories',
            params={
                'q': keywords,
                'sort': 'stars',
                'order': 'desc',
                'per_page': 5
            },
            headers={'Authorization': f'token {os.getenv("GITHUB_TOKEN")}'}
        )
        
        if response.status_code != 200:
            return []
        
        results = response.json().get('items', [])
        
        return [{
            'name': r['full_name'],
            'description': r.get('description', ''),
            'url': r['html_url'],
            'stars': r['stargazers_count'],
        } for r in results]
    except:
        return []

@app.post("/check-plagiarism", response_model=PlagiarismResult)
async def check_plagiarism(request: PlagiarismCheckRequest):
    """
    Check project for plagiarism
    Returns confidence score and detailed report
    """
    
    matches = []
    flags = []
    
    # 1. Check GitHub originality
    github_check = check_github_originality(request.githubUrl)
    
    if github_check.get('isFork'):
        flags.append({
            'type': 'fork',
            'severity': 'high',
            'message': f"Repository is forked from {github_check.get('parentRepo')}",
        })
    
    if github_check.get('commitCount', 0) < 3:
        flags.append({
            'type': 'low_commits',
            'severity': 'medium',
            'message': f"Only {github_check.get('commitCount', 0)} commits found",
        })
    
    # 2. Compare description with past projects
    if request.compareAgainst:
        # In production, fetch from database
        # For now, using mock comparison
        for project_id in request.compareAgainst[:10]:  # Limit to 10
            # Mock comparison (replace with actual DB query)
            similarity = 0  # calculate_text_similarity(request.description, past_description)
            
            if similarity > 80:
                matches.append({
                    'projectId': project_id,
                    'similarity': similarity,
                    'type': 'description',
                })
    
    # 3. Search for similar public projects
    similar_projects = search_similar_projects(request.description)
    
    for proj in similar_projects:
        similarity = calculate_text_similarity(
            request.description,
            proj.get('description', '')
        )
        
        if similarity > 70:
            matches.append({
                'name': proj['name'],
                'url': proj['url'],
                'similarity': similarity,
                'type': 'public_repo',
            })
    
    # Calculate final confidence score
    max_similarity = max([m['similarity'] for m in matches], default=0)
    flag_penalty = len([f for f in flags if f['severity'] == 'high']) * 20
    
    confidence = min(max_similarity + flag_penalty, 100)
    
    # Determine if plagiarized
    is_plagiarized = confidence > 75 or len([f for f in flags if f['severity'] == 'high']) > 0
    
    return PlagiarismResult(
        isPlagiarized=is_plagiarized,
        confidence=round(confidence, 2),
        matches=matches,
        report={
            'flags': flags,
            'githubCheck': github_check,
            'similarProjects': len(similar_projects),
            'recommendation': 'Manual review required' if confidence > 50 else 'Appears original',
        }
    )

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "plagiarism-detector"}

