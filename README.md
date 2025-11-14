# 🦁 SafariLink Platform

<div align="center">

**The Complete Web3 Hackathon Lifecycle Platform - Optimized for Africa & Emerging Markets**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Website](https://safarilink.xyz) • [Documentation](./docs) • [Twitter](https://twitter.com/safarilink) • [Discord](https://discord.gg/safarilink)

</div>

---

## 🎯 The Story

Imagine a world where every Web3 builder in Africa and emerging markets has a clear path from their first hackathon to global funding. A platform that doesn't just host events, but creates lasting connections, verifiable achievements, and real opportunities.

**That's SafariLink.**

Born from the challenges of virtual hackathons like ETH Safari, SafariLink transforms remote collaboration into immersive, engaging experiences. We've built an end-to-end ecosystem that bridges the gap between local talent and global opportunities, powered by cutting-edge Web3 technology and AI.

### 🌍 Why SafariLink?

Virtual hackathons face unique challenges:
- **Networking barriers** - Hard to connect across timezones and languages
- **Engagement drops** - Participants lose interest without real-time interaction
- **Limited feedback** - Mentors can't provide timely guidance
- **Fragmented identity** - Achievements scattered across platforms
- **Funding gaps** - No clear pathway from hackathon to investment

**SafariLink solves all of this.**

---

## ✨ What We've Built

### 🎮 Core Features

| Feature | Description | Impact |
|---------|-------------|--------|
| 🌐 **Virtual Networking Rooms** | Real-time video and chat rooms for track-based collaboration | +300% Networking |
| 🤖 **AI Mentor Multilingual** | 24/7 AI assistant supporting Swahili, English, and French | 24/7 Support |
| 📊 **Organizer Dashboard** | Complete metrics on engagement, participation, projects, and sponsor ROI | Data-Driven Decisions |
| 💬 **Real-time Feedback System** | Mentors and judges provide instant feedback during development | +250% Feedback Quality |
| 👥 **Smart Team Matching** | AI-powered matching based on complementary skills, timezone, and preferences | Perfect Teams |
| 🎯 **Gamification & Engagement** | Badges, leaderboards, daily challenges to keep participants active | +200% Engagement |
| 🏆 **Soulbound NFT Certificates** | Non-transferable, verifiable hackathon achievements on-chain | Permanent Records |
| 💰 **On-Chain Prize Distribution** | Secure, transparent prize distribution via smart contracts | Trustless Rewards |

### 📈 Expected Impact

- **+300%** Increase in Networking
- **+250%** Improvement in Feedback Quality
- **+200%** Increase in Engagement
- **+150%** Participant Satisfaction

---

## 🦁 ETH Safari Evolution Challenge 2025

**SafariLink is specifically designed to revolutionize virtual hackathons like ETH Safari**, addressing the unique challenges of remote collaboration and engagement in the African Web3 ecosystem.

[👉 View ETH Safari Evolution Challenge Proposal](./frontend/app/eth-safari-evolution/page.tsx)

---

## 🔗 Deployed Smart Contracts

### Ethereum Sepolia Testnet

Our smart contracts are live on Ethereum Sepolia testnet, implementing secure, gas-optimized solutions for hackathon management:

| Contract | Address | Explorer | Description |
|----------|---------|----------|-------------|
| **NFTCertificate** | `0x57691c8016bf1A1cA90224Ca346C3a17310B4846` | [View on Etherscan](https://sepolia.etherscan.io/address/0x57691c8016bf1A1cA90224Ca346C3a17310B4846) | Soulbound NFT certificates (EIP-5192) for hackathon achievements |
| **PrizeDistributor** | `0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD` | [View on Etherscan](https://sepolia.etherscan.io/address/0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD) | Secure, transparent prize distribution system |

**Network Details:**
- **Chain ID:** `11155111`
- **Network:** Ethereum Sepolia Testnet
- **Deployer:** `0xF93F07b1b35b9DF13e2d53DbAd49396f0A9538D9`
- **Deployment Date:** November 14, 2025

### Contract Features

#### NFTCertificate
- ✅ EIP-5192 Soulbound Token implementation
- ✅ Gas-optimized (no Counters library)
- ✅ Batch minting support
- ✅ Emergency pause functionality
- ✅ Role-based access control
- ✅ Reentrancy protection

#### PrizeDistributor
- ✅ Secure prize distribution
- ✅ Granular access control (Organizer, Judge roles)
- ✅ Batch distribution optimization
- ✅ Reentrancy protection
- ✅ Emergency pause
- ✅ Custom errors for gas optimization

---

## 🛠️ Technology Stack

### Frontend

<div align="left">

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)
![Wagmi](https://img.shields.io/badge/Wagmi-2.12-FF6B6B?logo=ethereum&logoColor=white)
![Viem](https://img.shields.io/badge/Viem-2.21-6366F1?logo=ethereum&logoColor=white)
![Reown AppKit](https://img.shields.io/badge/Reown-1.0-3B82F6?logo=walletconnect&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.5-0055FF?logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4.5-FF6B6B?logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.56-FF4154?logo=react-query&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io&logoColor=white)

</div>

**Framework & Core:**
- **Next.js 15** - App Router, React Server Components, Server Actions
- **React 18.3** - Latest React features with concurrent rendering
- **TypeScript 5.6** - Full type safety across the application

**Styling & UI:**
- **Tailwind CSS 4** - Utility-first CSS with custom glassmorphism effects
- **Radix UI** - Accessible component primitives
- **Shadcn/ui** - Beautiful, customizable components
- **Framer Motion** - Smooth animations and transitions

**Web3 Integration:**
- **Reown AppKit** - WalletConnect v4 integration
- **Wagmi v2** - React Hooks for Ethereum
- **Viem** - TypeScript Ethereum library

**State Management:**
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data synchronization

**Real-time:**
- **Socket.io** - Real-time bidirectional communication

### Backend

<div align="left">

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5.20-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?logo=json-web-tokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-010101?logo=socket.io&logoColor=white)

</div>

**Runtime & Framework:**
- **Node.js 20+** - Latest LTS with modern JavaScript features
- **Express.js** - Fast, unopinionated web framework
- **TypeScript 5.6** - Type-safe backend development

**Database & ORM:**
- **PostgreSQL 16** - Robust relational database
- **Prisma ORM** - Next-generation ORM with type safety
- **Redis 7** - High-performance caching and rate limiting

**Authentication & Security:**
- **JWT** - JSON Web Token authentication
- **Wallet Signature Verification** - Web3 wallet-based auth
- **Zod** - Schema validation
- **Helmet** - Security headers
- **Rate Limiting** - Redis-backed request throttling

**Real-time:**
- **Socket.io** - WebSocket server for real-time features

### Smart Contracts

<div align="left">

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-2.20-F7B93E?logo=hardhat&logoColor=black)
![Foundry](https://img.shields.io/badge/Foundry-Latest-000000?logo=foundry&logoColor=white)
![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-5.0-4E5EE4?logo=openzeppelin&logoColor=white)

</div>

**Framework & Tools:**
- **Foundry** - Fast, portable, and modular toolkit for Ethereum application development
- **Hardhat** - Development environment for Ethereum
- **Solidity ^0.8.20** - Smart contract programming language

**Libraries & Standards:**
- **OpenZeppelin Contracts** - Battle-tested smart contract libraries
- **EIP-5192** - Soulbound Token standard implementation

**Supported Networks:**
- Ethereum Sepolia (Deployed ✅)
- Arbitrum Sepolia
- Base Sepolia
- Optimism Sepolia

### AI Services

<div align="left">

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-Latest-F7931E?logo=scikit-learn&logoColor=white)

</div>

**Framework:**
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.11** - Latest Python features and performance

**AI & ML:**
- **Google Gemini 1.5 Flash** - Multilingual AI assistant
- **Scikit-learn** - Machine learning for team matching algorithms

**Services:**
- **Team Matcher** - AI-powered team formation
- **Plagiarism Detector** - Code similarity detection
- **Mentor Bot** - 24/7 multilingual AI mentor

### DevOps & Infrastructure

<div align="left">

![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Latest-000000?logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Latest-0B0D0E?logo=railway&logoColor=white)

</div>

**Containerization:**
- **Docker** - Containerization for all services
- **Docker Compose** - Multi-container orchestration

**Deployment:**
- **Vercel** - Frontend deployment platform
- **Railway** - Backend and AI services deployment

---

## 📁 Project Structure

```
SafariLink/
├── frontend/              # Next.js 15 App Router
│   ├── app/              # Pages and layouts
│   ├── components/       # React components
│   ├── lib/              # Utilities and configs
│   └── hooks/            # Custom React hooks
├── backend/              # Node.js/Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Auth, validation, rate limiting
│   │   └── config/       # Database, Redis configs
│   └── prisma/           # Database schema
├── contracts/            # Smart Contracts (Foundry/Hardhat)
│   ├── src/             # Solidity contracts
│   ├── test/            # Foundry tests
│   ├── scripts/         # Deployment scripts
│   └── deployments/     # Deployed contract addresses
├── ai-services/         # Python AI microservices
│   ├── team_matcher/    # Team matching service
│   ├── plagiarism_detector/  # Anti-plagiarism service
│   └── mentor_bot/     # AI mentor assistant
├── docs/                # Documentation
└── docker-compose.yml   # Docker orchestration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Docker** & Docker Compose
- **Foundry** (for smart contracts)
- **Python** 3.11+ (for AI services)

### Installation

```bash
# Clone repository
git clone https://github.com/safarilink/platform.git
cd SafariLink

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install

# Install contract dependencies
cd ../contracts && forge install

# Install AI Services dependencies
cd ../ai-services/mentor_bot
pip install -r requirements.txt

# Configure environment variables
# See INSTALLATION.md for detailed setup

# Start services with Docker
cd ../..
docker-compose up -d

# Or run services individually
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# AI Mentor
cd ai-services/mentor_bot
uvicorn main:app --reload --port 8000

# Run database migrations
cd ../../backend && npm run migrate
```

📖 See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

---

## 📚 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Detailed setup instructions
- **[API Documentation](./docs/API.md)** - REST API reference
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture overview
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment steps
- **[Security Guide](./docs/SECURITY.md)** - Security best practices
- **[Talent Protocol Integration](./docs/TALENT_PROTOCOL_INTEGRATION.md)** - Web3 identity integration
- **[Virtual Networking Guide](./docs/VIRTUAL_NETWORKING.md)** - Real-time collaboration features

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Smart contract tests
cd contracts && forge test

# Run all tests
npm run test:all
```

---

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

---

## 🔐 Security

- ✅ Input validation on all endpoints
- ✅ Rate limiting with Redis
- ✅ JWT authentication
- ✅ Wallet signature verification
- ✅ Smart contract security best practices
- ✅ KYC/AML integration ready (Smile ID)
- ✅ OFAC screening implemented
- ✅ Reentrancy protection in smart contracts
- ✅ Access control with role-based permissions

**Note:** Smart contracts should undergo professional audits before mainnet deployment.

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read our contributing guidelines and code of conduct before submitting PRs.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

We're grateful to the amazing open-source community and the following projects:

- **OpenZeppelin** - Battle-tested smart contract libraries
- **Reown (WalletConnect)** - Web3 wallet integration
- **Google Gemini** - AI integration and multilingual support
- **Next.js Team** - Amazing React framework
- **Prisma** - Next-generation ORM
- **All contributors** and builders in the Web3 community

---

## 📞 Contact & Community

- **Email:** support@safarilink.xyz
- **Website:** https://safarilink.xyz
- **Twitter:** [@SafariLink](https://twitter.com/safarilink)
- **Discord:** [Join our community](https://discord.gg/safarilink)
- **GitHub:** [@safarilink](https://github.com/safarilink)

---

<div align="center">

**Built with ❤️ for Web3 builders in Africa and emerging markets**

[![Star History Chart](https://api.star-history.com/svg?repos=safarilink/platform&type=Date)](https://star-history.com/#safarilink/platform&Date)

</div>
