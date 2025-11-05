from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import anthropic
import os

app = FastAPI()

class MentorRequest(BaseModel):
    question: str
    context: Optional[dict] = {}  # Hackathon info, user's tech stack, etc.
    conversationHistory: Optional[List[dict]] = []

class MentorResponse(BaseModel):
    answer: str
    suggestedResources: List[dict]
    relatedQuestions: List[str]

# Initialize Anthropic client
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are SafariLink AI Mentor, an expert Web3 developer assistant helping hackathon participants.

Your role:
- Answer technical questions about blockchain development, smart contracts, Web3 libraries
- Provide code examples and best practices
- Debug common issues
- Guide builders through development process
- Suggest relevant resources and documentation
- Keep answers concise and actionable

Knowledge areas:
- Solidity, Vyper smart contract development
- Hardhat, Foundry, Remix IDE
- Ethereum, Arbitrum, Base, Optimism L2s
- Web3.js, Ethers.js, Wagmi, Viem
- React, Next.js frontend development
- OpenZeppelin contracts
- DeFi protocols, NFTs, DAOs
- IPFS, decentralized storage
- Security best practices

Always:
- Be encouraging and supportive
- Provide working code examples
- Link to official documentation
- Warn about security considerations
- Suggest testing strategies

Never:
- Write malicious code
- Bypass security measures
- Generate private keys
- Encourage plagiarism
"""

@app.post("/ask", response_model=MentorResponse)
async def ask_mentor(request: MentorRequest):
    """
    Ask the AI mentor a question
    Returns answer with resources and related questions
    """
    
    try:
        # Build context string
        context_str = ""
        if request.context:
            context_str = f"\n\nContext:\n"
            context_str += f"- Hackathon: {request.context.get('hackathonName', 'N/A')}\n"
            context_str += f"- Chains: {', '.join(request.context.get('chains', []))}\n"
            context_str += f"- User's tech stack: {', '.join(request.context.get('techStack', []))}\n"
        
        # Build messages
        messages = []
        
        # Add conversation history
        for msg in request.conversationHistory[-5:]:  # Last 5 messages
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add current question
        messages.append({
            "role": "user",
            "content": f"{request.question}{context_str}"
        })
        
        # Call Claude
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=messages
        )
        
        answer = response.content[0].text
        
        # Generate suggested resources based on question
        resources = generate_resources(request.question, request.context)
        
        # Generate related questions
        related = generate_related_questions(request.question)
        
        return MentorResponse(
            answer=answer,
            suggestedResources=resources,
            relatedQuestions=related
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def generate_resources(question: str, context: dict) -> List[dict]:
    """Generate relevant resource links based on question"""
    resources = []
    
    keywords = question.lower()
    
    if 'solidity' in keywords or 'smart contract' in keywords:
        resources.append({
            'title': 'Solidity Documentation',
            'url': 'https://docs.soliditylang.org/',
            'type': 'documentation'
        })
        resources.append({
            'title': 'OpenZeppelin Contracts',
            'url': 'https://docs.openzeppelin.com/contracts/',
            'type': 'library'
        })
    
    if 'hardhat' in keywords:
        resources.append({
            'title': 'Hardhat Documentation',
            'url': 'https://hardhat.org/docs',
            'type': 'documentation'
        })
    
    if 'foundry' in keywords:
        resources.append({
            'title': 'Foundry Book',
            'url': 'https://book.getfoundry.sh/',
            'type': 'documentation'
        })
    
    if 'wagmi' in keywords or 'frontend' in keywords:
        resources.append({
            'title': 'Wagmi Documentation',
            'url': 'https://wagmi.sh/',
            'type': 'documentation'
        })
    
    if 'arbitrum' in keywords or 'arbitrum' in context.get('chains', []):
        resources.append({
            'title': 'Arbitrum Developer Docs',
            'url': 'https://docs.arbitrum.io/',
            'type': 'documentation'
        })
    
    if 'base' in keywords or 'base' in context.get('chains', []):
        resources.append({
            'title': 'Base Documentation',
            'url': 'https://docs.base.org/',
            'type': 'documentation'
        })
    
    if 'nft' in keywords or 'erc721' in keywords:
        resources.append({
            'title': 'NFT Tutorial',
            'url': 'https://ethereum.org/en/developers/docs/standards/tokens/erc-721/',
            'type': 'tutorial'
        })
    
    return resources[:5]  # Max 5 resources

def generate_related_questions(question: str) -> List[str]:
    """Generate related questions user might ask next"""
    
    keywords = question.lower()
    related = []
    
    if 'deploy' in keywords:
        related.extend([
            "How do I verify my contract on Etherscan?",
            "What are the gas costs for deployment?",
            "How do I deploy to testnet first?",
        ])
    
    if 'test' in keywords:
        related.extend([
            "What testing framework should I use?",
            "How do I write unit tests for smart contracts?",
            "What is fuzzing and should I use it?",
        ])
    
    if 'security' in keywords:
        related.extend([
            "What are common smart contract vulnerabilities?",
            "How do I prevent reentrancy attacks?",
            "Should I get my contract audited?",
        ])
    
    if 'frontend' in keywords:
        related.extend([
            "How do I connect MetaMask to my dApp?",
            "What's the difference between Web3.js and Ethers.js?",
            "How do I handle transaction errors in UI?",
        ])
    
    # Default related questions
    if not related:
        related = [
            "How do I get started with Solidity?",
            "What tools do I need for Web3 development?",
            "How do I deploy a smart contract?",
        ]
    
    return related[:3]  # Max 3 related questions

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mentor-bot"}

