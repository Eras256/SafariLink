# SafariLink Platform - Deployment Guide

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+
- Foundry (for smart contracts)
- Python 3.11+ (for AI services)

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/safarilink/platform.git
cd platform
```

### 2. Environment Variables

Copy and fill in environment variables:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env

# Contracts
cp contracts/.env.example contracts/.env
```

### 3. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Backend API (port 4000)
- Frontend (port 3000)
- AI Services (ports 8001-8003)

### 4. Run Database Migrations

```bash
cd backend
npm install
npm run migrate
```

### 5. Deploy Smart Contracts

```bash
cd contracts
forge install
forge test
forge script script/Deploy.s.sol:DeployScript --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify
```

Update contract addresses in `frontend/lib/web3/contracts.ts`

## Manual Deployment

### Frontend (Vercel)

```bash
cd frontend
npm install
npm run build
vercel --prod
```

### Backend (AWS ECS / Google Cloud Run)

```bash
cd backend
docker build -t safarilink-backend .
docker push <registry>/safarilink-backend:latest
```

### AI Services

```bash
# Team Matcher
cd ai-services/team_matcher
docker build -t safarilink-team-matcher .
docker push <registry>/safarilink-team-matcher:latest

# Repeat for plagiarism-detector and mentor-bot
```

## Production Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Smart contracts deployed and verified
- [ ] Contract addresses updated in frontend
- [ ] SSL certificates configured
- [ ] CDN configured for static assets
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
- [ ] Security headers configured
- [ ] Rate limiting enabled

## Troubleshooting

See [SECURITY.md](./SECURITY.md) for security best practices.

