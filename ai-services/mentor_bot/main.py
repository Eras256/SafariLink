from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os

app = FastAPI()

# Configure CORS to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],  # Allow frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

class MentorRequest(BaseModel):
    question: str
    context: Optional[dict] = {}  # Hackathon info, user's tech stack, etc.
    conversationHistory: Optional[List[dict]] = []
    language: Optional[str] = "en"  # "en", "sw", "fr" for English, Swahili, French

class MentorResponse(BaseModel):
    answer: str
    suggestedResources: List[dict]
    relatedQuestions: List[str]
    language: str

# Initialize Gemini client
gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyDR2ONyr0hBBD0zZO9llpwwSGiIidlamxU")
try:
    genai.configure(api_key=gemini_api_key)
    # Use gemini-2.0-flash (latest stable) or fallback to gemini-flash-latest
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
    except Exception:
        # Fallback to latest flash model
        model = genai.GenerativeModel("gemini-flash-latest")
except Exception as e:
    print(f"Error initializing Gemini: {e}")
    model = None

def get_system_prompt(language: str = "en") -> str:
    """Get system prompt in the specified language"""
    base_prompt = """You are SafariLink AI Mentor, an expert Web3 developer assistant helping hackathon participants, especially in Africa.

Your role:
- Answer technical questions about blockchain development, smart contracts, Web3 libraries
- Provide working code examples with proper formatting using markdown code blocks
- Include code examples in your responses using triple backticks with language identifier (e.g., ```solidity, ```javascript, ```python)
- Debug common issues with step-by-step solutions
- Guide builders through development process
- Suggest relevant resources and documentation
- Provide contextual guides based on the user's tech stack
- Keep answers concise and actionable
- Support participants in {language}

IMPORTANT FORMATTING RULES:
- Always format code examples using markdown code blocks with language identifier
- Example: ```solidity\ncontract MyContract {{ ... }}\n```
- Include comments in code examples to explain key parts
- Provide context for each code example explaining what it does
- Use proper indentation and formatting in code examples

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
- Africa-specific Web3 challenges and solutions

Always:
- Be encouraging and supportive
- Provide working, complete code examples in markdown format
- Include code examples with language tags for syntax highlighting
- Link to official documentation
- Warn about security considerations
- Suggest testing strategies
- Provide contextual guides matching the user's tech stack
- Consider low-bandwidth and mobile-first development for African markets
- Respond in {language} if requested
- Use simple, clear explanations especially for Swahili responses

Never:
- Write malicious code
- Bypass security measures
- Generate private keys
- Encourage plagiarism
- Provide incomplete code examples
"""
    
    language_map = {
        "en": "English",
        "sw": "Kiswahili",
        "fr": "Français"
    }
    
    lang_name = language_map.get(language, "English")
    return base_prompt.format(language=lang_name)

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
        
        # Determine language
        language = request.language or "en"
        system_prompt = get_system_prompt(language)
        
        # Add language instruction to question if needed
        question_with_lang = request.question
        if language != "en":
            question_with_lang = f"Please respond in {language}. {request.question}"
        
        # Build prompt for Gemini
        full_prompt = f"{system_prompt}\n\n{question_with_lang}{context_str}"
        
        # Add conversation history if available
        if request.conversationHistory:
            conversation_text = ""
            for msg in request.conversationHistory[-5:]:
                role = "User" if msg.get("role") == "user" else "Assistant"
                conversation_text += f"{role}: {msg.get('content', '')}\n"
            if conversation_text:
                full_prompt = f"{system_prompt}\n\nConversation History:\n{conversation_text}\n\nCurrent Question:\n{question_with_lang}{context_str}"
        
        # Call Gemini
        if model is None:
            raise HTTPException(status_code=500, detail="Gemini model not initialized. Check API key.")
        
        try:
            response = model.generate_content(
                full_prompt,
                generation_config={
                    "max_output_tokens": 1500,
                    "temperature": 0.7,
                }
            )
            
            # Extract answer from response - Gemini API structure
            # In google-generativeai, response.text is the direct way to get text
            if hasattr(response, 'text') and response.text:
                answer = response.text
            elif hasattr(response, 'parts') and response.parts and len(response.parts) > 0:
                answer = response.parts[0].text
            elif hasattr(response, 'candidates') and response.candidates and len(response.candidates) > 0:
                candidate = response.candidates[0]
                if hasattr(candidate, 'content') and hasattr(candidate.content, 'parts'):
                    if candidate.content.parts and len(candidate.content.parts) > 0:
                        answer = candidate.content.parts[0].text
                    else:
                        answer = str(candidate.content)
                else:
                    answer = str(candidate)
            else:
                # Fallback: try to get text from any available attribute
                answer = str(response) if response else "No response from Gemini API"
        except Exception as e:
            import traceback
            error_msg = str(e)
            error_trace = traceback.format_exc()
            print(f"Gemini API Error: {error_msg}\n{error_trace}")
            raise HTTPException(status_code=500, detail=f"Error calling Gemini API: {error_msg}")
        
        # Generate suggested resources based on question
        resources = generate_resources(request.question, request.context)
        
        # Generate related questions
        related = generate_related_questions(request.question, language)
        
        return MentorResponse(
            answer=answer,
            suggestedResources=resources,
            relatedQuestions=related,
            language=language
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

def generate_related_questions(question: str, language: str = "en") -> List[str]:
    """Generate related questions user might ask next"""
    
    questions_en = {
        'deploy': [
            "How do I verify my contract on Etherscan?",
            "What are the gas costs for deployment?",
            "How do I deploy to testnet first?",
        ],
        'test': [
            "What testing framework should I use?",
            "How do I write unit tests for smart contracts?",
            "What is fuzzing and should I use it?",
        ],
        'security': [
            "What are common smart contract vulnerabilities?",
            "How do I prevent reentrancy attacks?",
            "Should I get my contract audited?",
        ],
        'frontend': [
            "How do I connect MetaMask to my dApp?",
            "What's the difference between Web3.js and Ethers.js?",
            "How do I handle transaction errors in UI?",
        ],
        'default': [
            "How do I get started with Solidity?",
            "What tools do I need for Web3 development?",
            "How do I deploy a smart contract?",
        ]
    }
    
    questions_sw = {
        'deploy': [
            "Ninawezaje kuthibitisha kandarasi yangu kwenye Etherscan?",
            "Gharama za gesi za kutuma ni nini?",
            "Ninawezaje kutuma kwenye testnet kwanza?",
        ],
        'test': [
            "Ni mfumo gani wa kupima ninapaswa kutumia?",
            "Ninaandika vipi vipimo vya kitengo vya kandarasi za akili?",
            "Fuzzing ni nini na ni lazima nilitumie?",
        ],
        'security': [
            "Ni hatari gani za kawaida za kandarasi za akili?",
            "Ninawezaje kuzuia mashambulizi ya reentrancy?",
            "Ni lazima nipikie kandarasi yangu?",
        ],
        'frontend': [
            "Ninawezaje kuunganisha MetaMask na dApp yangu?",
            "Tofauti kati ya Web3.js na Ethers.js ni nini?",
            "Ninawezaje kushughulikia makosa ya muamala kwenye UI?",
        ],
        'default': [
            "Ninawezaje kuanza na Solidity?",
            "Ni zana gani ninazohitaji kwa maendeleo ya Web3?",
            "Ninawezaje kutuma kandarasi ya akili?",
        ]
    }
    
    questions_fr = {
        'deploy': [
            "Comment vérifier mon contrat sur Etherscan?",
            "Quels sont les coûts de gaz pour le déploiement?",
            "Comment déployer d'abord sur testnet?",
        ],
        'test': [
            "Quel framework de test devrais-je utiliser?",
            "Comment écrire des tests unitaires pour les contrats intelligents?",
            "Qu'est-ce que le fuzzing et devrais-je l'utiliser?",
        ],
        'security': [
            "Quelles sont les vulnérabilités courantes des contrats intelligents?",
            "Comment prévenir les attaques de réentrance?",
            "Devrais-je faire auditer mon contrat?",
        ],
        'frontend': [
            "Comment connecter MetaMask à mon dApp?",
            "Quelle est la différence entre Web3.js et Ethers.js?",
            "Comment gérer les erreurs de transaction dans l'UI?",
        ],
        'default': [
            "Comment commencer avec Solidity?",
            "Quels outils ai-je besoin pour le développement Web3?",
            "Comment déployer un contrat intelligent?",
        ]
    }
    
    language_map = {
        'en': questions_en,
        'sw': questions_sw,
        'fr': questions_fr
    }
    
    questions = language_map.get(language, questions_en)
    keywords = question.lower()
    related = []
    
    if 'deploy' in keywords:
        related.extend(questions['deploy'])
    elif 'test' in keywords:
        related.extend(questions['test'])
    elif 'security' in keywords:
        related.extend(questions['security'])
    elif 'frontend' in keywords:
        related.extend(questions['frontend'])
    else:
        related.extend(questions['default'])
    
    return related[:3]  # Max 3 related questions

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "mentor-bot"}

