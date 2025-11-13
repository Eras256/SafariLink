# Talent Protocol Integration

## Overview

SafariLink integrates with Talent Protocol to provide unified builder identity and verified reputation. Talent Protocol allows professionals to build an on-chain resume and launch a talent token ($TAL).

## What is Talent Protocol?

Talent Protocol is a platform that enables professionals to:
- Build an on-chain resume (CV)
- Launch a talent token ($TAL)
- Connect with supporters and sponsors
- Showcase career milestones and achievements
- Build verifiable reputation on-chain

## Integration Points

### 1. User Profile Sync

When a user connects their wallet, SafariLink:
1. Checks if they have a Talent Protocol profile
2. Syncs profile data (bio, avatar, skills, milestones)
3. Displays Talent Protocol badge if verified
4. Integrates $TAL token balance

### 2. Reputation System

Talent Protocol data contributes to the user's `builderScore`:
- **Base Score**: 10 points for having a profile
- **Verification**: +20 points if verified
- **Supporters**: +1 point per supporter (max 50)
- **Total Raised**: +1 point per $10 raised (max 100)
- **Milestones**: +5 points per milestone (max 50)
- **Token Balance**: +1 point per 100 tokens (max 30)
- **Max Score**: 260 points

### 3. Unified Builder Identity

SafariLink combines:
- **Human Passport**: Proof of humanity verification
- **Talent Protocol**: On-chain career and reputation
- **SafariLink Builder Score**: Hackathon participation and achievements

## API Integration

### GraphQL Endpoint
```
https://api.talentprotocol.com/graphql
```

### Example Query
```graphql
query GetUserProfile($address: String!) {
  user(address: $address) {
    id
    address
    username
    name
    bio
    avatar
    token {
      id
      symbol
      name
      totalSupply
      currentPrice
    }
    supporterCount
    totalRaised
    verified
    milestones {
      id
      title
      description
      date
      type
      verified
    }
  }
}
```

## Implementation

### Frontend
- `frontend/lib/talent-protocol/talentProtocol.ts` - API client
- `frontend/components/profile/TalentProtocolBadge.tsx` - Profile badge component
- `frontend/components/profile/TalentProtocolProfile.tsx` - Full profile display

### Backend
- `backend/src/services/talentProtocol.service.ts` - Service layer
- `backend/src/controllers/talentProtocol.controller.ts` - API endpoints
- Database schema updated with Talent Protocol fields

### Database Schema
```prisma
model User {
  // ... existing fields
  
  // Talent Protocol Integration
  talentProtocolId        String?
  talentProtocolUsername  String?
  talentProtocolVerified  Boolean   @default(false)
  talentTokenBalance      String?
  talentSupporterCount    Int       @default(0)
  talentTotalRaised       String?
  talentProtocolScore     Int       @default(0)
  talentProtocolSyncedAt  DateTime?
  talentProtocolData      Json?     // Full profile data cache
}
```

## Usage

### Check if user has Talent Protocol profile
```typescript
import { hasTalentProtocolProfile } from '@/lib/talent-protocol/talentProtocol';

const hasProfile = await hasTalentProtocolProfile(address);
```

### Fetch user profile
```typescript
import { fetchTalentProtocolProfile } from '@/lib/talent-protocol/talentProtocol';

const profile = await fetchTalentProtocolProfile(address);
```

### Calculate reputation score
```typescript
import { calculateTalentProtocolScore } from '@/lib/talent-protocol/talentProtocol';

const score = calculateTalentProtocolScore(profile);
```

## Benefits

1. **Verified Reputation**: On-chain verification of skills and achievements
2. **Unified Identity**: Single identity across multiple platforms
3. **Token Integration**: Display $TAL token balance and supporters
4. **Career Showcase**: Display milestones and achievements
5. **Trust Building**: Verified profiles increase trust in hackathon participants

## Future Enhancements

- [ ] Real-time sync with Talent Protocol API
- [ ] Support for launching talent tokens from SafariLink
- [ ] Integration with grant applications (show Talent Protocol profile)
- [ ] Team matching based on Talent Protocol skills
- [ ] Display supporters and sponsors in profile
- [ ] Milestone verification from hackathon wins

## Resources

- [Talent Protocol Website](https://www.talentprotocol.com)
- [Talent Protocol Documentation](https://docs.talentprotocol.com)
- [Talent Protocol GitHub](https://github.com/talentprotocol)

