# SafariLink Platform

The Complete Web3 Hackathon Lifecycle Platform - Optimized for Africa & Emerging Markets

## 🦁 ETH Safari Evolution Challenge 2025

**SafariLink is specifically designed to revolutionize virtual hackathons like ETH Safari**, addressing the unique challenges of remote collaboration and engagement in the African Web3 ecosystem.

### 🎯 Our Solution for ETH Safari

SafariLink transforms virtual hackathons into immersive, collaborative, and successful experiences through:

- **🌐 Virtual Networking Rooms** - Real-time video and chat rooms for track-based collaboration
- **🤖 AI Mentor Multilingual** - 24/7 AI assistant supporting Swahili, English, and French
- **📊 Organizer Dashboard** - Complete metrics on engagement, participation, projects, and sponsor ROI
- **💬 Real-time Feedback System** - Mentors and judges provide instant feedback during development
- **👥 Smart Team Matching** - AI-powered matching based on complementary skills, timezone, and preferences
- **🎮 Gamification & Engagement** - Badges, leaderboards, daily challenges to keep participants active
- **🌍 Multi-language Support** - Native Swahili support for African participants

### 📈 Expected Impact

- **+300%** Increase in Networking
- **+250%** Improvement in Feedback Quality
- **+200%** Increase in Engagement
- **+150%** Participant Satisfaction

[👉 View ETH Safari Evolution Challenge Proposal](./frontend/app/eth-safari-evolution/page.tsx)

## 🎯 Mission

SafariLink Platform connects hackers from their first event through to global funding, providing a comprehensive ecosystem for Web3 builders.

## ✨ Features

- **Unified Builder Identity** - Human Passport + Talent Protocol integration
- **Multi-Chain Support** - Arbitrum, Base, Optimism testnets
- **Post-Hackathon Launchpad** - Pathway from hack to VC funding
- **AI Co-Pilot** - Team matching, plagiarism detection, mentor bot
- **Transparent Judging** - Real-time public scoring dashboards
- **Sponsor ROI Dashboard** - Analytics and metrics
- **Compliance Automation** - KYC/AML via Smile ID
- **Low-Bandwidth Optimized** - PWA, offline-first, 108KB
- **Glassmorphism UI** - Modern neural network effects
- **Soulbound NFTs** - Non-transferable hackathon certificates
- **Virtual Networking** - Real-time video rooms and chat for collaboration
- **Multi-language Support** - Swahili, English, French for African markets
- **Real-time Feedback** - Instant feedback from mentors and judges
- **Gamification** - Badges, leaderboards, daily challenges

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
├── contracts/            # Smart Contracts (Foundry)
│   ├── src/             # Solidity contracts
│   ├── test/            # Foundry tests
│   └── script/          # Deployment scripts
├── ai-services/         # Python AI microservices
│   ├── team_matcher/    # Team matching service
│   ├── plagiarism_detector/  # Anti-plagiarism service
│   └── mentor_bot/     # AI mentor assistant
├── docs/                # Documentation
└── docker-compose.yml   # Docker orchestration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS 4 + Custom Glassmorphism
- **Web3**: Reown AppKit (WalletConnect v4), Wagmi v2, Viem
- **UI**: Radix UI primitives, Shadcn/ui
- **State**: Zustand, TanStack Query
- **Animations**: Framer Motion
- **PWA**: next-pwa plugin

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 16 + Prisma ORM
- **Cache**: Redis 7
- **Auth**: JWT + Wallet signature verification
- **Validation**: Zod schemas

### Smart Contracts
- **Framework**: Foundry
- **Language**: Solidity ^0.8.20
- **Libraries**: OpenZeppelin Contracts
- **Chains**: Arbitrum Sepolia, Base Sepolia, Optimism Sepolia

### AI Services
- **Framework**: FastAPI (Python 3.11)
- **AI**: Google Gemini (1.5 Flash)
- **ML**: Scikit-learn for team matching
- **APIs**: GitHub API, Smile ID, Chainalysis

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Foundry (for smart contracts)
- Python 3.11+ (for AI services)

### Installation

```bash
# Clone repository
git clone https://github.com/safarilink/platform.git
cd SafariLink

# Install dependencies
cd frontend && npm install
cd ../backend && npm install
cd ../contracts && forge install

# Install AI Services dependencies
cd ../ai-services/mentor_bot
pip install -r requirements.txt

# Configure AI Mentor (set Google Gemini API key)
export GEMINI_API_KEY=your_gemini_api_key_here

# Start services with Docker
cd ../..
docker-compose up -d

# Or run AI Mentor locally
cd ai-services/mentor_bot
uvicorn main:app --reload --port 8000

# Run database migrations
cd ../../backend && npm run migrate
```

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

## 📚 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Detailed setup instructions
- **[API Documentation](./docs/API.md)** - REST API reference
- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture overview
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment steps
- **[Security Guide](./docs/SECURITY.md)** - Security best practices

## 🧪 Testing

```bash
# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test

# Smart contract tests
cd contracts && forge test
```

## 🐳 Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔐 Security

- Input validation on all endpoints
- Rate limiting with Redis
- JWT authentication
- Smart contract audits recommended
- KYC/AML integration ready
- OFAC screening implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Reown (WalletConnect) for Web3 wallet integration
- Google Gemini for AI integration
- All contributors and builders in the Web3 community

## 📞 Contact

- **Email**: support@safarilink.xyz
- **Website**: https://safarilink.xyz
- **Twitter**: [@SafariLink](https://twitter.com/safarilink)
- **Discord**: [Join our community](https://discord.gg/safarilink)

---

Built with ❤️ for Web3 builders in Africa and emerging markets

