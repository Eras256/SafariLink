# SafariLink Platform

The Complete Web3 Hackathon Lifecycle Platform - Optimized for Africa & Emerging Markets

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
- **AI**: Anthropic Claude (Sonnet 4)
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

# Start services with Docker
docker-compose up -d

# Run database migrations
cd backend && npm run migrate
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
- Anthropic for Claude AI integration
- All contributors and builders in the Web3 community

## 📞 Contact

- **Email**: support@safarilink.xyz
- **Website**: https://safarilink.xyz
- **Twitter**: [@SafariLink](https://twitter.com/safarilink)
- **Discord**: [Join our community](https://discord.gg/safarilink)

---

Built with ❤️ for Web3 builders in Africa and emerging markets

