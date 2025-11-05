# SafariLink Platform - Architecture

## System Overview

SafariLink Platform is a full-stack Web3 hackathon lifecycle platform built with:

- **Frontend**: Next.js 15 (React Server Components)
- **Backend**: Node.js + Express + PostgreSQL
- **Smart Contracts**: Solidity (Foundry)
- **AI Services**: Python (FastAPI)
- **Infrastructure**: Docker, Docker Compose

## Architecture Diagram

```
┌─────────────────┐
│   Frontend      │
│   (Next.js 15)  │
│   Port 3000     │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐      ┌──────────────┐
│   Backend API   │      │  PostgreSQL  │
│   (Express)     │◄─────┤  Port 5432   │
│   Port 4000     │      └──────────────┘
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼────┐ ┌───▼──────────────┐
│   Redis     │ │  AI Services     │
│   Port 6379 │ │  Ports 8001-8003 │
└─────────────┘ └──────────────────┘
         │
         │
┌────────▼────────┐
│  Smart Contracts│
│  (Foundry)      │
│  On-chain       │
└─────────────────┘
```

## Data Flow

1. **User Registration**
   - User connects wallet via Reown AppKit
   - Signs message for authentication
   - Backend verifies signature and issues JWT

2. **Hackathon Creation**
   - Organizer creates hackathon via UI
   - Backend stores in PostgreSQL
   - Smart contract deployed for prize distribution

3. **Project Submission**
   - Builder submits project
   - AI services check for plagiarism
   - Project stored in database
   - NFT certificate minted on-chain

4. **Prize Distribution**
   - Judges set winners via backend
   - Backend calls smart contract
   - Winners claim prizes on-chain
   - USDC distributed via smart contract

## Technology Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS + Glassmorphism
- Wagmi + Viem (Web3)
- Framer Motion (Animations)
- Zustand (State Management)

### Backend
- Node.js 20+
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL 16
- Redis
- JWT Authentication

### Smart Contracts
- Solidity 0.8.20
- Foundry
- OpenZeppelin Contracts
- Multi-chain (Arbitrum, Base, Optimism)

### AI Services
- Python 3.11
- FastAPI
- Anthropic Claude
- Scikit-learn

## Database Schema

See `backend/prisma/schema.prisma` for complete schema.

Key models:
- User
- Hackathon
- Project
- Team
- GrantApplication
- Vote
- Comment

## API Design

RESTful API with:
- JSON responses
- JWT authentication
- Rate limiting
- Input validation (Zod)
- Error handling

## Security

- Input validation on all endpoints
- Rate limiting per user/IP
- CORS configuration
- Security headers (Helmet)
- KYC/AML integration
- OFAC screening
- Smart contract audits

## Scalability

- Horizontal scaling with Docker
- Redis for caching
- Database connection pooling
- CDN for static assets
- Load balancing ready

## Monitoring

- Sentry for error tracking
- Mixpanel for analytics
- Health check endpoints
- Logging (Winston)

